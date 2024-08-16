const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  trip_date: Date,
  route_id: String,
  seat_id: String,
  bus_id: String,
  start_point: String,
  end_point: String,
  pickup: String,
  drop_off: String,
  pickupTime: String,
  totalTime: String,
  ticket_price: Number,
  groupId: String,
});

module.exports = mongoose.model("Trip", dataSchema);
