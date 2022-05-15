"use strict";

const router = require("express").Router(),
  homeController = require("../controllers/homeController"),
  roomsController = require("../controllers/roomsController");

router.get("/", homeController.init, roomsController.list, roomsController.index);
router.get("/new", roomsController.new);
router.post("/create", roomsController.create, roomsController.redirectView);
router.get("/:id/edit", roomsController.edit);
router.put("/:id/update", roomsController.update, roomsController.redirectView);
router.delete("/:id/delete", roomsController.delete, roomsController.redirectView);

module.exports = router;