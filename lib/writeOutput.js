;(function () {
  "use strict"
  var fs = require("fs") //node file system extensions
  var configuration = require("../configuration")
  var verbalize = require("./verbalize")
  var nameOutputFile = require("./nameOutputFile")

  module.exports = (outputData, writeOptions) => {
    var outputString = JSON.stringify(outputData, null, 2)
    var fileName

    if (typeof writeOptions !== "object") {
      writeOptions = {writeJsonToConsole: writeOptions}
    }
    if (writeOptions.writeJsonToConsole) {
      console.log(outputString)
      return null
    } else if (writeOptions.outputFileName) {
      fileName = writeOptions.outputFileName
    } else {
      fileName = nameOutputFile.json(configuration.outputDirectory, outputData)
    }
    verbalize(`Saving to ${fileName}`)
    fs.writeFileSync(fileName, outputString)
    return fileName
  }
})()
