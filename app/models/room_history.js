"use strict";

const mongoose = require("mongoose"),
  { Schema } = require("mongoose"),
  User = require("./user");

var roomHistorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },
    room_start: {
      type: Date,
      required: true
    },
    room_end: {
      type: Date
    },
    room_unlock: {
      type: Boolean,
      required: true
    },
    room_lock: {
      type: Boolean,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("room_history", roomHistorySchema);