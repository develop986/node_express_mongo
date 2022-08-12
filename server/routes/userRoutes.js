"use strict";

const { body, validationResult } = require('express-validator');

const router = require("express").Router(),
  homeController = require("../controllers/homeController"),
  usersController = require("../controllers/usersController");

router.get("/", homeController.init, usersController.list, usersController.index);
router.get("/new", usersController.new);
router.post(
  "/create",
  body('account').notEmpty(),
  body('password').notEmpty(),
  usersController.validate,
  usersController.create,
  usersController.redirectView
);
router.get("/login", usersController.login);
router.post("/login", usersController.authenticate);
router.get("/logout", usersController.logout, usersController.redirectView);
router.get("/password", usersController.password);
router.put("/change", usersController.change, usersController.redirectView);
router.get("/:id/edit", usersController.edit);
router.put("/:id/update", usersController.update, usersController.redirectView);
router.delete("/:id/delete", usersController.delete, usersController.redirectView);

module.exports = router;