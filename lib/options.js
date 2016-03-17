;(function () {
  "use strict"
  var yarguments = require("yargs").argv
  var verbalize = require("./verbalize")
  var configuration = require("../configuration")
  var getPageGroupParameter = require("./getPageGroupParameter")
  var dateHell = require("./dateHell")
  var optionNamesSameAsDataRequestParameters = ["country", "percentile", "timer"]
  var dateRangeFailsafe = 60
  var storeCode
  var pageGroup
  var startDate
  var endDate
  var options
  var jsonFileToAnalyze

  global.VERBALIZE = yarguments.VERBALIZE || yarguments.V

  function getOption(optionName) {
    return yarguments[optionName] || configuration.defaultOptions[optionName]
  }

  function getIso8601EndDate() {
    var iso8601Date = getOption("endDate")

    if (!iso8601Date) {
      let dateRange = getOption("dateRange")
      let startDateOption = getOption("startDate")

      //if a start date is specified, along with a date range, calculate based on that
      if (startDateOption && dateRange) {
        iso8601Date = dateHell.iso8601FormatDate( dateHell.timeTravel(dateRange, startDateOption) )
      } else {
        //otherwise, take yesterday
        iso8601Date = dateHell.iso8601FormatDate( dateHell.timeTravel(-1) )
      }
    }
    return iso8601Date
  }

  function getIso8601StartDate() {
    var iso8601Date = getOption("startDate")

    if (!iso8601Date) {
      let dateRange = getOption("dateRange") || dateRangeFailsafe

      iso8601Date = dateHell.iso8601FormatDate( dateHell.timeTravel(-1 * dateRange, getIso8601EndDate()) )
    }
    return iso8601Date
  }

  endDate = getIso8601EndDate()
  startDate = getIso8601StartDate()
  storeCode = getOption("storeCode").toUpperCase()
  pageGroup = getPageGroupParameter(storeCode, getOption("pageGroup"))
  jsonFileToAnalyze = getOption("analyze")
  options = {
    dataRequestParameters: {},
    endDate: dateHell.convertIso8601DateToSimpleObject( endDate ),
    help: yarguments.help || yarguments.h,
    outputType: getOption("outputType"),
    pivotDate: getOption("pivotDate"),
    queryType: getOption("queryType"),
    startDate: dateHell.convertIso8601DateToSimpleObject( startDate ),
    storeCode: storeCode,
    writeDataToStandardOut: yarguments.o
  }
  if (pageGroup) {
    options.dataRequestParameters["page-group"] = pageGroup
    options.pageGroup = pageGroup
  }
  if (jsonFileToAnalyze) {
    if (!options.pivotDate) {
      throw "To analyze a json file, specify a pivotDate"
    }
    options.jsonFileToAnalyze = jsonFileToAnalyze
  }
  optionNamesSameAsDataRequestParameters.forEach(optionName => {
    var optionValue = getOption(optionName)

    if (optionValue) {
      options.dataRequestParameters[optionName] = optionValue
    }
  })
  verbalize("options", options)
  if (startDate >= endDate) {
    console.error("startDate must be before endDate")
    process.exit(1)
  }
  module.exports = options
})()
