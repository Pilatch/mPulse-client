;(function () {
  "use strict"
  var fs = require("fs")
  var path = require("path")

  function getLongestKeyLength(options) {
    var longestKeyLength = 0

    Object.keys(options).forEach(key => {
      if (key.length > longestKeyLength) longestKeyLength = key.length
    })
    return longestKeyLength
  }

  function getSeparator(length) {
    var separator = ""

    while (separator.length < length) separator += " "
    return separator
  }

  function padOptionKey(optionKey, longestKeyLength, minimumSeparatorLength) {
    while (optionKey.length < longestKeyLength) optionKey += " "
    return optionKey + getSeparator(minimumSeparatorLength)
  }

  function getAlignedOptions(options, minimumSeparatorLength) {
    var longestKeyLength = getLongestKeyLength(options)
    var optionsText = ""

    Object.keys(options).forEach(key => {
      var description = options[key]
      var paddedKey = padOptionKey(key, longestKeyLength, minimumSeparatorLength)

      optionsText += `${paddedKey}${description}\n`
    })
    return optionsText
  }

  function getRequiredFilesNote(configuration) {
    var notes = []
    var tokenFileDirName = path.dirname(configuration.tokenFilePath)

    if ( !fs.existsSync(configuration.credentialsFilePath) ) {
      notes.push(`In the configuration file, there must be an entry named "credentialsFilePath".`)
      notes.push(`It must point to a readable json-format file containing the keys "userName" and "password",`)
      notes.push(`which are your SOSTA mPulse userName and password.`)
    }
    if ( !fs.existsSync(tokenFileDirName) ) {
      notes.push(`In the configuration file, there must be an entry named "tokenFilePath".`)
      notes.push(`It must point to a writable directory and a file name to be placed in that directory.`)
    }
    if (notes.length) {
      return notes.join("\n") + `\n\n`
    }
    return ""
  }

  function getHelpMessage() {
    var configuration = require("../configuration")
    var requiredFilesNote = getRequiredFilesNote(configuration)
    var minimumSeparatorLength = 4
    var options = {
      "--storeCode <storeCode>": "which webstore you're interested in",
      "--pageGroup <pageName>": "e.g. cart, address, shipping ...",
      "--dateRange <numberOfDays>": "get data from this many days",
      "--startDate <date>": "start of date range in YYYY-MM-DD format",
      "--endDate <date>": "in YYYY-MM-DD format; omit for yesterday",
      "--pivotDate <date>": "in YYYY-MM-DD format to calculate A/B means",
      "--analyze <jsonFile>": "use a pivotDate to analyze an existing file",
      "--timer <timerName>": "e.g. FirstLastByte, PageLoad, DomReady ...",
      "--queryType <queryName>": "e.g. summary, histogram, geography ...",
      "--country <countryCode>": "e.g. US, FR, DE ...",
      "--percentile <number>": "where in the data's distribution you want to focus",
      "--outputType <json|csv>": "if outputting to console, which to output",
      "-o": "output data to console instead of creating a file",
      "-V": "verbalize debug info",
      "--help": "show this message and quit"
    }
    var helpMessage =
`${requiredFilesNote}Usage: ./main.js [options]
options:
${getAlignedOptions(options, minimumSeparatorLength)}
defaults set in configuration.json:
${getAlignedOptions(configuration.defaultOptions, minimumSeparatorLength)}`

    return helpMessage
  }

  module.exports = getHelpMessage()
})()
