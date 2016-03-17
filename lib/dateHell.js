;(function () {
  "use strict"
  var dateHell = {
    convertIso8601DateToSimpleObject(iso8601Date) {
      var dateParts = iso8601Date.split("-")

      return {
        year: parseInt(dateParts[0], 10),
        month: parseInt(dateParts[1], 10),
        day: parseInt(dateParts[2], 10)
      }
    },

    iso8601FormatDate(date) {
      return date.toISOString().replace(/T.*$/, "")
    },

    convertSimpleObjectToIso8601(simpleDate) {
      return dateHell.iso8601FormatDate( dateHell.convertSimpleObjectToDateObject(simpleDate) )
    },

    convertSimpleObjectToDateObject(simpleDate) {
      //January is month zero. Go figure.
      return new Date(simpleDate.year, simpleDate.month - 1, simpleDate.day)
    },

    convertIso8601DateToDateObject(iso8601Date) {
      return dateHell.convertSimpleObjectToDateObject( dateHell.convertIso8601DateToSimpleObject(iso8601Date) )
    },

    timeTravel(numberOfDays, fromDate) {
      var date

      if (typeof fromDate === "string") {
        date = dateHell.convertIso8601DateToDateObject(fromDate)
      } else if (typeof fromDate === "object") {
        if (fromDate instanceof Date) {
          date = fromDate
        } else if (fromDate.year && fromDate.month && fromDate.day) {
          date = dateHell.convertSimpleObjectToDateObject(fromDate)
        } else {
          throw `unrecognized date format for fromDate: ${fromDate}`
        }
      }
      if (!date) {
        date = new Date()
      }
      date.setDate(date.getDate() + numberOfDays)
      return date
    }
  }

  module.exports = dateHell
})()
