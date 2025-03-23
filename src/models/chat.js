const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    text: {
      type: String,
      required: true,
    },
    time: { type: String, required: true },
  },
  { timestamps: true }
);

const chatSchema = mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
  messages: {
    type: [messageSchema],
  },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
