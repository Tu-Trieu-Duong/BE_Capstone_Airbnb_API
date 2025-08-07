import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

fs.mkdirSync('images/', { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'local' + '-' + uniqueSuffix + extname);
  },
});

export const uploadLocal = {
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
};
