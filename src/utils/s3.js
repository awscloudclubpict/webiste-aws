import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from "uuid";

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'decsqklwv',
  api_key:'123733526588479',
  api_secret:'fBzt5NVXv6tkr9ZBf5kWWDF2tsA',
});

/**
 * Upload file to Cloudinary and return the URL
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - Original file name
 * @param {string} mimeType - File MIME type
 * @param {string} folder - Folder name (default: 'events')
 * @returns {Promise<string>} - Cloudinary URL of uploaded file
 */
export const uploadToS3 = async (fileBuffer, fileName, mimeType, folder = "events") => {
  try {
    // Generate unique public_id to avoid conflicts
    const fileExtension = fileName.split(".").pop();
    const publicId = `${folder}/${uuidv4()}`;

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: folder,
          public_id: uuidv4(),
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(fileBuffer);
    });

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} imageUrl - The Cloudinary URL of the file to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteFromS3 = async (imageUrl) => {
  try {
    // Extract public_id from Cloudinary URL
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex === -1) throw new Error('Invalid Cloudinary URL');
    const publicIdWithVersion = urlParts.slice(uploadIndex + 2).join('/').split('.')[0]; // Remove version and format

    const result = await cloudinary.uploader.destroy(publicIdWithVersion);
    return result.result === 'ok';
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return false;
  }
};

export default cloudinary;
