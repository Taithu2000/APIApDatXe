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
        bus_id: req.body.bus_id,
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

// Lấy thông tin một ghế cụ thể
router.get("/seat/:id", getSeat, (req, res) => {
    res.json(res.seat);
});

// Cập nhật thông tin một ghế
router.put("/seat/update/:id", getSeat, async (req, res) => {
    if (req.body.total_seats != null) {
        res.seat.total_seats = req.body.total_seats;
    }
    if (req.body.available_seats != null) {
        res.seat.available_seats = req.body.available_seats;
    }

    try {
        const updatedSeat = await res.seat.save();
        res.json(updatedSeat);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Xóa một ghế
router.delete("/seat/delete/:id", getSeat, async (req, res) => {
    try {
        await res.seat.remove();
        res.json({ message: "Deleted Seat" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getSeat(req, res, next) {
    try {
        seat = await Seat.findById(req.params.id);
        if (seat == null) {
            return res.status(404).json({ message: "Cannot find seat" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.seat = seat;
    next();
}

module.exports = router;
