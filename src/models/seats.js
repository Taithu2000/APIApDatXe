const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  seat_date: String,
  route_id: String,
  bus_id: String,
  total_seats: Number,
  available_seats: Number,
});

module.exports = mongoose.model("Seat", dataSchema);
