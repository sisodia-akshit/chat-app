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
    socket.join(socket?.user?._id.toString());
    console.log(`${socket?.user?.name} Connected`);

    socket.on("joinChat", async (chatId) => {
      socket.join(chatId);
      socket.to(chatId).emit("updateSeen", "message seen");
      console.log(`${socket.user.name} joins ${chatId}`);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const content = data?.content;
        const chatId = data?.chatId;
        const receiverId = data?.receiverId;
        const nonce = data?.nonce;
        const senderId = data?.senderId;

        const sender = socket?.user;

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

        const receiver = await User.findById(receiverId);

        // add Message to db
        const message = await PrivateMessage.create({
          chatId,
          sender: senderId,
          receiver: receiverId,
          content,
          nonce,
        });

        // add new chat in prevChats list
        if (!sender.previousChats.includes(chatId)) {
          sender.previousChats.unshift(chatId);
          await sender.save();
        }
        if (!receiver.previousChats.includes(chatId)) {
          receiver.previousChats?.unshift(chatId);
          await receiver.save();
        }

        //  update lastMessage in db
        const updatedChat = await Chat.findByIdAndUpdate(
          chatId,
          {
            lastMessage: {
              content: message.content,
              nonce,
              sender: message.sender,
              createdAt: message.createdAt,
            },
          },
          { returnDocument: "after" },
        ).populate("members", "name email photo publicKey");

        getIO().to(chatId).emit("newMessage", message);
        getIO().to([receiverId, senderId]).emit("updateChat", updatedChat);
      } catch (error) {
        console.log(error);
        socket.emit("error", "Something went wrong");
      }
    });

    socket.on("seenMessage", async ({ chatId, receiverId }) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
          return socket.emit("error", "Chat not found");
        }
        const sender = socket.user;

        const senderId = sender._id.toString();

        await PrivateMessage.updateMany(
          {
            sender: receiverId,
            receiver: senderId,
            seen: false,
          },
          { $set: { seen: true } },
        );

        socket.to(chatId).emit("updateSeen", "message seen");
      } catch (error) {
        console.log(error);
        socket.emit("error", "Something went wrong");
      }
    });

    socket.on("leaveChat", (message) => {
      console.log(`leaveChat ${message}`);
    });

    socket.on("disconnect", () => {
      console.log(`${socket?.user?.name} disconnected:`, socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initSocket, getIO };
