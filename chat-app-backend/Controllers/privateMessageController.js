const mongoose = require("mongoose");
const PrivateMessage = require("../Models/PrivateMessage");
const CustomError = require("../Utils/CustomError");
const User = require("../Models/User");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const { getIO } = require("../Config/socket");
const Chat = require("../Models/Chat");

exports.sendPrivateMessage = asyncErrorHandler(async (req, res, next) => {
  const content = req?.body?.content;
  const sender = req.user;
  const receiver = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(receiver)) {
    return next(new CustomError("Invalid receiver Id!", 400));
  }
  const user = await User.findById(receiver);
  if (!user) {
    return next(new CustomError("User not found!!", 404));
  }
  if (!content) return next(new CustomError("Missing fields!!", 400));

  if (!sender?.previousChats.includes(receiver)) {
    sender?.previousChats?.unshift(receiver);
    await sender.save();
  }
  if (!user?.previousChats.includes(sender._id.toString())) {
    user?.previousChats?.unshift(sender._id.toString());
    await user.save();
  }

  const message = await PrivateMessage.create({
    sender: sender._id.toString(),
    receiver,
    content,
  });

  // await Chat.findByIdAndUpdate(data.chatId, {
  //   lastMessage: {
  //     content: message.content,
  //     sender: message.sender,
  //     createdAt: message.createdAt,
  //   },
  // });

  getIO().to([receiver, sender._id.toString()]).emit("newMessage", message);

  res.status(201).json({
    status: "success",
    message: "Message sent successfully",
  });
});

exports.getPrivateMessage = asyncErrorHandler(async (req, res, next) => {
  const sender = req.user._id.toString();
  const chatId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return next(new CustomError("Invalid receiver Id!", 400));
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new CustomError("Chat not found!", 404));
  }

  const receiver = chat?.members.find((curr) => curr._id.toString() !== sender);

  const page = req?.query?.page || 1;
  const limit = req?.query?.limit || 20;
  // const skip = (page - 1) * limit;

  // const query = {
  //   $or: [
  //     { sender: req.user._id.toString(), receiver: req.params.id },
  //     { sender: req.params.id, receiver: req.user._id.toString() },
  //   ],
  // };
  const query = {
    chatId: chatId,
  };

  // seen logic
  await PrivateMessage.updateMany(
    {
      sender: receiver._id,
      receiver: sender,
      seen: false,
    },
    { $set: { seen: true } },
  );

  const data = await PrivateMessage.find(query)
    .sort({ createdAt: -1 })
    // .skip(skip)
    .limit(limit);

  const length = await PrivateMessage.countDocuments(query);

  getIO().to(chatId).emit("messagesSeen", {
    by: sender,
  });

  res.status(200).json({
    status: "success",
    count: length,
    data,
  });
});
