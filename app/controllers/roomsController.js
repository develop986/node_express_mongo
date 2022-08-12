"use strict";


const Room = require("../models/room"),
  httpStatus = require("http-status-codes"),
  getRoomParams = body => {
    return {
      name: body.name
    };
  };

module.exports = {
  list: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.render("users/login");
      return;
    }
    Room.find()
      .then(rooms => {
        res.locals.rooms = rooms;
        next();
      })
      .catch(error => {
        console.log(`Error fetching rooms: ${error.message}`);
        next(error);
      });
  },

  index: (req, res, next) => {
    res.render("rooms/index");
  },

  new: (req, res) => {
    if (!res.locals.currentUser) {
      res.render("users/login");
      return;
    }
    res.render("rooms/new");
  },

  create: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.locals.redirect = "/users/login";
      next();
      return;
    }
    let roomParams = getRoomParams(req.body);
    Room.create(roomParams)
      .then(room => {
        console.log("room create " + room);
        res.locals.redirect = "/rooms";
        next();
      })
      .catch(error => {
        console.log(`Error saving room: ${error.message}`);
        next(error);
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },

  edit: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.render("users/login");
      return;
    }
    let roomId = req.params.id;
    Room.findById(roomId)
      .then(room => {
        res.render("rooms/edit", {
          room: room
        });
      })
      .catch(error => {
        console.log(`Error fetching room by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.locals.redirect = "/users/login";
      next();
      return;
    }
    let roomId = req.params.id,
      roomParams = getRoomParams(req.body);

    Room.findByIdAndUpdate(roomId, {
      $set: roomParams
    })
      .then(room => {
        console.log("room update " + room);
        res.locals.redirect = `/rooms`;
        next();
      })
      .catch(error => {
        console.log(`Error updating room by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.locals.redirect = "/users/login";
      next();
      return;
    }
    let roomId = req.params.id;
    Room.findByIdAndRemove(roomId)
      .then((room) => {
        console.log("room delete " + room);
        res.locals.redirect = "/rooms";
        next();
      })
      .catch(error => {
        console.log(`Error deleting room by ID: ${error.message}`);
        next();
      });
  }
};