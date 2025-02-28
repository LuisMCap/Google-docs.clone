const Documents = require("../models/document");
const { createServer } = require("node:http");
const PORT = process.env.SOCKET_PORT || 4000;

const { Server } = require("socket.io");
let clients = {}

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:4173"],
  },
});

const sendNotification = (userId, message) => {
  const socketId = clients[userId];
  if (socketId) {
    io.to(socketId).emit("notification", message);
  }
};

const SocketConnection = io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("register", (userId) => {
    clients[userId] = socket.id;
    console.log(clients);
  });

  socket.on("join", (documentID) => {
    socket.join(documentID);
  });

  socket.on("collaborate", async ({ content, documentID }) => {
    socket.broadcast.emit("collaborate", content);

    const result = await Documents.updateOne(
      { _id: documentID },
      { $set: { content: content } }
    );
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    for (const userId in clients) {
      console.log(userId)
      if (clients[userId] === socket.id) {
        console.log('deleted')
        delete clients[userId];
        break;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Socket server is running on ${PORT}`);
});

module.exports = { SocketConnection, sendNotification };
