const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");

// Clean regional copy-paste string if necessary (extract 'ap-south-1' from 'Asia Pacific (Mumbai) ap-south-1')
const rawRegion = process.env.AWS_REGION || "ap-south-1";
const region = rawRegion.trim().split(" ").pop();

const s3Client = new S3Client({
  region: region,
  credentials: {
    // Note: uses AWS_ACESS_KEY with a single 'C' exactly as configured in your .env
    accessKeyId: process.env.AWS_ACESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

/**
 * Uploads a buffer directly to your configured S3 Bucket
 * @param {Buffer} fileBuffer - File buffer from Multer
 * @param {string} mimeType - File mimetype (e.g. 'image/jpeg')
 * @returns {Promise<string>} - S3 Public Image URL
 */
const uploadToS3 = async (fileBuffer, mimeType) => {
  const uniqueKey = crypto.randomBytes(16).toString("hex");
  
  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `avatars/${uniqueKey}`,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));

  // Return the public URL of the uploaded image
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${region}.amazonaws.com/avatars/${uniqueKey}`;
};

module.exports = { uploadToS3 };
