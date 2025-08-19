require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const fs = require("fs");
const { Server } = require("socket.io");
const authRoutes = require("./src/routes/auth");
const messageRoutes = require("./src/routes/messages");
const usersRoutes = require("./src/routes/users");
const Message = require("./src/models/Message");
const morgan = require("morgan");

const app = express();

const server = http.createServer(app);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use([
  cors({
    origin: [
      "http://localhost:3000",
      "https://chat-app-client-kappa-henna.vercel.app",
    ],
  }),
  express.json(),
  morgan("dev"),
]);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", usersRoutes);

app.get("/", (req, res) => {
  res.json("Server is running!");
});

const io = new Server(server, {
  cors: {
    origin: "https://chat-app-client-kappa-henna.vercel.app",
    methods: ["GET", "POST"],
  },
});

// Socket.IO for real-time chat and notifications
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a chat room
  socket.on("joinRoom", ({ room }) => {
    socket.join(room);
  });

  // Handle chat messages
  socket.on(
    "chatMessage",
    async ({ room, message, sender, receiver, timestamp }) => {
      // Send the chat message to the room
      io.to(room).emit("message", { room, message, sender, timestamp });
      console.log(room, message, sender, receiver);

      const sentMessage = {
        sender: { _id: sender._id, username: sender.username },
        receiver: { _id: receiver._id, username: receiver.username },
        content: message,
        timestamp: timestamp,
      };

      const msg = await Message.create(sentMessage);

      console.log(msg);

      // Send a notification to all users except sender
      io.sockets.sockets.forEach((s) => {
        if (s.id !== socket.id) {
          s.emit("nonfiction", { username: sender.username, message });
        }
      });
    }
  );

  // Handle typing indicator
  socket.on("typing", ({ room, username }) => {
    // Emit typing event to everyone in the room except the sender
    socket.to(room).emit("typing", { username });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
