const express = require("express");
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// ✅ Get messages between two users
router.get("/:receiverId", authMiddleware, async (req, res) => {
  const { receiverId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: receiverId },
        { sender: receiverId, receiver: req.user.id },
      ],
    })
      .populate("sender", "username") // 👈 populate sender username
      .populate("receiver", "username") // 👈 populate receiver username
      .sort("timestamp");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Send message
router.post("/", authMiddleware, async (req, res) => {
  const { receiver, content } = req.body;
  try {
    let message = new Message({
      sender: req.user.id,
      receiver,
      content,
    });
    await message.save();

    // populate sender & receiver so frontend gets full data immediately
    message = await message.populate("sender", "username");
    message = await message.populate("receiver", "username");

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
