"use strict";

const mongoose = require("mongoose"),
  { Schema } = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new Schema(
  {
    account: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      first: {
        type: String,
        required: true,
        trim: true
      },
      last: {
        type: String,
        required: true,
        trim: true
      }
    },
    admin: {
      type: Boolean,
      required: true
    }
  },
  {
    timestamps: true
  }
);

userSchema.virtual("fullName").get(function() {
  return `${this.name.last} ${this.name.first}`;
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "account"
});

module.exports = mongoose.model("User", userSchema);