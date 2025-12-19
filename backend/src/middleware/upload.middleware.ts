import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import crypto from 'crypto';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
const avatarsDir = path.join(uploadsDir, 'avatars');
const documentsDir = path.join(uploadsDir, 'documents');
const propertiesDir = path.join(uploadsDir, 'properties');

[uploadsDir, avatarsDir, documentsDir, propertiesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    let uploadPath = uploadsDir;

    // Determine upload path based on fieldname
    if (file.fieldname === 'avatar') {
      uploadPath = avatarsDir;
    } else if (file.fieldname.includes('document') || file.fieldname.includes('Document')) {
      uploadPath = documentsDir;
    } else if (file.fieldname.includes('image') || file.fieldname.includes('Image')) {
      uploadPath = propertiesDir;
    }

    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate unique filename
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${Date.now()}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

// File filter for images
const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
  }
};

// File filter for documents
const documentFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, images, and Word documents are allowed.'));
  }
};

// File filter for KYC documents
const kycFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and image files are allowed for KYC.'));
  }
};

// Size limits (in bytes)
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB default
  avatar: 2 * 1024 * 1024,   // 2MB for avatars
  document: 10 * 1024 * 1024, // 10MB for documents
  propertyImage: 5 * 1024 * 1024 // 5MB for property images
};

// Upload middleware for avatars
export const avatarUpload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: limits.avatar }
});

// Upload middleware for documents
export const documentUpload = multer({
  storage,
  fileFilter: documentFilter,
  limits: { fileSize: limits.document }
});

// Upload middleware for KYC documents
export const kycUpload = multer({
  storage,
  fileFilter: kycFilter,
  limits: { fileSize: limits.document }
});

// Upload middleware for property images
export const propertyImageUpload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: limits.propertyImage }
});

// Generic upload middleware
export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: limits.fileSize }
});

// Error handler for multer errors
export const handleUploadError = (error: any, req: Request, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large',
        maxSize: '5MB'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name',
        error: error.message
      });
    }
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'File upload error'
    });
  }

  next();
};

// Helper function to delete uploaded file
export const deleteUploadedFile = (filepath: string): void => {
  try {
    const fullPath = path.join(process.cwd(), filepath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

// Helper function to get file URL
export const getFileUrl = (filename: string, folder: string = ''): string => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/uploads${folder ? '/' + folder : ''}/${filename}`;
};

export default {
  uploadMiddleware,
  avatarUpload,
  documentUpload,
  kycUpload,
  propertyImageUpload,
  handleUploadError,
  deleteUploadedFile,
  getFileUrl
};
