// import dotenv from "dotenv";
// import fs from "fs";
// import path from "path";
// import crypto from "crypto";
// import mongoose from "mongoose";
// import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
// import { uploadToS3 } from "../utils/s3.js";
// import Certificate from "../models/Certificate.js";

// dotenv.config();

// let nanoid;
// (async () => {
//   const { customAlphabet } = await import("nanoid");
//   nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);
// })();

// // Validate required Cloudinary envs early (optional but helpful)
// if (!process.env.CLOUDINARY_CLOUD_NAME) {
//   console.warn("Warning: CLOUDINARY_CLOUD_NAME is not set in .env — Cloudinary uploads will fail.");
// }
// if (!process.env.CLOUDINARY_API_KEY) {
//   console.warn("Warning: CLOUDINARY_API_KEY not set in .env — Cloudinary uploads will fail.");
// }
// if (!process.env.CLOUDINARY_API_SECRET) {
//   console.warn("Warning: CLOUDINARY_API_SECRET not set in .env — Cloudinary uploads will fail.");
// }

// // CREATE CERTIFICATE (with S3 upload)
// export const createCertificate = async (req, res) => {
//   try {
//     const { name, event, date } = req.body;

//     if (!name || !event) {
//       return res.status(400).json({ error: "Name and Event are required" });
//     }

//     // wait until nanoid is ready
//     while (!nanoid) await new Promise((r) => setTimeout(r, 10));

//     // Temporary folder to generate PDF
//     const tempDir = path.join(process.cwd(), "public", "temp");
//     if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

//     const fileName = `${name.replace(/\s+/g, "_")}_${Date.now()}.pdf`;
//     const filePath = path.join(tempDir, fileName);

//     // Load PDF template
//     const templatePath = path.join(process.cwd(), "public", "templates", "certificate-template.pdf");
//     if (!fs.existsSync(templatePath)) {
//       return res.status(500).json({ error: "Certificate template not found in /public/templates/" });
//     }

//     const templateBytes = fs.readFileSync(templatePath);
//     const pdfDoc = await PDFDocument.load(templateBytes);
//     const pages = pdfDoc.getPages();
//     const firstPage = pages[0];

//     const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
//     const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

//     // Draw recipient name (bold)
//     firstPage.drawText(name, { x: 70, y: 280, size: 35, font: boldFont, color: rgb(0, 0, 0) });

//     // Prepare achievement text
//     const achievementText = `For an outstanding achievement at ${event} with `;

//     function wrapText(text, font, size, maxWidth) {
//       const words = text.split(" ");
//       let line = "";
//       const lines = [];

//       words.forEach((word) => {
//         const testLine = line ? line + " " + word : word;
//         const width = font.widthOfTextAtSize(testLine, size);
//         if (width > maxWidth) {
//           lines.push(line);
//           line = word;
//         } else {
//           line = testLine;
//         }
//       });

//       if (line) lines.push(line);
//       return lines;
//     }

//     // Draw wrapped achievement text (single-font)
//     let yPosition = 220;
//     const wrappedLines = wrapText(achievementText, normalFont, 18, 450);
//     wrappedLines.forEach((line) => {
//       firstPage.drawText(line, { x: 70, y: yPosition, size: 18, font: normalFont, color: rgb(0, 0, 0) });
//       yPosition -= 25;
//     });

//     // Add date
//     firstPage.drawText(`Date: ${date || new Date().toLocaleDateString()}`, {
//       x: 70,
//       y: 100,
//       size: 12,
//       font: normalFont,
//       color: rgb(0.2, 0.2, 0.2),
//     });

//     // Pre-generate Mongo ObjectId and encrypted certificateId
//     const tempId = new mongoose.Types.ObjectId();
//     const secretKey = process.env.CERT_SECRET || "mysecretkey";
//     const hash = crypto
//       .createHmac("sha256", secretKey)
//       .update(tempId.toString())
//       .digest("hex")
//       .slice(0, 12)
//       .toUpperCase();
//     const certificateId = `AWS-${hash}`;

//     // Draw certificate ID on PDF
//     firstPage.drawText(`Certificate ID: ${certificateId}`, {
//       x: 70,
//       y: 70,
//       size: 10,
//       font: normalFont,
//       color: rgb(0.4, 0.4, 0.4),
//     });

//     // Save PDF locally
//     const pdfBytes = await pdfDoc.save();
//     fs.writeFileSync(filePath, pdfBytes);

//     // Upload to Cloudinary
//     const fileContent = fs.readFileSync(filePath);

//     try {
//       const cloudinaryUrl = await uploadToS3(fileContent, fileName, "application/pdf", "certificates");
//       s3Url = cloudinaryUrl;
//     } catch (uploadErr) {
//       console.error("Cloudinary upload failed:", uploadErr);
//       return res.status(500).json({ error: "Failed to upload PDF to Cloudinary", details: uploadErr.message });
//     }

//     // Delete local temp file
//     try {
//       fs.unlinkSync(filePath);
//     } catch (unlinkErr) {
//       console.warn("Could not delete temp file:", unlinkErr);
//     }

//     // Create DB entry
//     const certificate = await Certificate.create({
//       _id: tempId,
//       name,
//       event,
//       date,
//       pdfPath: s3Url,
//       issuedBy: req.user?._id || null,
//       certificateId,
//     });

//     return res.status(201).json({
//       message: "Certificate created, uploaded to Cloudinary & saved in DB",
//       certificate,
//     });
//   } catch (error) {
//     console.error("Error creating certificate:", error);
//     return res.status(500).json({ error: "Failed to create certificate", details: error.message });
//   }
// };

// // GET ALL CERTIFICATES
// export const getAllCertificates = async (req, res) => {
//   try {
//     const certificates = await Certificate.find().sort({ date: -1 });
//     res.status(200).json(certificates);
//   } catch (error) {
//     console.error("Error fetching certificates:", error.message);
//     res.status(500).json({ error: "Failed to fetch certificates", details: error.message });
//   }
// };

// // GET CERTIFICATE BY ID
// export const getCertificateById = async (req, res) => {
//   try {
//     const { certificateId } = req.params;
//     const certificate = await Certificate.findOne({ certificateId });
//     if (!certificate) return res.status(404).json({ error: "Certificate not found" });
//     res.status(200).json(certificate);
//   } catch (error) {
//     console.error("Error fetching certificate:", error.message);
//     res.status(500).json({ error: "Failed to fetch certificate", details: error.message });
//   }
// };

// // DELETE CERTIFICATE
// export const deleteCertificate = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedCertificate = await Certificate.findOneAndDelete({ certificateId: id });
//     if (!deletedCertificate) return res.status(404).json({ error: "Certificate not found" });
//     res.status(200).json({ message: "Certificate deleted successfully", certificate: deletedCertificate });
//   } catch (error) {
//     console.error("Error deleting certificate:", error.message);
//     res.status(500).json({ error: "Failed to delete certificate", details: error.message });
//   }
// };




import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import mongoose from "mongoose";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { uploadToS3 } from "../utils/s3.js";
import Certificate from "../models/Certificate.js";
import User from "../models/User.js";

dotenv.config();

// ✅ Initialize nanoid
let nanoid;
(async () => {
  const { customAlphabet } = await import("nanoid");
  nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);
  console.info(`[INIT] nanoid initialized`);
})();

// ✅ Check ENV
if (!process.env.CERT_SECRET) console.warn(`[WARN] CERT_SECRET missing in .env`);

// ✅ CREATE CERTIFICATE
export const createCertificate = async (req, res) => {
  const requestId = `REQ-${Date.now()}`;
  console.info(`\n[${requestId}] 🎫 Certificate generation request received`, req.body);

  try {
    const { name, event, date, studentId, eventId } = req.body;

    if (!name || !event || !studentId || !eventId) {
      console.warn(`[${requestId}] 🛑 Missing required fields`);
      return res.status(400).json({
        success: false,
        error: "Required: name, event, studentId, eventId",
      });
    }

    console.info(`[${requestId}] 🔎 Fetching user: ${studentId}`);
    const user = await User.findById(studentId);

    if (!user) {
      console.warn(`[${requestId}] ❗ User not found: ${studentId}`);
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const regEvent = user.registeredEvents.find(
      (e) => e.event.toString() === eventId
    );

    if (!regEvent) {
      console.warn(`[${requestId}] ❌ User not registered for event ${eventId}`);
      return res.status(400).json({
        success: false,
        error: "User not registered for this event",
      });
    }

    if (!regEvent.attendanceMarked) {
      console.warn(`[${requestId}] ⚠️ Attendance not marked, certificate denied`);
      return res.status(400).json({
        success: false,
        error: "Attendance not marked, certificate cannot be generated",
      });
    }

    if (regEvent.certificateGenerated) {
      console.warn(`[${requestId}] ✅ Certificate already generated`);
      return res.status(400).json({
        success: false,
        error: "Certificate already issued",
      });
    }

    // ✅ Wait until nanoid ready
    while (!nanoid) await new Promise((r) => setTimeout(r, 5));

    // ✅ Paths
    const tempDir = path.join(process.cwd(), "public", "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const fileName = `${name.replace(/\s+/g, "_")}_${Date.now()}.pdf`;
    const filePath = path.join(tempDir, fileName);
    const templatePath = path.join(
      process.cwd(),
      "public",
      "templates",
      "certificate-template.pdf"
    );

    if (!fs.existsSync(templatePath)) {
      console.error(`[${requestId}] ❌ PDF template missing`);
      return res.status(500).json({ success: false, error: "Template missing" });
    }

    console.info(`[${requestId}] 🧾 Loading PDF template`);

    let pdfDoc;
    try {
      const templateBytes = fs.readFileSync(templatePath);
      pdfDoc = await PDFDocument.load(templateBytes);
    } catch (e) {
      console.error(`[${requestId}] ⚠️ PDF load failed`, e);
      return res.status(500).json({ success: false, error: "Failed to load template" });
    }

    const firstPage = pdfDoc.getPages()[0];
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // ✅ Add text to PDF
    console.info(`[${requestId}] ✍️ Writing certificate content`);
    firstPage.drawText(name, { x: 70, y: 280, size: 35, font: boldFont });

    firstPage.drawText(`For successfully participating in ${event}`, {
      x: 70,
      y: 220,
      size: 18,
      font: normalFont,
    });

    firstPage.drawText(`Date: ${date || new Date().toLocaleDateString()}`, {
      x: 70,
      y: 100,
      size: 12,
      font: normalFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    const tempId = new mongoose.Types.ObjectId();
    const hash = crypto
      .createHmac("sha256", process.env.CERT_SECRET || "fallbacksecret")
      .update(tempId.toString())
      .digest("hex")
      .slice(0, 12)
      .toUpperCase();

    const certificateId = `AWS-${hash}`;
    firstPage.drawText(`Certificate ID: ${certificateId}`, {
      x: 70,
      y: 70,
      size: 10,
      font: normalFont,
      color: rgb(0.4, 0.4, 0.4),
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(filePath, pdfBytes);

    console.info(`[${requestId}] 📤 Uploading certificate to S3...`);

    let s3Url;
    try {
      s3Url = await uploadToS3(
        fs.readFileSync(filePath),
        fileName,
        "application/pdf",
        "certificates"
      );
      fs.unlinkSync(filePath);
    } catch (e) {
      console.error(`[${requestId}] ❌ S3 Upload failed`, e);
      return res.status(500).json({
        success: false,
        error: "Cloud upload failed",
        log: e.message,
      });
    }

    console.info(`[${requestId}] ✅ Uploaded to S3: ${s3Url}`);

    const certificate = await Certificate.create({
      _id: tempId,
      name,
      event,
      date,
      pdfPath: s3Url,
      certificateId,
      issuedBy: req.user?._id || null,
    });

    console.info(`[${requestId}] 🧑‍🎓 Updating user certificate status`);

    await User.updateOne(
      { _id: studentId, "registeredEvents.event": eventId },
      {
        $set: {
          "registeredEvents.$.certificateGenerated": true,
          "registeredEvents.$.certificateUrl": s3Url,
        },
      }
    );

    console.info(
      `[${requestId}] ✅ Certificate ready for ${name} | ID: ${certificateId}`
    );

    return res.status(201).json({
      success: true,
      message: "Certificate generated successfully ✅",
      url: s3Url,
      certificate,
    });
  } catch (err) {
    console.error(`[${requestId}] ❌ Fatal Error`, err);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      log: err.message,
    });
  }
};

// ✅ GET CERTIFICATE BY ID
export const getCertificateById = async (req, res) => {
  console.info(`🔍 Fetch cert: ${req.params.certificateId}`);

  try {
    const cert = await Certificate.findOne({ certificateId: req.params.certificateId });
    if (!cert) {
      console.warn(`❗ Certificate not found`);
      return res.status(404).json({ success: false, error: "Certificate not found" });
    }
    res.json({ success: true, cert });
  } catch (err) {
    console.error(`❌ Error fetching certificate`, err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ GET ALL CERTIFICATES
export const getAllCertificates = async (req, res) => {
  console.info(`📂 Fetching all certificates`);
  try {
    const certs = await Certificate.find().sort({ createdAt: -1 });
    res.json({ success: true, certs });
  } catch (err) {
    console.error(`❌ Error fetching certificates`, err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ DELETE
export const deleteCertificate = async (req, res) => {
  console.warn(`🗑️ Deleting certificate: ${req.params.id}`);
  try {
    const cert = await Certificate.findOneAndDelete({ certificateId: req.params.id });
    if (!cert) return res.status(404).json({ success: false, error: "Certificate not found" });

    res.json({ success: true, message: "Certificate deleted", cert });
  } catch (err) {
    console.error(`❌ Delete error`, err);
    res.status(500).json({ success: false, error: err.message });
  }
};
