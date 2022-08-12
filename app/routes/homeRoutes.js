"use strict";

const router = require("express").Router(),
  homeController = require("../controllers/homeController"),
  roomHistoryController = require("../controllers/roomHistoryController"),
  roomsController = require("../controllers/roomsController");

router.get("/", homeController.init, roomsController.list, roomHistoryController.mylist, homeController.index);

module.exports = router;