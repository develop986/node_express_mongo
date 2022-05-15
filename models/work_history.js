"use strict";

const mongoose = require("mongoose"),
  { Schema } = require("mongoose");

var workHistorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    work: {
      type: Schema.Types.ObjectId,
      ref: "Work",
      required: true
    },
    work_start: {
      type: Date,
      required: true
    },
    work_end: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("work_history", workHistorySchema);