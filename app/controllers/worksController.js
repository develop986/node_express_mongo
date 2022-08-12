"use strict";


const Work = require("../models/work"),
  httpStatus = require("http-status-codes"),
  getWorkParams = body => {
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
    Work.find()
      .then(works => {
        res.locals.works = works;
        next();
      })
      .catch(error => {
        console.log(`Error fetching works: ${error.message}`);
        next(error);
      });
  },

  index: (req, res, next) => {
    res.render("works/index");
  },

  new: (req, res) => {
    if (!res.locals.currentUser) {
      res.render("users/login");
      return;
    }
    res.render("works/new");
  },

  create: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.locals.redirect = "/users/login";
      next();
      return;
    }
    let workParams = getWorkParams(req.body);
    Work.create(workParams)
      .then(work => {
        console.log("work create " + work);
        res.locals.redirect = "/works";
        next();
      })
      .catch(error => {
        console.log(`Error saving work: ${error.message}`);
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
    let workId = req.params.id;
    Work.findById(workId)
      .then(work => {
        res.render("works/edit", {
          work: work
        });
      })
      .catch(error => {
        console.log(`Error fetching work by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.locals.redirect = "/users/login";
      next();
      return;
    }
    let workId = req.params.id,
      workParams = getWorkParams(req.body);
    console.log("workParams " + workParams);
    Work.findByIdAndUpdate(workId, {
      $set: workParams
    })
      .then(work => {
        console.log("work update " + work);
        res.locals.redirect = `/works`;
        next();
      })
      .catch(error => {
        console.log(`Error updating work by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.locals.redirect = "/users/login";
      next();
      return;
    }
    let workId = req.params.id;
    Work.findByIdAndRemove(workId)
      .then((work) => {
        console.log("work delete " + work);
        res.locals.redirect = "/works";
        next();
      })
      .catch(error => {
        console.log(`Error deleting work by ID: ${error.message}`);
        next();
      });
  }
};