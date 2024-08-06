const express = require("express");
const router = express.Router();


const User = require("../models/user");

// lấy tất cả user
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
    console.log(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// tạo mới user
router.post("/users", async (req, res) => {
  const user = new User({
    phoneNumber: req.body.phoneNumber,
    name: req.body.name,
    password: req.body.password,
    roles: req.body.roles,
    email: req.body.email,
    birthDate: req.body.birthDate,
    sex: req.body.sex,
    image: req.body.image,
    createAt: req.body.createAt,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// lấy 1 user
router.get("/users/:phoneNumber", async (req, res) => {
  try {
    const user = await User.findOne({ phoneNumber: req.params.phoneNumber });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// cập nhật thông tin
router.put("/users/update/:phoneNumber", async (req, res) => {
  try {
    const user = await User.findOne({ phoneNumber: req.params.phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name;
    user.password = req.body.password;
    user.email = req.body.email;
    user.birthDate = req.body.birthDate;
    user.sex = req.body.sex;
    user.image = req.body.image;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// xóa user
router.delete("/users/delete/:phoneNumber", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      phoneNumber: req.params.phoneNumber,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
