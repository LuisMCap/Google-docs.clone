const mongoose = require("mongoose");

const collaboratorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["active", "pending"],
  },
});

module.exports = mongoose.model("Collaborator", collaboratorSchema);
