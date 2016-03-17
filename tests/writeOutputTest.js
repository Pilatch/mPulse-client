/*eslint-env mocha*/
;(function () {
  "use strict"
  var expect = require("chai").expect
  var nameOutputFile = require("../lib/nameOutputFile")
  var writeOutput = require("../lib/writeOutput")
  var configuration = require("../configuration")

  describe("writeOutput", () => {
    var mockData = {
      storeCode: "TEST",
      startDate: "2015-01-01",
      endDate: "2015-01-02",
      queryType: "summary",
      timer: "FirstByte",
      dates: {
        "2015-01-01": {
          "median": "2367",
          "moe": "137.40631982276625",
          "n": "5674",
          "p95": "14600",
          "p98": "29694"
        },
        "2015-01-02": {
          "median": "2574",
          "moe": "136.84557595605568",
          "n": "3604",
          "p95": "12300",
          "p98": "23620"
        }
      }
    }

    it("should write to standard out if data and a boolean are passed", () => {
      writeOutput(mockData, true)
    })
    it("should write to a file if only data was passed", () => {
      let fileName = nameOutputFile.json(configuration.outputDirectory, mockData)

      expect(() => {
        writeOutput(mockData)
      }).to.throw(`ENOENT: no such file or directory, open '${fileName}'`)
    })
  })
})()
