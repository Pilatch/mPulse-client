/*eslint-env mocha*/
;(function () {
  "use strict"
  var nameOutputFile = require("../lib/nameOutputFile")
  var expect = require("chai").expect

  describe("nameOutputFile", () => {
    var outputDirectory = "./output"

    it("should name with a country code", () => {
      var outputData = {
        country: "US",
        endDate: "2015-06-15",
        pageGroup: "TSA Cart Page",
        queryType: "summary",
        startDate: "2014-12-01",
        timer: "FirstLastByte"
      }
      var expectedJsonFileName = "./output/TSA-Cart-Page-FirstLastByte-summary-US-2014-12-01-to-2015-06-15.json"
      var expectedCsvFileName = "./output/TSA-Cart-Page-FirstLastByte-summary-US-2014-12-01-to-2015-06-15.csv"

      expect( nameOutputFile.json(outputDirectory, outputData) ).to.equal(expectedJsonFileName)
      expect( nameOutputFile.csv(outputDirectory, outputData) ).to.equal(expectedCsvFileName)
    })
    it("should name without a country code", () => {
      var outputData = {
        endDate: "2015-06-15",
        pageGroup: "TSA Cart Page",
        queryType: "summary",
        startDate: "2014-12-01",
        timer: "FirstLastByte"
      }
      var expectedJsonFileName = "./output/TSA-Cart-Page-FirstLastByte-summary-2014-12-01-to-2015-06-15.json"
      var expectedCsvFileName = "./output/TSA-Cart-Page-FirstLastByte-summary-2014-12-01-to-2015-06-15.csv"

      expect( nameOutputFile.json(outputDirectory, outputData) ).to.equal(expectedJsonFileName)
      expect( nameOutputFile.csv(outputDirectory, outputData) ).to.equal(expectedCsvFileName)
    })
    it("should name for a storeCode if no pageGroup is provided", () => {
      var outputData = {
        endDate: "2015-06-15",
        queryType: "summary",
        startDate: "2014-12-01",
        storeCode: "TSA",
        timer: "FirstLastByte"
      }
      var expectedJsonFileName = "./output/TSA-FirstLastByte-summary-2014-12-01-to-2015-06-15.json"
      var expectedCsvFileName = "./output/TSA-FirstLastByte-summary-2014-12-01-to-2015-06-15.csv"

      expect( nameOutputFile.json(outputDirectory, outputData) ).to.equal(expectedJsonFileName)
      expect( nameOutputFile.csv(outputDirectory, outputData)).to.equal(expectedCsvFileName)
    })
  })
})()
