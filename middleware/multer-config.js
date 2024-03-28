const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// const MIME_TYPES = {
//   "image/jpg": "jpg",
//   "image/jpeg": "jpg",
//   "image/png": "png",
// };

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "images");
//   },
//   filename: (req, file, callback) => {
//     const name = file.originalname.split(" ").join("_");
//     const extension = MIME_TYPES[file.mimetype];
//     callback(null, name + Date.now() + "." + extension);
//   },
// });

cloudinary.config({
  cloud_name: "db4izxstp",
  api_key: "916193574981994",
  api_secret: "d3yHm3qb6wdGgVyJYwVyj-MqNOI",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

module.exports = multer({ storage: storage }).single("image");
