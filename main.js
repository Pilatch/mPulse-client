#!/usr/bin/env node
;(function () {
  "use strict"
  var ApiRequestor = require("./lib/ApiRequestor")
  var writeOutput = require("./lib/writeOutput")
  var writeCsv = require("./lib/writeCsv")
  var options = require("./lib/options")
  var analyzeBeforeAndAfter = require("./lib/analyzeBeforeAndAfter")
  var getSecurityToken

  function provideHelp() {
    console.info(require("./lib/helpMessage"))
    process.exit(1)
  }

  if (options.help) {
    provideHelp()
  }

  try {
    getSecurityToken = require("./lib/getSecurityToken")
  } catch (problem) {
    provideHelp()
  }
  if (options.jsonFileToAnalyze) {
    let outputData = analyzeBeforeAndAfter(options.jsonFileToAnalyze, options.pivotDate)

    writeOutput(outputData, {
      outputFileName: options.jsonFileToAnalyze,
      writeJsonToConsole: options.writeDataToStandardOut
    })
  } else {
    getSecurityToken(mpulseSecurityToken => {
      var requestor = new ApiRequestor(mpulseSecurityToken)

      try {
        let requestData = require("./lib/requestData")

        requestData(requestor, options, outputData => {
          var writeJsonToConsole = options.writeDataToStandardOut && options.outputType === "json"
          var writeCsvToConsole = options.writeDataToStandardOut && options.outputType === "csv"

          if (options.pivotDate) {
            analyzeBeforeAndAfter(outputData, options.pivotDate) //operates on the outputData
          }
          writeOutput(outputData, writeJsonToConsole)
          writeCsv(outputData, writeCsvToConsole)
        })
      } catch (problem) {
        console.error(problem)
        process.exit(1)
      }
    })
  }
})()
