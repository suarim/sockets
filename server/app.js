const express = require('express');
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require('cors');

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST"],
    credentials: true,
  }
});

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ["GET", "POST"],
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send("hello world");
});

io.on("connection", (socket) => {
  console.log("connected");
  console.log(socket.id);
    socket.broadcast.emit("welcome",`${socket.id} has entered`)
  
  // Handle the 'disconnect' event
  socket.on('disconnect', () => {
    console.log("user disconnected", socket.id);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on("msg",(msg)=>{
        console.log(`${msg.msg} recieved and ${msg.room}`)
        io.to(msg.room).emit("new-msg",msg.msg)
  })

});

server.listen(3000, () => {
  console.log("listening on 3000....");
});
