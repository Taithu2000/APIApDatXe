const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  name: String,
  password: String,
  roles: String,
  email: String,
  birthDate: Date,
  sex: String,
  image: String,
  createAt: {
    type: Date,
    default: () => new Date(),
  },
});

module.exports = mongoose.model("User", dataSchema);
