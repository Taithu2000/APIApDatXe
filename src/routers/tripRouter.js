const express = require("express");
const router = express.Router();
const Trip = require("../models/trip");
const Seat = require("../models/seat");
const mongoose = require("mongoose");
const moment = require("moment");
require("moment-timezone");

//------------------- //-------------------lấy danh sách trip qua route_id và ngày//-------------------//-------------------

router.get("/trip/:route_id/:date", async (req, res) => {
  try {
    const trips = await Trip.find({
      route_id: req.params.route_id,
      trip_date: req.params.date,
    });

    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//-------------------//-------------------tạo danh sách trip//-------------------//-------------------

router.post("/trip", async (req, res) => {
  const today = moment.tz("Asia/Ho_Chi_Minh").startOf("day").toDate();

  const {
    route_id,
    start_point,
    end_point,
    pickup,
    drop_off,
    pickupTime,
    totalTime,
    ticket_price,
  } = req.body;

  const groupId = new mongoose.Types.ObjectId();

  try {
    // Tìm danh sách ghế theo ngày và route_id
    const seats = await Seat.find({
      seat_date: { $gte: today },
      route_id: route_id,
    });

    // Tạo danh sách chuyến đi từ danh sách ghế
    const trips = seats.map((seat) => {
      return new Trip({
        trip_date: seat.seat_date,
        route_id: seat.route_id,
        bus_id: seat.bus_id,
        seat_id: seat._id,
        start_point: start_point,
        end_point: end_point,
        pickup: pickup,
        drop_off: drop_off,
        pickupTime: pickupTime,
        totalTime: totalTime,
        ticket_price: ticket_price,
        groupId: groupId,
      });
    });

    // Lưu danh sách chuyến đi vào cơ sở dữ liệu
    const newTrips = await Trip.insertMany(trips);

    res.status(201).json(newTrips);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//-------------------//-------------------Sửa 1 trip//-------------------//-------------------

router.put("/trip/update/:_id", async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params._id });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    trip.start_point = req.body.start_point;
    trip.end_point = req.body.end_point;
    trip.pickup = req.body.pickup;
    trip.drop_off = req.body.drop_off;
    trip.pickupTime = req.body.pickupTime;
    trip.totalTime = req.body.totalTime;
    trip.ticket_price = req.body.ticket_price;

    const updatedTrip = await trip.save();
    res.json(updatedTrip);
  } catch (err) {
    console.log("aaaaaaaaaa");
    res.status(400).json({ message: err.message });
  }
});

//-------------------//-------------------Sửa tất cả trip từ hôm nay//-------------------//-------------------
router.put("/trip/update/all/:groupId/:date", async (req, res) => {
  try {
    // Cập nhật thông tin cho tất cả các chuyến đi bắt đầu từ ngày hôm nay
    const result = await Trip.updateMany(
      { groupId: req.params.groupId, trip_date: { $gte: req.params.date } },
      {
        $set: {
          start_point: req.body.start_point,
          end_point: req.body.end_point,
          pickup: req.body.pickup,
          drop_off: req.body.drop_off,
          pickupTime: req.body.pickupTime,
          totalTime: req.body.totalTime,
          ticket_price: req.body.ticket_price,
        },
      }
    );

    res.json({ message: "Trips updated successfully", result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//-------------------//-------------------Xóa tất cả trip lớn hơn hoặc bằng ngày truyền vào theo groupId//-------------------//-------------------
router.delete("/trip/delete/all/:groupId/:date", async (req, res) => {
  try {
    const trip = await Trip.deleteMany({
      groupId: req.params.groupId,
      trip_date: { $gte: req.params.date },
    });
    if (!trip) {
      return res.status(404).json({ message: "không tìm thấy trip để xóa" });
    }
    res.json({ message: "trip deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//-------------------//-------------------xóa  trip theo id//-------------------//-------------------
router.delete("/trip/delete/:_id", async (req, res) => {
  try {
    const trip = await Trip.deleteOne({ _id: req.params._id });
    if (!trip) {
      return res.status(404).json({ message: "không tìm thấy trip để xóa" });
    }
    res.json({ message: "trip deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
