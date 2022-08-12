"use strict";

module.exports = {
  init: (req, res, next) => {

    let getDate = function (date) {
      if (date == null) {
        return null;
      }
      let year_str = date.getFullYear();
      let month_str = 1 + date.getMonth();
      let day_str = date.getDate();
      month_str = ('0' + month_str).slice(-2);
      day_str = ('0' + day_str).slice(-2);
      let format_str = 'YYYY-MM-DD';
      format_str = format_str.replace(/YYYY/g, year_str);
      format_str = format_str.replace(/MM/g, month_str);
      format_str = format_str.replace(/DD/g, day_str);
      return format_str;
    }

    let getHour = function (date) {
      if (date == null) {
        return null;
      }
      let hour_str = date.getHours();
      let minute_str = date.getMinutes();
      hour_str = ('0' + hour_str).slice(-2);
      minute_str = ('0' + minute_str).slice(-2);
      let format_str = 'hh:mm';
      format_str = format_str.replace(/hh/g, hour_str);
      format_str = format_str.replace(/mm/g, minute_str);
      return format_str;
    }

    let getTime = function (date) {
      if (date == null) {
        return null;
      }
      return getDate(date) + " " + getHour(date);
    }

    res.locals.getDate = getDate;
    res.locals.getHour = getHour;
    res.locals.getTime = getTime;

    let now_time = new Date;
    let now_time_date = new Date(now_time.getFullYear(), now_time.getMonth(), now_time.getDate());
    let now_time_date_str = getDate(now_time_date);

    let now_minutes_floor15 = (Math.floor(now_time.getMinutes() / 15) * 15);
    let work_hour_start = new Date(now_time.getFullYear(), now_time.getMonth(), now_time.getDate(), now_time.getHours(),
      now_minutes_floor15 + 15);
    let work_hour_start_str = getTime(work_hour_start);

    let work_hour_end = new Date(now_time.getFullYear(), now_time.getMonth(), now_time.getDate(), now_time.getHours(),
      now_minutes_floor15);
    let work_hour_end_str = getTime(work_hour_end);

    res.locals.now_time = now_time;
    res.locals.now_time_date = now_time_date;
    res.locals.now_time_date_str = now_time_date_str;
    res.locals.work_hour_start_str = work_hour_start_str;
    res.locals.work_hour_end_str = work_hour_end_str;

    next();
  },

  index: (req, res) => {
    if (!res.locals.currentUser) {
      res.render("users/login");
      return;
    }
    res.render("index");
  }
};