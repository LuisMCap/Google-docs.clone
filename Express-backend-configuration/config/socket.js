const Documents = require("../models/document");

let clients = {};

const SocketConnection = (io) => {
  io.on("connection", (socket) => {
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
        console.log(userId);
        if (clients[userId] === socket.id) {
          console.log("deleted");
          delete clients[userId];
          break;
        }
      }
    });
  });
};

module.exports = { SocketConnection };
