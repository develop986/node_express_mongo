"use strict";

const mongoose = require("mongoose"),
  { Schema } = require("mongoose");

var roomSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Room", roomSchema);