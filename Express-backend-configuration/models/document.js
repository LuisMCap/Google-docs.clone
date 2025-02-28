const mongoose = require("mongoose");
const collaboratorSchema = require('./collaborate').schema

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  collaborators: [collaboratorSchema],
});

module.exports = mongoose.model("Document", documentSchema);
