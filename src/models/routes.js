const mongoose = require("mongoose");
const dataSchema = new mongoose.Schema({
  route_date: Date,
  bus_id: String,
  start_point: String,
  end_point: String,
  departure_time: String,
  total_time: String,
  empty_seat: Number,   // nó sẽ bằng số ghế của bus
});

module.exports = mongoose.model("Route", dataSchema);
