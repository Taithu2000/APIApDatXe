const mongoose = require("mongoose");
const dataSchema = new mongoose.Schema({
  license_plate: String,
  type: String,
  registration_date: Date,
  brand: String,
  color: String,
  num_Seats: Number,
  image: String,
});

module.exports = mongoose.model("buses", dataSchema);
