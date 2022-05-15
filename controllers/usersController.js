"use strict";


const User = require("../models/user"),
  passport = require("passport"),
  getUserParams = body => {
    if (body.admin == null) {
      body.admin = false;
    }
    return {
      account: body.account,
      name: {
        first: body.first,
        last: body.last
      },
      password: body.password,
      admin: body.admin
    };
  };

module.exports = {
  list: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.render("users/login");
      return;
    }
    User.find()
      .then(users => {
        res.locals.users = users;
        next();
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },

  index: (req, res, next) => {
    if (!res.locals.currentUser.admin) {
      res.render("");
      return;
    }
    res.render("users/index");
  },

  new: (req, res) => {
    /*
    if (!res.locals.currentUser) {
      res.render("users/login");
      return;
    }
    if (!res.locals.currentUser.admin) {
      res.render("");
      return;
    }
    */
    res.render("users/new");
  },

  create: (req, res, next) => {
    /*
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
    */
    if (req.skip) return next();
    let newUser = new User(getUserParams(req.body));
    User.register(newUser, req.body.password, (e, user) => {
      if (user) {
        console.log("user register " + user);
        req.flash("success", `アカウントが作成されました。`);
        res.locals.redirect = "/users";
        next();
      } else {
        req.flash("error", `アカウント作成に失敗しました。 because: ${e.message}.`);
        res.locals.redirect = "/users/new";
        next();
      }
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
    if (!res.locals.currentUser.admin) {
      res.render("");
      return;
    }
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        res.render("users/edit", {
          user: user
        });
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  password: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.render("users/login");
      return;
    }
    User.findById(res.locals.currentUser._id)
      .then(user => {
        res.render("users/password", {
          user: user
        });
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
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
    let userId = req.params.id,
      userParams = getUserParams(req.body);
    User.findByIdAndUpdate(userId, {
      $set: userParams
    })
      .then(user => {
        console.log("user update " + user);
        if (!req.body.password) {
          req.flash("success", `ユーザー情報が更新されました。`);
          res.locals.redirect = "/users";
          next();
          return;
        }
        user.setPassword(req.body.password)
          .then(user => {
            console.log("password update " + user);
            user.save()
              .then(() => {
                req.flash("success", `ユーザー情報とパスワードが更新されました。`);
                res.locals.redirect = "/users";
                next();
              })
              .catch(error => {
                console.log(`Error updating user by ID: ${error.message}`);
                next(error);
              });
          })
      })
      .catch(error => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },

  change: (req, res, next) => {
    if (!res.locals.currentUser) {
      res.locals.redirect = "/users/login";
      next();
      return;
    }
    if (req.body.password_new != req.body.password_confirm) {
      req.flash("error", `新パスワードが合っていません。`);
      res.locals.redirect = "/users/password/";
      next();
      return;
    }
    let userId = res.locals.currentUser._id;
    User.findById(userId)
      .then(user => {
        user.changePassword(req.body.password_old, req.body.password_new)
          .then(user => {
            console.log("user change " + user);
            user.save()
              .then(() => {
                req.flash("success", `パスワードが更新されました。`);
                res.locals.redirect = "/";
                next();
              })
              .catch(error => {
                console.log(`Error updating user by ID: ${error.message}`);
                next(error);
              });
          })
          .catch(error => {
            req.flash("error", `旧パスワードが間違っています。`);
            res.locals.redirect = "/users/password/";
            next();
          });
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
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
    let userId = req.params.id;
    User.findByIdAndRemove(userId)
      .then((user) => {
        console.log("user delete " + user);
        res.locals.redirect = "/users";
        next();
      })
      .catch(error => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },

  login: (req, res) => {
    res.render("users/login");
  },

  validate: (req, res, next) => {
    req.check("account", "Account cannot be empty").notEmpty();
    req.check("password", "Password cannot be empty").notEmpty();
    req.getValidationResult().then(error => {
      if (!error.isEmpty()) {
        let messages = error.array().map(e => e.msg);
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/users/new";
        next();
      } else {
        next();
      }
    });
  },

  authenticate: passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "ログインに失敗しました。",
    successRedirect: "/",
    successFlash: "ログインされました。"
  }),

  logout: (req, res, next) => {
    req.logout();
    req.flash("success", "ログアウトされました。");
    res.locals.redirect = "/";
    next();
  }
};