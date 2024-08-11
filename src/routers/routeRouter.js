const express = require("express");
const router = express.Router();
const moment = require("moment");

const Route = require("../models/routes");
const Seat = require("../models/seats");

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

    // Tạo seat cho từng ngày trong khoảng thời gian từ start_date đến end_date
    const seats = [];
    let currentDate = moment(start_date);
    while (currentDate.isSameOrBefore(moment(end_date))) {
      const seat = new Seat({
        seat_date: currentDate.format("YYYY-MM-DD"),
        route_id: newRoute._id,
        bus_id: bus_id,
        total_seats: total_seats,
        available_seats: total_seats,
      });

      const newSeat = await seat.save();
      seats.push(newSeat);

      currentDate = currentDate.add(date_interval, "days");
    }

    res.status(201).json({ route: newRoute, seats: seats });
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
