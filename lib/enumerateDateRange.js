;(function () {
  "use strict"
  var calendar = require("node-calendar")
  var verbalize = require("./verbalize")

  function areDaysTheSame(day1, day2) {
    return day1.day === day2.day && day1.month === day2.month && day1.year === day2.year
  }

  function formatDayForApi(day) {
    return `${day.year}-${("00" + day.month).slice(-2)}-${("00" + day.day).slice(-2)}`
  }

  function incrementDayObject(day) {
    var daysInMonth = calendar.monthrange(day.year, day.month)[1]

    if (day.day === daysInMonth) {
      day.day = 1
      day.month ++
      if (day.month === 13) {
        day.month = 1
      }
    } else {
      day.day ++
    }
  }

  module.exports = (dateRangeStart, dateRangeEnd) => {
    var iso8601Dates = []
    var intermediateDay = {
      year: dateRangeStart.year,
      month: dateRangeStart.month,
      day: dateRangeStart.day
    }
    var formattedLastDay = false

    while (!formattedLastDay) {
      formattedLastDay = areDaysTheSame(intermediateDay, dateRangeEnd)
      iso8601Dates.push( formatDayForApi(intermediateDay) )
      incrementDayObject(intermediateDay)
    }
    verbalize("iso8601Dates:", iso8601Dates)
    return iso8601Dates
  }
})()
