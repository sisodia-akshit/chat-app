const fs = require("fs");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const cloudinary = require("../Config/cloudinary");
const { getIO } = require("../Config/socket");
const User = require("../Models/User");
const CustomError = require("../Utils/CustomError");
const mongoose = require("mongoose");
const PrivateMessage = require("../Models/PrivateMessage");
const Chat = require("../Models/Chat");

const getResourceType = (mimetype) => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("audio/")) return "video";
  return "raw"; // everything else
};

exports.uploadHandler = asyncErrorHandler(async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "auto",
  });

  //delete local files after upload

  fs.unlinkSync(req.file.path);

  res.json({
    url: result.secure_url,
    public_id: result.public_id,
  });
});
exports.audioUploadHandler = asyncErrorHandler(async (req, res) => {
  console.log(req.file);
  const result = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "video",
    timeout: 60000,
  });

  //delete local files after upload

  fs.unlinkSync(req.file.path);

  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    url: result.secure_url,
    public_id: result.public_id,
  });
});

exports.multiUploadHandler = asyncErrorHandler(async (req, res, next) => {
  const content = req?.body?.content;
  const chatId = req.params.id;
  const sender = req.user;

  const files = req.files;
  console.log(files, content);
  const results = [];

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return next(new CustomError("Invalid chat Id!", 400));
  }
  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new CustomError("No chat found!!", 404));
  }

  const receiver = chat?.members.find((curr) => curr._id.toString() !== sender);

  for (const file of files) {
    let resourceType = getResourceType(file.mimetype);

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: resourceType,
      timeout: 60000,
    });

    results.push({
      name: file.originalname,
      type: file.mimetype,
      url: result.secure_url,
    });
  }

  const data = {
    chatId,
    sender: sender._id.toString(),
    receiver: receiver._id,
    files: results,
  };
  if (content) {
    data.content = content;
  }

  const message = await PrivateMessage.create(data);

  getIO().to(chatId).emit("newMessage", message);

  res.status(200).json({
    status: "success",
    message: "Data sent successfully",
  });
});

// exports.multiUploadHandler = asyncErrorHandler(async (req, res, next) => {
//   const files = req.files;
//   const results = [];

//   for (const file of files) {
//     let resourceType = getResourceType(file.mimetype);

//     const result = await cloudinary.uploader.upload(file.path, {
//       resource_type: resourceType,
//       timeout: 60000,
//     });

//     results.push({
//       name: file.originalname,
//       type: file.mimetype,
//       url: result.secure_url,
//     });
//   }

//   res.status(200).json({ status: "success", data: results });
// });
