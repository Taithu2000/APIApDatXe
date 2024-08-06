const express = require("express");
const router = express.Router();

const Bus = require("../models/bus");

//lấy tất cả xe
router.get("/bus", async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Thêm xe
router.post("/bus", async (req, res) => {
  try {
    // Kiểm tra xem biển số xe đã tồn tại trong cơ sở dữ liệu hay chưa
    const existingBus = await Bus.findOne({
      license_plate: req.body.license_plate,
    });

    if (existingBus) {
      return res.status(400).json({
        message: "Biển số xe đã tồn tại",
      });
    }

    // Nếu không tồn tại, tiến hành thêm xe mới
    const bus = new Bus({
      license_plate: req.body.license_plate,
      type: req.body.type,
      registration_date: req.body.registration_date,
      brand: req.body.brand,
      color: req.body.color,
      num_Seats: req.body.num_Seats,
      image: req.body.image,
    });

    const newBus = await bus.save();
    res.status(201).json(newBus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//lấy 1 Bus
router.get("/bus/:_id", async (req, res) => {
  try {
    const bus = await Bus.findOne({ _id: req.params._id });

    res.json(bus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//sửa thông tin xe

router.put("/bus/update/:_id", async (req, res) => {
  try {
    const bus = await Bus.findOne({ _id: req.params._id });
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    bus.license_plate = req.body.license_plate;
    bus.type = req.body.type;
    bus.registration_date = req.body.registration_date;
    bus.brand = req.body.brand;
    bus.color = req.body.color;
    bus.num_Seats = req.body.num_Seats;
    bus.image = req.body.image;

    const updatedBus = await bus.save();
    res.json(updatedBus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/bus/delete/:_id", async (req, res) => {
  try {
    const bus = await Bus.deleteOne({
      _id: req.params._id,
    });
    if (!bus) {
      return res.status(404).json({ message: "bus not found" });
    }
    res.json({ message: "bus deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
