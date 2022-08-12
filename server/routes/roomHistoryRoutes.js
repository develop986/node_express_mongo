"use strict";

const router = require("express").Router(),
  homeController = require("../controllers/homeController"),
  roomHistoryController = require("../controllers/roomHistoryController"),
  usersController = require("../controllers/usersController"),
  roomsController = require("../controllers/roomsController");

router.get("/", homeController.init, usersController.list, roomsController.list, roomHistoryController.list, roomHistoryController.index);
router.get("/register", homeController.init, usersController.list, roomsController.list, roomHistoryController.register);
router.get("/new", usersController.list, roomsController.list, roomHistoryController.new);
router.post("/create", roomHistoryController.create, roomHistoryController.redirectView);
router.post("/enter", roomHistoryController.enter, roomHistoryController.redirectView);
router.get("/:id/edit", homeController.init, usersController.list, roomsController.list, roomHistoryController.edit);
router.put("/:id/update", roomHistoryController.update, roomHistoryController.redirectView);
router.put("/:id/leave", roomHistoryController.leave, roomHistoryController.redirectView);
router.delete("/:id/undo", roomHistoryController.undo, roomHistoryController.redirectView);
router.delete("/:id/delete", roomHistoryController.delete, roomHistoryController.redirectView);

module.exports = router;