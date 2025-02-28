const mongoose = require("mongoose");
const documentSchema = require("./document").schema;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  hash: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  // email: {
  //   type: String,
  // },
  invites: [documentSchema],
  documents: [documentSchema],
});

module.exports = mongoose.model("User", UserSchema);
