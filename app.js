require("dotenv").config();
require("express-async-errors");

const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");
const supabase = require("./db/connect.js");
const bodyParser = require("body-parser");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.static(path.resolve(__dirname, "./client/build/")));
app.use(express.json());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// routers
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const notFoundMiddleware = require("./middleware/not-found");
const { log } = require("console");

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(notFoundMiddleware);

// socket.io

io.on("connection", (socket) => {
  log(`User connected: ${socket.id}`);

  socket.on("message", async ({ message, roomId, userId, receiverId }) => {
    if (!message || !roomId || !userId || !receiverId) {
      return;
    }
    const { data, error } = await supabase
      .from("chat")
      .insert({
        fromuser: userId,
        touser: receiverId,
        message: message,
        roomId: roomId,
      })
      .select();
    if (error) {
      console.log(error);
      return;
    }
    io.to(roomId).emit("receive-message", {
      message,
      userId,
      receiverId,
      roomId,
    });
  });

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    log(`User joined room: ${roomId}`);
  });

  socket.on("disconnect", () => {
    log(`User disconnected: ${socket.id}`);
  });
});

//socket.io end

const start = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`Application started on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
