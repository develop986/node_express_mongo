"use strict";

const router = require("express").Router(),
  homeController = require("../controllers/homeController"),
  workHistoryController = require("../controllers/workHistoryController"),
  usersController = require("../controllers/usersController"),
  worksController = require("../controllers/worksController");

router.get("/", homeController.init, usersController.list, worksController.list, workHistoryController.list, workHistoryController.index);
router.get("/register", homeController.init, worksController.list, workHistoryController.register);
router.get("/new", usersController.list, worksController.list, workHistoryController.new);
router.post("/create", workHistoryController.create, workHistoryController.redirectView);
router.post("/enter", workHistoryController.enter, workHistoryController.redirectView);
router.get("/:id/edit", homeController.init, usersController.list, worksController.list, workHistoryController.edit);
router.put("/:id/leave", workHistoryController.leave, workHistoryController.redirectView);
router.put("/:id/update", workHistoryController.update, workHistoryController.redirectView);
router.delete("/:id/undo", workHistoryController.undo, workHistoryController.redirectView);
router.delete("/:id/delete", workHistoryController.delete, workHistoryController.redirectView);

module.exports = router;