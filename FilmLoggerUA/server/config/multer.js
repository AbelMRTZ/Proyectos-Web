const multer = require("multer");

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",   
];

const MAX_FILE_SIZE_MB = 50;

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: "${file.mimetype}". Allowed: jpeg, png, webp, gif, mp4, mov, avi.`
      ),
      false
    );
  }
};

/**
 * .fields() lets us accept two distinct file inputs in one request:
 *   - portada  → single image (max 1)
 *   - files    → multimedia content (max 10)
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter,
});

module.exports = upload;