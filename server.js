const express = require("express");
const cors = require("cors");
const socketIo = require("socket.io");

const app = express();
const server = require("http").createServer(app);
// allow cors for all origins
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello world");
});

io.on("connection", (socket) => {
  let id = null;
  socket.on("join-room", (data) => {
    console.log(`Client ${socket.id} joined room ${id}`);
    id = data;
    socket.join(id);
  });

  // Handle cursor change events within the specific room
  socket.on("cursor-change", (data) => {
    console.log(data);
    io.to(id).emit("cursor-change", data);
  });

  // Handle text change events within the specific room
  socket.on("text-change", (data) => {
    console.log(data);
    io.to(id).emit("text-change", data);
  });

  // Handle disconnection and leave the room
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
