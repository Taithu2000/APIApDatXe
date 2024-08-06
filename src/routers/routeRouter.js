const express = require("express");
const router = express.Router();
const moment = require("moment");

const Route = require("../models/routes");

// Lấy tất cả danh sách route
router.get("/routes", async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//thêm danh sách route từ ngày A đến ngày B
router.post("/routes", async (req, res) => {
  try {
    const { startDate, endDate, dayInterval } = req.body;
    const routes = [];

    let currentDate = moment(startDate);
    while (currentDate <= moment(endDate)) {
      const route = new Route({
        route_date: currentDate.format("YYYY-MM-DD"),
        bus_id: req.body.bus_id,
        start_point: req.body.start_point,
        end_point: req.body.end_point,
        departure_time: req.body.departure_time,
        total_time: req.body.total_time,
        empty_seat: req.body.empty_seat,
      });

      const newRoute = await route.save();
      routes.push(newRoute);

      currentDate = currentDate.add(dayInterval, "days");
    }

    res.status(201).json(routes);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//xóa danh sách route từ ngày A đến ngày B

router.delete("/routes/delete", async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      bus_id,
      start_point,
      end_point,
      departure_time,
    } = req.body;

    // Xác định điều kiện để xóa routes từ startDate đến endDate với các điều kiện khác
    const deleteCondition = {
      route_date: {
        $gte: moment(startDate).format("YYYY-MM-DD"),
        $lte: moment(endDate).format("YYYY-MM-DD"),
      },
      bus_id: bus_id,
      start_point: start_point,
      end_point: end_point,
      departure_time: departure_time,
    };

    // Xóa các routes dựa trên điều kiện
    const result = await Route.deleteMany(deleteCondition);

    res.status(200).json({
      message: `Deleted ${result.deletedCount} routes from ${startDate} to ${endDate} with additional conditions`,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Cập nhật danh sách route từ ngày A đến ngày B

router.put("/routes/update", async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      bus_id,
      start_point,
      end_point,
      departure_time,
      updateData,
    } = req.body;

    // Xác định điều kiện để cập nhật routes từ startDate đến endDate với các điều kiện khác
    const updateCondition = {
      route_date: {
        $gte: moment(startDate).format("YYYY-MM-DD"),
        $lte: moment(endDate).format("YYYY-MM-DD"),
      },
      bus_id: bus_id,
      start_point: start_point,
      end_point: end_point,
      departure_time: departure_time,
    };

    // Cập nhật các trường bus_id, start_point, end_point, departure_time và các trường mới
    const updateResult = await Route.updateMany(updateCondition, {
      $set: {
        bus_id: updateData.bus_id,
        start_point: updateData.start_point,
        end_point: updateData.end_point,
        departure_time: updateData.departure_time,
        total_time: updateData.total_time,
      },
    });

    res.status(200).json({
      message: `Updated ${updateResult.modifiedCount} routes from ${startDate} to ${endDate} with additional conditions`,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// // Create a new route
// router.post("/routes", async (req, res) => {
//   const route = new Route({
//     route_date: req.body.route_date,
//     bus_id: req.body.bus_id,
//     start_point: req.body.start_point,
//     end_point: req.body.end_point,
//     departure_time: req.body.departure_time,
//     total_time: req.body.total_time,
//     empty_seat: req.body.empty_seat,
//   });

//   try {
//     const newRoute = await route.save();
//     res.status(201).json(newRoute);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// Get a specific route
router.get("/routes/:_id", async (req, res) => {
  try {
    const route = await Route.findOne({ _id: req.params._id });
    res.json(route);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a route
router.put("/routes/:_id", async (req, res) => {
  try {
    const route = await Route.findOne({ _id: req.params._id });
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    route.route_date = req.body.route_date;
    route.bus_id = req.body.bus_id;
    route.start_point = req.body.start_point;
    route.end_point = req.body.end_point;
    route.departure_time = req.body.departure_time;
    route.total_time = req.body.total_time;
    route.empty_seat = req.body.empty_seat;

    const updatedRoute = await route.save();
    res.json(updatedRoute);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a route
router.delete("/routes/:_id", async (req, res) => {
  try {
    const route = await Route.deleteOne({ _id: req.params._id });
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.json({ message: "Route deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
