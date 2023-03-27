
const mongoose = require("mongoose");

const users = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

var User = mongoose.model("User", users);

module.exports = User;
