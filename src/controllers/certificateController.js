import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import mongoose from "mongoose";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { uploadToS3 } from "../utils/s3.js";
import Certificate from "../models/Certificate.js";

dotenv.config();

let nanoid;
(async () => {
  const { customAlphabet } = await import("nanoid");
  nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);
})();

// Validate required Cloudinary envs early (optional but helpful)
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.warn("Warning: CLOUDINARY_CLOUD_NAME is not set in .env — Cloudinary uploads will fail.");
}
if (!process.env.CLOUDINARY_API_KEY) {
  console.warn("Warning: CLOUDINARY_API_KEY not set in .env — Cloudinary uploads will fail.");
}
if (!process.env.CLOUDINARY_API_SECRET) {
  console.warn("Warning: CLOUDINARY_API_SECRET not set in .env — Cloudinary uploads will fail.");
}

// CREATE CERTIFICATE (with S3 upload)
export const createCertificate = async (req, res) => {
  try {
    const { name, event, date } = req.body;

    if (!name || !event) {
      return res.status(400).json({ error: "Name and Event are required" });
    }

    // wait until nanoid is ready
    while (!nanoid) await new Promise((r) => setTimeout(r, 10));

    // Temporary folder to generate PDF
    const tempDir = path.join(process.cwd(), "public", "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const fileName = `${name.replace(/\s+/g, "_")}_${Date.now()}.pdf`;
    const filePath = path.join(tempDir, fileName);

    // Load PDF template
    const templatePath = path.join(process.cwd(), "public", "templates", "certificate-template.pdf");
    if (!fs.existsSync(templatePath)) {
      return res.status(500).json({ error: "Certificate template not found in /public/templates/" });
    }

    const templateBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Draw recipient name (bold)
    firstPage.drawText(name, { x: 70, y: 280, size: 35, font: boldFont, color: rgb(0, 0, 0) });

    // Prepare achievement text
    const achievementText = `For an outstanding achievement at ${event} with `;

    function wrapText(text, font, size, maxWidth) {
      const words = text.split(" ");
      let line = "";
      const lines = [];

      words.forEach((word) => {
        const testLine = line ? line + " " + word : word;
        const width = font.widthOfTextAtSize(testLine, size);
        if (width > maxWidth) {
          lines.push(line);
          line = word;
        } else {
          line = testLine;
        }
      });

      if (line) lines.push(line);
      return lines;
    }

    // Draw wrapped achievement text (single-font)
    let yPosition = 220;
    const wrappedLines = wrapText(achievementText, normalFont, 18, 450);
    wrappedLines.forEach((line) => {
      firstPage.drawText(line, { x: 70, y: yPosition, size: 18, font: normalFont, color: rgb(0, 0, 0) });
      yPosition -= 25;
    });

    // Add date
    firstPage.drawText(`Date: ${date || new Date().toLocaleDateString()}`, {
      x: 70,
      y: 100,
      size: 12,
      font: normalFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    // Pre-generate Mongo ObjectId and encrypted certificateId
    const tempId = new mongoose.Types.ObjectId();
    const secretKey = process.env.CERT_SECRET || "mysecretkey";
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(tempId.toString())
      .digest("hex")
      .slice(0, 12)
      .toUpperCase();
    const certificateId = `AWS-${hash}`;

    // Draw certificate ID on PDF
    firstPage.drawText(`Certificate ID: ${certificateId}`, {
      x: 70,
      y: 70,
      size: 10,
      font: normalFont,
      color: rgb(0.4, 0.4, 0.4),
    });

    // Save PDF locally
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(filePath, pdfBytes);

    // Upload to Cloudinary
    const fileContent = fs.readFileSync(filePath);

    try {
      const cloudinaryUrl = await uploadToS3(fileContent, fileName, "application/pdf", "certificates");
      s3Url = cloudinaryUrl;
    } catch (uploadErr) {
      console.error("Cloudinary upload failed:", uploadErr);
      return res.status(500).json({ error: "Failed to upload PDF to Cloudinary", details: uploadErr.message });
    }

    // Delete local temp file
    try {
      fs.unlinkSync(filePath);
    } catch (unlinkErr) {
      console.warn("Could not delete temp file:", unlinkErr);
    }

    // Create DB entry
    const certificate = await Certificate.create({
      _id: tempId,
      name,
      event,
      date,
      pdfPath: s3Url,
      issuedBy: req.user?._id || null,
      certificateId,
    });

    return res.status(201).json({
      message: "Certificate created, uploaded to Cloudinary & saved in DB",
      certificate,
    });
  } catch (error) {
    console.error("Error creating certificate:", error);
    return res.status(500).json({ error: "Failed to create certificate", details: error.message });
  }
};

// GET ALL CERTIFICATES
export const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ date: -1 });
    res.status(200).json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error.message);
    res.status(500).json({ error: "Failed to fetch certificates", details: error.message });
  }
};

// GET CERTIFICATE BY ID
export const getCertificateById = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findOne({ certificateId });
    if (!certificate) return res.status(404).json({ error: "Certificate not found" });
    res.status(200).json(certificate);
  } catch (error) {
    console.error("Error fetching certificate:", error.message);
    res.status(500).json({ error: "Failed to fetch certificate", details: error.message });
  }
};

// DELETE CERTIFICATE
export const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCertificate = await Certificate.findOneAndDelete({ certificateId: id });
    if (!deletedCertificate) return res.status(404).json({ error: "Certificate not found" });
    res.status(200).json({ message: "Certificate deleted successfully", certificate: deletedCertificate });
  } catch (error) {
    console.error("Error deleting certificate:", error.message);
    res.status(500).json({ error: "Failed to delete certificate", details: error.message });
  }
};