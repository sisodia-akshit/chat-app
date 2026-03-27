const path = require("path");
const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, Date.now() + ext); // keeps extension
//   },
// });
// const upload = multer({ storage });

const upload = multer({ dest: "uploads/" });

module.exports = upload;
