const { Server } = require("socket.io");
const CustomError = require("../Utils/CustomError");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const mongoose = require("mongoose");
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const PrivateMessage = require("../Models/PrivateMessage");
const Chat = require("../Models/Chat");
let io;

const initSocket = (server) => {
  io = new Server(server);

  io.use(async (socket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie;

      if (!rawCookie) {
        return next(new CustomError("Not authenticated", 401));
      }

      const parsed = cookie.parse(rawCookie);

      const token = parsed?.token;

      if (!token) {
        return next(new CustomError("Invalid or expired token!", 400));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new CustomError("User not found!", 404));
      }

      socket.user = user;
      next();
    } catch (error) {
      return next(new CustomError("Authentication failed!", 400));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket Connected", socket.id);

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`${socket.user.name} joins ${chatId}`);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const content = data?.content;
        const sender = socket?.user;
        const chatId = data?.chatId;

        if (!mongoose.Types.ObjectId.isValid(chatId)) {
          return socket.emit("error", "Invalid chatId");
        }
        if (!content) {
          return socket.emit("error", "Content required");
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
          return socket.emit("error", "Chat not found");
        }

        const receiver = chat?.members.find(
          (curr) => curr._id.toString() !== sender._id.toString(),
        );
        
        const message = await PrivateMessage.create({
          chatId,
          sender: sender._id.toString(),
          receiver,
          content,
        });

        //  update lastMessage
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: {
            content: message.content,
            sender: message.sender,
            createdAt: message.createdAt,
          },
        });

        getIO().to(chatId).emit("newMessage", message);
      } catch (error) {
        console.log(err);
        socket.emit("error", "Something went wrong");
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initSocket, getIO };
