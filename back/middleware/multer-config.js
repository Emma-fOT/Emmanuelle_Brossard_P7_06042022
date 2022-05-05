const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const nameWithoutExtension = name.split(".").slice(0, -1).join(".");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, nameWithoutExtension + "_" + Date.now() + "." + extension);
  },
});

// To rename a file with a unique name and upload it to the server
module.exports = multer({ storage: storage }).single("imageUrl");
