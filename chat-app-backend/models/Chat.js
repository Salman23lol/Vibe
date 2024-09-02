const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: { type: String },
      readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      createdAt: { type: Date, default: Date.now },
      edited: { type: Boolean, default: false }
    }
  ]
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
