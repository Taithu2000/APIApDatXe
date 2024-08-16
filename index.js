const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const userRouter = require("./src/routers/userRouter");
const busRouter = require("./src/routers/busRouter");
const routeRouter = require("./src/routers/routeRouter");
const seatRouter = require("./src/routers/seatRouter");
const tripRouter = require("./src/routers/tripRouter");
const moment = require("moment");
const today = moment("2024-08-30T17:00:00.000Z").startOf("day").toDate();

console.log(today);

const app = express();

const dbUrl = process.env.DATABASE_URL;

//xử lý dữ liệu  theo kiểu json
app.use(express.json());
// Kết nối MongoDB
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Kết nối MongoDB   thành công");
    // Sử dụng router
    app.use("/", userRouter);
    app.use("/", busRouter);
    app.use("/", routeRouter);
    app.use("/", seatRouter);
    app.use("/", tripRouter);

    // Chạy máy chủ 3000
    app.listen(3306, () => {
      console.log("chạy máy chủ thành công");
    });
  })
  .catch((error) => {
    console.error("Lỗi kết  nối  :", error);
  });
