const express = require("express");
const Message = require("../models/Message");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

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
