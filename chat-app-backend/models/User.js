// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  accountImage: { type: String, required: true },
  accountPhoneNo: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, default: "offline" },
  contacts: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: { type: String, default: "active" },
    },
  ],
  blockedContacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  mutedContacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  notifications: [
    {
      message: { type: String },
      type: { type: String },
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      date: { type: Date, default: Date.now },
      expiresAt: { type: Date }, // New field
    },
  ],
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
  joinDate: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
