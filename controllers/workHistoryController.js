"use strict";


const WorkHistory = require("../models/work_history"),
  getWorkHistoryParams = body => {
    let temp_end = body.work_end_date + " " + body.work_end_hour;
    if ((body.work_end_date == null || body.work_end_hour == "")
      || (body.work_end_date == null || body.work_end_hour == "")) {
      temp_end = null;
    }
    return {
      user: body.user,
      work: body.work,
      work_start: body.work_start_date + " " + body.work_start_hour,
      work_end: temp_end,
    };
  };

module.exports = {
  list: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.render("users/login");
      return;
    }
    WorkHistory.find()
      .then(work_history => {
        res.locals.work_history = work_history;
        next();
      })
      .catch(error => {
        console.log(`Error fetching work_history: ${error.message}`);
        next(error);
      });
  },

  index: (req, res, next) => {
    if (!res.locals.currentUser.admin) {
      res.render("");
      return;
    }
    res.render("work_history/index");
  },

  register: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.render("users/login");
      return;
    }
    WorkHistory.find({ user: res.locals.currentUser, work_date: res.locals.now_time_date })
      .then(work_history => {
        res.locals.work_history = work_history;
        res.render("work_history/register");
      })
      .catch(error => {
        console.log(`Error fetching work_history: ${error.message}`);
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
    res.render("work_history/new");
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
    let workHistoryParams = getWorkHistoryParams(req.body);
    WorkHistory.create(workHistoryParams)
      .then(work_history => {
        console.log("work_history create " + work_history);
        res.locals.redirect = "/work_history";
        next();
      })
      .catch(error => {
        console.log(`Error saving work_history: ${error.message}`);
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
    WorkHistory.findOne({ user: res.locals.currentUser, work_end: null })
      .then(work_historying => {
        if (work_historying) {
          req.flash("error", `今は作業中です。もう一回操作してください。`);
          res.locals.redirect = "/work_history/register";
          return;
        }
        let workHistoryParams = {
          user: res.locals.currentUser,
          work: req.body.work,
          work_start: req.body.work_start,
          work_end: null
        };
        WorkHistory.create(workHistoryParams)
          .then(work_history => {
            console.log("work_history enter " + work_history);
            res.locals.redirect = "/work_history/register";
            next();
          })
          .catch(error => {
            console.log(`Error saving work_history: ${error.message}`);
            next(error);
          });
      })
      .catch(error => {
        console.log(`Error fetching work_history: ${error.message}`);
        next(error);
      })
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
    let work_historyId = req.params.id;
    WorkHistory.findById(work_historyId)
      .then(work_history => {
        res.render("work_history/edit", {
          work_history: work_history
        });
      })
      .catch(error => {
        console.log(`Error fetching work_history by ID: ${error.message}`);
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
    let work_historyId = req.params.id,
      workHistoryParams = getWorkHistoryParams(req.body);

    WorkHistory.findByIdAndUpdate(work_historyId, {
      $set: workHistoryParams
    })
      .then(work_history => {
        console.log("work_history update " + work_history);
        res.locals.redirect = "/work_history/";
        next();
      })
      .catch(error => {
        console.log(`Error updating work_history: ${error.message}`);
        next(error);
      });
  },

  leave: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.locals.redirect = "/users/login";
      next();
      return;
    }
    WorkHistory.findOne({ user: res.locals.currentUser, work_end: null })
      .then(work_historying => {
        if (!work_historying) {
          req.flash("error", `作業していない状態です。もう一回操作してください。`);
          res.locals.redirect = "/work_history/register";
          return;
        }
        let work_historyId = req.params.id,
          workHistoryUpdateParams = {
            user: res.locals.currentUser,
            work: work_historying.work,
            work_start: work_historying.work_start,
            work_end: req.body.work_end
          };
        WorkHistory.findByIdAndUpdate(work_historyId, {
          $set: workHistoryUpdateParams
        })
          .then(work_history => {
            if (req.body.work === "null") {
              console.log("work_history leave update " + work_history);
              res.locals.redirect = "/work_history/register";
              next();
            }
            let workHistoryCreateParams = {
              user: res.locals.currentUser,
              work: req.body.work,
              work_start: req.body.work_end,
              work_end: null
            };
            WorkHistory.create(workHistoryCreateParams)
              .then(work_history => {
                console.log("work_history leave create " + work_history);
                res.locals.redirect = "/work_history/register";
                next();
              })
              .catch(error => {
                console.log(`Error saving work_history: ${error.message}`);
                next(error);
              });
          })
          .catch(error => {
            console.log(`Error updating work_history: ${error.message}`);
            next(error);
          });
      })
      .catch(error => {
        console.log(`Error fetching work_history: ${error.message}`);
        next(error);
      });
  },

  undo: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.locals.redirect = "/users/login";
      next();
      return;
    }
    let work_historyId = req.params.id;
    WorkHistory.findOne({ _id: work_historyId })
      .then(work_historying => {
        WorkHistory.findOne({ user: work_historying.user, work_end: work_historying.work_start })
          .then(work_historybefore => {
            WorkHistory.findByIdAndRemove(work_historyId)
              .then((work_history) => {
                console.log("work_history undo remove " + work_history);
                if (work_historybefore) {
                  let workHistoryUpdateParams = {
                    user: work_historybefore.user,
                    work: work_historybefore.work,
                    work_start: work_historybefore.work_start,
                    work_end: null
                  };
                  WorkHistory.findByIdAndUpdate(work_historybefore._id, {
                    $set: workHistoryUpdateParams
                  })
                    .then(work_history => {
                      console.log("work_history undo update " + work_history);
                      res.locals.redirect = "/work_history/register";
                      next();
                    })
                    .catch(error => {
                      console.log(`Error deleting room_history: ${error.message}`);
                      next();
                    });
                } else {
                  res.locals.redirect = "/work_history/register";
                  next();
                }
              })
              .catch(error => {
                console.log(`Error deleting work_history: ${error.message}`);
                next();
              });
          })
          .catch(error => {
            console.log(`Error fetching work_history: ${error.message}`);
            next(error);
          });
      })
      .catch(error => {
        console.log(`Error fetching work_history: ${error.message}`);
        next(error);
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
    let work_historyId = req.params.id;
    WorkHistory.findByIdAndRemove(work_historyId)
      .then((work_history) => {
        console.log("work_history delete " + work_history);
        res.locals.redirect = "/work_history";
        next();
      })
      .catch(error => {
        console.log(`Error deleting work_history: ${error.message}`);
        next();
      });
  }
};