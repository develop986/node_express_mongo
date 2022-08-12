"use strict";

const router = require("express").Router(),
  userRoutes = require("./userRoutes"),
  workRoutes = require("./workRoutes"),
  roomRoutes = require("./roomRoutes"),
  errorRoutes = require("./errorRoutes"),
  homeRoutes = require("./homeRoutes"),
  workHistoryRoutes = require("./workHistoryRoutes"),
  roomHistoryRoutes = require("./roomHistoryRoutes");

router.use("/users", userRoutes);
router.use("/works", workRoutes);
router.use("/rooms", roomRoutes);
router.use("/work_history", workHistoryRoutes);
router.use("/room_history", roomHistoryRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;