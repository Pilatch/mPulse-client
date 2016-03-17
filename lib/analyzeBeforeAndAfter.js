#!/usr/bin/env node
;(function () {
  "use strict"
  var capitalize = require("capitalize")
  var statistics = require("math-statistics")

  function getData(dataObjectOrFileName) {
    if (typeof dataObjectOrFileName === "string") {
      let fileNameWithoutJsonExtension = dataObjectOrFileName.replace(/\.json$/i, "")
      let pathIsAbsolute = require("path-is-absolute")

      if (pathIsAbsolute(fileNameWithoutJsonExtension)) {
        return require(fileNameWithoutJsonExtension)
      }
      return require(`./${fileNameWithoutJsonExtension}`)
    }
    return dataObjectOrFileName
  }

  function initializeBeforeAfterComparisonsDataStructure(performanceData) {
    if (!performanceData.beforeAfterComparisons) {
      performanceData.beforeAfterComparisons = []
    }
  }

  function bisectData(performanceData, iso8601PivotDate) { //TODO support date range around pivotDate instead of just all the data
    var bisectedData = {
      dataAfterPivot: {},
      dataBeforePivot: {}
    }

    Object.keys(performanceData.dates).forEach(iso8601Date => {
      var data = performanceData.dates[iso8601Date]

      Object.keys(data).forEach(dataDescriptor => { //median, moe, p95 ... etc.
        var datum = parseInt(data[dataDescriptor], 10)

        if (datum !== null) {
          datum = parseFloat(data[dataDescriptor], 10)
          if (!isNaN(datum)) {
            if (!bisectedData.dataBeforePivot[dataDescriptor]) {
              bisectedData.dataBeforePivot[dataDescriptor] = []
            }
            if (!bisectedData.dataAfterPivot[dataDescriptor]) {
              bisectedData.dataAfterPivot[dataDescriptor] = []
            }
            if (iso8601Date < iso8601PivotDate) {
              bisectedData.dataBeforePivot[dataDescriptor].push(datum)
            } else {
              bisectedData.dataAfterPivot[dataDescriptor].push(datum)
            }
          }
        }
      })
    })
    return bisectedData
  }

  function getExistingBeforeAfterComparison(performanceData, iso8601PivotDate) {
    var beforeAfterDataObject

    for (let i = 0; i < performanceData.beforeAfterComparisons.length; i++) {
      beforeAfterDataObject = performanceData.beforeAfterComparisons[i]
      if (beforeAfterDataObject.pivotDate === iso8601PivotDate) {
        return beforeAfterDataObject
      }
    }
  } //implicitly return undefined if not found

  function makeBlankBeforeAfterComparison(iso8601PivotDate) {
    return {
      after: {},
      before: {},
      pivotDate: iso8601PivotDate,
      percentChange: {}
    }
  }

  function initializeBeforeAfterComparisonAggregates(beforeAfterComparison, aggregateOfKey) {
    if (!beforeAfterComparison.before[aggregateOfKey]) {
      beforeAfterComparison.before[aggregateOfKey] = {}
    }
    if (!beforeAfterComparison.after[aggregateOfKey]) {
      beforeAfterComparison.after[aggregateOfKey] = {}
    }
  }

  function aggregateAndSaveToBeforeAfterComparison(bisectedData, beforeAfterComparison, aggregateFunctionName) {
    var aggregateOfKey
    var aggregateOfBefore
    var aggregateOfAfter

    if (!aggregateFunctionName) {
      aggregateFunctionName = "mean"
    }
    aggregateOfKey = `${aggregateFunctionName}Of` //e.g.: meanOf, medianOf
    initializeBeforeAfterComparisonAggregates(beforeAfterComparison, aggregateOfKey)
    aggregateOfBefore = beforeAfterComparison.before[aggregateOfKey]
    aggregateOfAfter = beforeAfterComparison.after[aggregateOfKey]
    Object.keys(bisectedData.dataBeforePivot).forEach(dataDescriptor => {
      if (bisectedData.dataBeforePivot[dataDescriptor].length
        && bisectedData.dataAfterPivot[dataDescriptor]
        && bisectedData.dataAfterPivot[dataDescriptor].length
      ) {
        let computedAggregateBefore = statistics[aggregateFunctionName](bisectedData.dataBeforePivot[dataDescriptor])
        let computedAggregateAfter = statistics[aggregateFunctionName](bisectedData.dataAfterPivot[dataDescriptor])
        let percentChange = 100 * (computedAggregateAfter / computedAggregateBefore - 1)
        let percentChangeDataDescriptorKey = `${aggregateOfKey}${capitalize(dataDescriptor)}`

        aggregateOfAfter[dataDescriptor] = computedAggregateAfter
        aggregateOfBefore[dataDescriptor] = computedAggregateBefore
        beforeAfterComparison.percentChange[percentChangeDataDescriptorKey] = percentChange
      }
    })
  }

  function isPivotOutsideDateRange(performanceData, iso8601PivotDate) {
    return iso8601PivotDate <= performanceData.startDate || iso8601PivotDate > performanceData.endDate
  }

  module.exports = (dataObjectOrFileName, iso8601PivotDate) => {
    var performanceData = getData(dataObjectOrFileName)
    var bisectedData = bisectData(performanceData, iso8601PivotDate)
    var beforeAfterComparison

    if ( isPivotOutsideDateRange(performanceData, iso8601PivotDate) ) {
      throw `${iso8601PivotDate} is outside performance data's date range of ${performanceData.startDate} to ${performanceData.endDate}.`
    }
    initializeBeforeAfterComparisonsDataStructure(performanceData)
    beforeAfterComparison = getExistingBeforeAfterComparison(performanceData, iso8601PivotDate)
    if (!beforeAfterComparison) {
      beforeAfterComparison = makeBlankBeforeAfterComparison(iso8601PivotDate)
      performanceData.beforeAfterComparisons.push(beforeAfterComparison)
    }
    aggregateAndSaveToBeforeAfterComparison(bisectedData, beforeAfterComparison, "mean")
    return performanceData
  }

})()
