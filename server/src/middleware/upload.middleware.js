// server/src/middleware/upload.middleware.js
import multer from 'multer';
import { ApiResponse } from '../utils/apiResponse.js';

const storage = multer.memoryStorage();

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024, // 8 MB limit as specified
  },
  fileFilter,
});

export const handleImageUpload = (fieldName = 'image') => {
  return (req, res, next) => {
    const uploadSingle = upload.single(fieldName);
    uploadSingle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return ApiResponse.error(res, 'Uploaded image exceeds the maximum 8 MB limit.', 'FILE_TOO_LARGE', [], 400);
        }
        return ApiResponse.error(res, `Upload error: ${err.message}`, 'UPLOAD_ERROR', [], 400);
      } else if (err) {
        return ApiResponse.error(res, err.message, 'INVALID_FILE_TYPE', [], 400);
      }
      next();
    });
  };
};
