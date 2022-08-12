"use strict";


const RoomHistory = require("../models/room_history"),
  getRoomHistoryParams = body => {
    if (body.room_unlock == null) {
      body.room_unlock = false;
    }
    if (body.room_lock == null) {
      body.room_lock = false;
    }
    let temp_end = body.room_end_date + " " + body.room_end_time;
    if ((body.room_end_date == null || body.room_end_date == "")
      || (body.room_end_time == null || body.room_end_time == "")) {
      temp_end = null;
    }
    return {
      user: body.user,
      room: body.room,
      room_start: body.room_start_date + " " + body.room_start_time,
      room_end: temp_end,
      room_unlock: body.room_unlock,
      room_lock: body.room_lock
    };
  };

module.exports = {
  list: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.render("users/login");
      return;
    }
    RoomHistory.find()
      .then(room_history => {
        res.locals.room_history = room_history;
        next();
      })
      .catch(error => {
        console.log(`Error fetching room_history: ${error.message}`);
        next(error);
      });
  },

  mylist: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.render("users/login");
      return;
    }
    RoomHistory.find({ user: res.locals.currentUser })
      .then(room_history => {
        res.locals.room_history = room_history;
        next();
      })
      .catch(error => {
        console.log(`Error fetching room_history: ${error.message}`);
        next(error);
      });
  },

  index: (req, res, next) => {
    if (!res.locals.currentUser.admin) {
      res.render("");
      return;
    }
    res.render("room_history/index");
  },

  register: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.render("users/login");
      return;
    }
    RoomHistory.find({room_start: {$gte: res.locals.now_time_date.valueOf()}})
      .then(room_history => {
        res.locals.room_history = room_history;
        res.render("room_history/register");
      })
      .catch(error => {
        console.log(`Error fetching room_history: ${error.message}`);
        next(error);
      });
  },

  new: (req, res) => {
    if (!res.locals.currentUser) {
      res.render("users/login");
      return;
    }
    if (!res.locals.currentUser.admin) {
      res.render("");
      return;
    }
    res.render("room_history/new");
  },

  create: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.locals.redirect = "/users/login";
      next();
      return;
    }
    if (!res.locals.currentUser.admin) {
      res.locals.redirect = "/";
      next();
      return;
    }
    let roomHistoryParams = getRoomHistoryParams(req.body);
    RoomHistory.create(roomHistoryParams)
      .then(room_history => {
        console.log("room_history create " + room_history);
        res.locals.redirect = "/room_history";
        next();
      })
      .catch(error => {
        console.log(`Error saving room_history: ${error.message}`);
        next(error);
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },

  enter: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.locals.redirect = "/users/login";
      next();
      return;
    }
    RoomHistory.findOne({ user: res.locals.currentUser, room_end: null })
      .then(room_historying => {
        if (room_historying) {
          req.flash("error", `今は入室中です。もう一回操作してください。`);
          res.locals.redirect = "/room_history/register";
          return;
        }
        RoomHistory.findOne({ room: req.body.room, room_end: null })
          .then(room_history => {
            let temp_unlock = true;
            if (room_history) {
              temp_unlock = false;
            }
            let roomHistoryParams = {
              user: res.locals.currentUser,
              room: req.body.room,
              room_start: (new Date()).valueOf(),
              room_end: null,
              room_unlock: temp_unlock,
              room_lock: false
            };
            RoomHistory.create(roomHistoryParams)
              .then(room_history => {
                console.log("room_history enter " + room_history);
                res.locals.redirect = "/room_history/register";
                next();
              })
              .catch(error => {
                console.log(`Error saving room_history: ${error.message}`);
                next(error);
              });
          })
          .catch(error => {
            console.log(`Error fetching room_history: ${error.message}`);
            next(error);
          });
      })
      .catch(error => {
        console.log(`Error fetching room_history: ${error.message}`);
        next(error);
      });
  },

  edit: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.render("users/login");
      return;
    }
    if (!res.locals.currentUser.admin) {
      res.render("");
      return;
    }
    let room_historyId = req.params.id;
    RoomHistory.findById(room_historyId)
      .then(room_history => {
        res.render("room_history/edit", {
          room_history: room_history
        });
      })
      .catch(error => {
        console.log(`Error fetching room_history: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.locals.redirect = "/users/login";
      next();
      return;
    }
    if (!res.locals.currentUser.admin) {
      res.locals.redirect = "/";
      next();
      return;
    }
    let room_historyId = req.params.id,
      roomHistoryParams = getRoomHistoryParams(req.body);
    RoomHistory.findByIdAndUpdate(room_historyId, {
      $set: roomHistoryParams
    })
      .then(room_history => {
        console.log("room_history update " + room_history);
        res.locals.redirect = "/room_history";
        next();
      })
      .catch(error => {
        console.log(`Error updating room_history: ${error.message}`);
        next(error);
      });
  },

  leave: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.locals.redirect = "/users/login";
      next();
      return;
    }
    RoomHistory.findOne({ user: res.locals.currentUser, room_end: null })
      .then(room_historying => {
        if (!room_historying) {
          req.flash("error", `入室していない状態です。もう一回操作してください。`);
          res.locals.redirect = "/room_history/register";
          return;
        }
        RoomHistory.findOne({ user: {$ne: res.locals.currentUser}, room: room_historying["room"], room_end: null })
          .then(room_history => {
            let temp_lock = true;
            if (room_history) {
              temp_lock = false;
            }
            let room_historyId = req.params.id,
              roomHistoryParams = {
                user: res.locals.currentUser,
                room: req.body.room,
                room_start: room_historying.room_start,
                room_end: (new Date()).valueOf(),
                room_unlock: room_historying.room_unlock,
                room_lock: temp_lock
              };
            RoomHistory.findByIdAndUpdate(room_historyId, {
              $set: roomHistoryParams
            })
              .then(room_history => {
                console.log("room_history leave " + room_history);
                res.locals.redirect = "/room_history/register";
                next();
              })
              .catch(error => {
                console.log(`Error updating room_history: ${error.message}`);
                next(error);
              });
          })
          .catch(error => {
            console.log(`Error fetching room_history: ${error.message}`);
            next(error);
          });
      })
      .catch(error => {
        console.log(`Error fetching room_history: ${error.message}`);
        next(error);
      });
  },

  undo: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.locals.redirect = "/users/login";
      next();
      return;
    }
    let room_historyId = req.params.id;
    RoomHistory.findByIdAndRemove(room_historyId)
      .then((room_history) => {
        console.log("room_history undo " + room_history);
        res.locals.redirect = "/room_history/register";
        next();
      })
      .catch(error => {
        console.log(`Error deleting room_history: ${error.message}`);
        next();
      });
  },

  delete: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.locals.redirect = "/users/login";
      next();
      return;
    }
    if (!res.locals.currentUser.admin) {
      res.locals.redirect = "/";
      next();
      return;
    }
    let room_historyId = req.params.id;
    RoomHistory.findByIdAndRemove(room_historyId)
      .then((room_history) => {
        console.log("room_history delete " + room_history);
        res.locals.redirect = "/room_history";
        next();
      })
      .catch(error => {
        console.log(`Error deleting room_history by ID: ${error.message}`);
        next();
      });
  }
};