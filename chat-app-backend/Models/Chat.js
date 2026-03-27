const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    members: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    lastMessage: {
      type: {
        content: String,
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: Date,
      },
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

chatSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

module.exports = mongoose.model("Chat", chatSchema);
