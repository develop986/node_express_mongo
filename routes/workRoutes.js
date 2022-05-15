"use strict";

const router = require("express").Router(),
  homeController = require("../controllers/homeController"),
  worksController = require("../controllers/worksController");

router.get("/", homeController.init, worksController.list, worksController.index);
router.get("/new", worksController.new);
router.post("/create", worksController.create, worksController.redirectView);
router.get("/:id/edit", worksController.edit);
router.put("/:id/update", worksController.update, worksController.redirectView);
router.delete("/:id/delete", worksController.delete, worksController.redirectView);

module.exports = router;