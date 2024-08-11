const express = require("express");
const router = express.Router();
const Seat = require("../models/seats");

//Lấy tất cả các ghế
router.get("/seat", async (req, res) => {
  try {
    const seats = await Seat.find();
    res.json(seats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo một ghế mới
router.post("/seat", async (req, res) => {
  const seat = new Seat({
    seat_date: req.body.seat_date,
    route_id: req.body.route_id,
    total_seats: req.body.total_seats,
    available_seats: req.body.available_seats,
  });

  try {
    const newSeat = await seat.save();
    res.status(201).json(newSeat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Lấy 1 dữ liệu theo route_id
router.get("/seat/:route_id", async (req, res) => {
  try {
    const { route_id } = req.params;
    const seats = await Seat.findOne({ route_id });
    res.json(seats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy tất cả dữ liệu theo route_id
router.get("/seat/:route_id", async (req, res) => {
  try {
    const { route_id } = req.params;
    const seats = await Seat.find({ route_id });
    res.json(seats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//xóa seat
router.delete("seat/delete:_id", async (req, res) => {
  try {
    const deletedSeat = await Seat.findByIdAndDelete(req.params._id);

    if (!deletedSeat) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đối tượng để xóa" });
    }

    res.json({ message: "Đã xóa đối tượng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Đã xảy ra lỗi khi xóa đối tượng" });
  }
});

// Xóa các seat có seat_date lớn hơn ngày truyền vào
router.delete("/seat/delete/:route_id/:date", async (req, res) => {
  const { route_id, date } = req.params;
  try {
    const result = await Seat.deleteMany({
      route_id: route_id,
      seat_date: { $gt: new Date(date) },
    });

    res.json({ message: `Đã xóa ${result.deletedCount} đối tượng thành công` });
  } catch (error) {
    res.status(500).json({ message: "Đã xảy ra lỗi khi xóa đối tượng" });
  }
});

module.exports = router;
