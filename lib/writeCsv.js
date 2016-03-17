;(function () {
  "use strict"
  var verbalize = require("./verbalize")
  var fs = require("fs")
  var json2csv = require("json2csv")
  var fields = ["date", "median", "moe", "n", "p95", "p98"]
  var nameOutputFile = require("./nameOutputFile")
  var configuration = require("../configuration")

  function prepareSavedDataObjectForCsvConversion(date, originalDataObject) {
    var newDataObject = {
      date: date
    }

    verbalize("preparing date:", date)
    Object.keys(originalDataObject).forEach(key => {
      var value = originalDataObject[key]

      if (value === null) value = ""
      newDataObject[key] = value
    })
    return newDataObject
  }

  function prepareDatesArray(dates) {
    var newDataObjectsArray = []

    Object.keys(dates).forEach(date => {
      var dataObject = dates[date]

      newDataObjectsArray.push(prepareSavedDataObjectForCsvConversion(date, dataObject))
    })
    return newDataObjectsArray
  }

  module.exports = (data, writeToConsole) => {
    var preparedDatesArray = prepareDatesArray(data.dates)
    var csvOutput = ""
    var csvFileName = nameOutputFile.csv(configuration.outputDirectory, data)

    preparedDatesArray.forEach((dataObject, index) => {
      verbalize("dataObject for csv", dataObject)
      json2csv({
        data: dataObject,
        hasCSVColumnTitle: index === 0,
        fields: fields,
        quotes: ""
      }, (error, csv) => {
        if (error) throw error
        csvOutput += `${csv}\n`
      })
    })
    if (writeToConsole) {
      console.log(csvOutput)
    } else {
      verbalize(`writing csv to ${csvFileName}`)
      fs.writeFileSync(csvFileName, csvOutput)
      return csvFileName
    }
  }
})()
