import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.join(__dirname, '../../uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Ensure upload directory exists
const ensureUploadDir = async () => {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
};

// Configure multer storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'), false);
  }
};

// Multer configuration
export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

// Process and save image
export const processAndSaveImage = async (
  buffer: Buffer,
  filename: string,
  folder: string = 'kyc'
): Promise<string> => {
  await ensureUploadDir();
  
  const uploadPath = path.join(UPLOAD_DIR, folder);
  await fs.mkdir(uploadPath, { recursive: true });
  
  const uniqueFilename = `${uuidv4()}-${filename}`;
  const filepath = path.join(uploadPath, uniqueFilename);
  
  // Compress and optimize image
  await sharp(buffer)
    .resize(1920, 1080, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 85 })
    .toFile(filepath);
  
  // Return relative path
  return `/${folder}/${uniqueFilename}`;
};

// Delete file
export const deleteFile = async (filepath: string): Promise<void> => {
  try {
    const fullPath = path.join(UPLOAD_DIR, filepath);
    await fs.unlink(fullPath);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

// Validate image
export const validateImage = async (buffer: Buffer): Promise<boolean> => {
  try {
    const metadata = await sharp(buffer).metadata();
    return !!(metadata.width && metadata.height);
  } catch {
    return false;
  }
};
