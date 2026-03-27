const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    photo: {
      type: String,
      default:
        "https://i.pinimg.com/736x/62/01/0d/62010d848b790a2336d1542fcda51789.jpg",
    },
    previousChats: {
      // type: [String],
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    archiveChats: {
      type: [String],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    loginAttemts: {
      type: Number,
      max: 5,
      default: 0,
    },
    lockoutUntil: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpires: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
