const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  phoneNumber: String,
  name: String,
  password: String,
  roles: String,
  email: String,
  birthDate: Date,
  sex: String,
  image: String,
});

module.exports = mongoose.model("User", dataSchema);
