// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const https = require("https");
// const fs = require("fs");
// const { Server } = require("socket.io");

// const app = express();
// const option = {
//   key: fs.readFileSync("./key.pem"),
//   cert: fs.readFileSync("./cert.pem"),
// };

// const server = https.createServer(option, app);

// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://10.10.7.101:3000",
//       "http://10.10.7.101:3000",
//       "https://8aee5bdba9a3.ngrok-free.app",
//     ],
//     methods: ["GET", "POST"],
//   },
// });

// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://10.10.7.101:5000",
//       "https://8aee5bdba9a3.ngrok-free.app",
//     ],
//   })
// );
// app.use(express.json());

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));

// // Routes
// const authRoutes = require("./routes/auth");
// const messageRoutes = require("./routes/messages");
// const usersRoutes = require("./routes/users");
// const Message = require("./models/Message");

// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);
// app.use("/api/users", usersRoutes);

// // Socket.IO for real-time chat
// io.on("connection", (socket) => {
//   // console.log("User connected:", socket.id);

//   socket.on("joinRoom", ({ room }) => {
//     // socket.join(room);
//     // console.log(`User ${socket.id} joined room ${room}`);
//   });

//   socket.on("chatMessage", async ({ room, message, sender, receiver }) => {
//     // console.log(
//     //   `Message from ${sender.username}: ${message} to room ${room} and ${receiver}`
//     // );

//     socket.on("nonfiction", (data) => {
//       socket.emit("nonfiction", data);
//       // console.log(data);
//     });
//     // Send to all users in room, including sender
//     io.to(room).emit("message", { room, message, sender, receiver });
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const fs = require("fs");
const { Server } = require("socket.io");

const app = express();
const option = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://10.10.7.101:3000",
      "https://8aee5bdba9a3.ngrok-free.app",
    ],
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://10.10.7.101:5000",
      "https://8aee5bdba9a3.ngrok-free.app",
    ],
  })
);
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const usersRoutes = require("./routes/users");
const Message = require("./models/Message");

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", usersRoutes);

// Socket.IO for real-time chat
io.on("connection", (socket) => {
  // console.log("User connected:", socket.id);

  socket.on("joinRoom", ({ room }) => {
    // socket.join(room);
    // console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on("chatMessage", async ({ room, message, sender, receiver }) => {
    // console.log(
    //   `Message from ${sender.username}: ${message} to room ${room} and ${receiver}`
    // );

    socket.on("nonfiction", (data) => {
      socket.emit("nonfiction", data);
      // console.log(data);
    });
    // Send to all users in room, including sender
    io.to(room).emit("message", { room, message, sender, receiver });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
