const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET, 
});

// Storage for Profile Photos
const profilePhotoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ProfilePhotos", 
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// Storage for Resumes
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Resumes",
    allowed_formats: ["pdf", "doc", "docx"],
  },
});

// Multer uploaders
const uploadProfilePhoto = multer({ storage: profilePhotoStorage });
const uploadResume = multer({ storage: resumeStorage });

module.exports = {
  uploadProfilePhoto,
  uploadResume,
};
