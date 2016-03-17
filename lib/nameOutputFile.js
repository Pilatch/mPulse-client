;(function () {
  "use strict"
  module.exports = {
    csv(outputDirectory, outputData) {
      return this.json(outputDirectory, outputData).replace(/\.json$/i, ".csv")
    },
    json(outputDirectory, outputData) {
      var pageGroup
      var fileName

      if (outputData.pageGroup) {
        pageGroup = outputData.pageGroup.replace(/\s+/g, "-")
      } else if (outputData.storeCode) {
        pageGroup = outputData.storeCode //aggregate data for the whole store, rather than just one page
      } else {
        throw "Either pageGroup or storeCode is required to create a file name."
      }
      fileName = `${outputDirectory}/${pageGroup}-${outputData.timer}-${outputData.queryType}`

      if (outputData.country) {
        fileName = `${fileName}-${outputData.country}`
      }
      return `${fileName}-${outputData.startDate}-to-${outputData.endDate}.json`
    }
  }
})()
