const express = require("express");
const router = express.Router();
const moment = require("moment");
require("moment-timezone");

const Route = require("../models/route");
const Seat = require("../models/seat");

// Lấy tất cả danh sách route
router.get("/route", async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//thêm route

router.post("/route", async (req, res) => {
  try {
    const {
      start_date,
      end_date,
      bus_id,
      start_point,
      end_point,
      departure_time,
      total_time,
      date_interval,
      total_seats,
    } = req.body;

    // Tạo route mới
    const route = new Route({
      start_date,
      end_date,
      bus_id,
      start_point,
      end_point,
      departure_time,
      total_time,
      date_interval,
    });

    const newRoute = await route.save();

    const seats = [];

    let currentDate = moment(start_date).startOf("day");
    const endDate = moment(end_date).startOf("day");

    // Tạo dữ liệu cho tất cả các ghế  từ start_date đến end_date
    while (currentDate.isSameOrBefore(endDate)) {
      seats.push({
        seat_date: currentDate.toDate(),
        route_id: newRoute._id,
        bus_id: bus_id,
        total_seats: total_seats,
        available_seats: total_seats,
      });

      currentDate = currentDate.add(date_interval, "days");
    }

    // Sử dụng insertMany để chèn nhiều bản ghi cùng một lúc
    const seatResult = await Seat.insertMany(seats);

    res.status(201).json({ route: newRoute, seats: seatResult });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//xóa route

router.delete("/route/delete/:_id", async (req, res) => {
  try {
    const route = await Route.deleteOne({
      _id: req.params._id,
    });
    if (!route) {
      return res.status(404).json({ message: "không tìm thấy route" });
    }
    res.json({ message: "route deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Cập nhật danh sách route

router.put("/route/update/:_id", async (req, res) => {
  try {
    const route = await Route.findOne({ _id: req.params._id });
    if (!route) {
      return res.status(404).json({ message: "route not found" });
    }

    route.bus_id = req.body.bus_id;
    route.end_date = req.body.end_date;
    route.start_point = req.body.start_point;
    route.end_point = req.body.end_point;
    route.departure_time = req.body.departure_time;
    route.total_time = req.body.total_time;

    const updatedRoute = await route.save();
    res.json(updatedRoute);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// lấy 1 route
router.get("/routes/:_id", async (req, res) => {
  try {
    const route = await Route.findOne({ _id: req.params._id });
    res.json(route);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
