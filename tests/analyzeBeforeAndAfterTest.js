/*eslint-env mocha*/
;(function () {
  "use strict"
  var expect = require("chai").expect
  var analyzeBeforeAndAfter = require("../lib/analyzeBeforeAndAfter")
  var util = require("util")
  var clone = require("clone")

  function getMockPerformanceData() {
    return clone( require("./resources/mock-performance-data") )
  }

  function mockJuly15Assertions(mockPerformanceData) {
    var iso8601PivotDate = "2015-07-15"
    var beforeAfterComparisons = analyzeBeforeAndAfter(mockPerformanceData, iso8601PivotDate).beforeAfterComparisons
    var singleComparison = beforeAfterComparisons[0]

    expect(singleComparison.pivotDate).to.equal(iso8601PivotDate)
    expect(singleComparison.before.meanOf.median).to.equal(5500)
    expect(singleComparison.before.meanOf.n).to.equal(4666.666666666667)
    expect(singleComparison.before.meanOf.p98).to.equal(10500)
    expect(singleComparison.after.meanOf.median).to.equal(3000)
    expect(singleComparison.after.meanOf.n).to.equal(6000)
    expect(singleComparison.after.meanOf.p98).to.equal(4500)
    expect(singleComparison.percentChange.meanOfMedian).to.equal(-45.45454545454546)
    expect(singleComparison.percentChange.meanOfN).to.equal(28.57142857142856)
    expect(singleComparison.percentChange.meanOfP98).to.equal(-57.14285714285714)
  }

  describe("analyzeBeforeAndAfter", () => {
    var mockPerformanceData = getMockPerformanceData()
    var iso8601PivotDate
    var beforeAfterComparisons
    var singleComparison

    it("should do a/b aggregation and save to performance data", () => {
      mockJuly15Assertions(mockPerformanceData)
    })
    it("should save multiple pivot dates", () => {
      iso8601PivotDate = "2015-07-04"
      beforeAfterComparisons = analyzeBeforeAndAfter(mockPerformanceData, iso8601PivotDate).beforeAfterComparisons
      expect(beforeAfterComparisons.length).to.equal(2)
      singleComparison = beforeAfterComparisons[1]
console.log(util.inspect(beforeAfterComparisons, {showHidden: false, depth: null}))
      expect(singleComparison.pivotDate).to.equal(iso8601PivotDate)
      expect(singleComparison.before.meanOf.median).to.equal(5500)
      expect(singleComparison.before.meanOf.n).to.equal(5000)
      expect(singleComparison.before.meanOf.p98).to.equal(10500)
      expect(singleComparison.after.meanOf.median).to.equal(3625)
      expect(singleComparison.after.meanOf.n).to.equal(5500)
      expect(singleComparison.after.meanOf.p98).to.equal(6000)
      //TODO double check the math on these three numbers below:
      expect(singleComparison.percentChange.meanOfMedian).to.equal(-34.09090909090909)
      expect(singleComparison.percentChange.meanOfN).to.equal(10.000000000000009)
      expect(singleComparison.percentChange.meanOfP98).to.equal(-42.85714285714286)
    })
    it("should throw an error if the pivot is outside the date range", () => {
      var badPivot = "2015-03-30"

      expect( () => {
        analyzeBeforeAndAfter(mockPerformanceData, badPivot)
      }).to.throw(`${badPivot} is outside performance data's date range of 2015-06-02 to 2015-07-31.`)
    })
    it("should work on either a json file or an object in memory", () => {
      mockPerformanceData = getMockPerformanceData() //gets a fresh copy that doesn't have beforeAfterComparisons
      expect(mockPerformanceData.beforeAfterComparisons).to.be.undefined
      iso8601PivotDate = "2015-07-15"
      beforeAfterComparisons = analyzeBeforeAndAfter(mockPerformanceData, iso8601PivotDate).beforeAfterComparisons
      mockJuly15Assertions(mockPerformanceData)
    })
  })
})()

// example:
//
// "beforeAfterComparisons": [
//   {
//     "pivotDate": "2015-09-30",
//     "before": {
//       "meanOf": {
//         "median": 99.989898,
//         "moe": 0.123123
//       }
//     },
//     "after": {
//       "meanOf": {
//         "median": 100.876876,
//         "moe": 0.9876
//       }
//     },
//     "percentChange": {
//       "meanOfMedian": 8.76,
//       "meanOfMoe": 0.1
//     }
//   }
// ]
