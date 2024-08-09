const mongoose = require("mongoose");
const dataSchema = new mongoose.Schema({
  start_date: Date,
  end_date: Date,
  bus_id: String,
  start_point: String,
  end_point: String,
  departure_time: String,
  total_time: String,
  date_interval: Number,
});

module.exports = mongoose.model("Route", dataSchema);
