import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Memory storage allows us to directly write to MongoDB & disk simultaneously
const storage = multer.memoryStorage();

const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif'
];

const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10); // default 5MB

export const upload = multer({
  storage,
  limits: {
    fileSize: maxFileSize
  },
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only JPG, JPEG, PNG, and WEBP images are accepted.'));
    }
  }
});
