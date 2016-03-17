;(function () {
  "use strict"
  var verbalize = require("./verbalize")
  var enumerateDateRange = require("./enumerateDateRange")
  var dateHell = require("./dateHell")
  var getApiKeys = require("./getApiKeys")
  var apiKeys = getApiKeys()
  var maximumRepeatCalls = 3
  var repeatCallTimeout = 5000

  module.exports = (dataRequestor, options, callback) => {
    var iso8601dates = enumerateDateRange(options.startDate, options.endDate)
    var apiKey = apiKeys[options.storeCode]
    var dataRequestParameters = options.dataRequestParameters
    var numberOfDataResponces = 0
    var outputData = {
      country: dataRequestParameters.country,
      dates: {},
      endDate: dateHell.convertSimpleObjectToIso8601(options.endDate),
      storeCode: options.storeCode,
      pageGroup: options.pageGroup,
      queryType: options.queryType,
      startDate: dateHell.convertSimpleObjectToIso8601(options.startDate),
      timer: dataRequestParameters.timer
    }

    if (!apiKey) {
      throw `Could not find mPulse API key for storeCode ${options.storeCode}`
    }

    iso8601dates.forEach( function singleDateRequest(iso8601date) {
      dataRequestParameters.date = iso8601date
      dataRequestor.requestData(
        apiKey,
        options.queryType,
        dataRequestParameters,
        dataReceived => {
          outputData.dates[iso8601date] = JSON.parse(dataReceived)
          verbalize( `data received for date ${iso8601date}: `, JSON.parse(dataReceived) )
          numberOfDataResponces++
          if (numberOfDataResponces === iso8601dates.length) {
            callback(outputData)
          }
        },
        errorData => {
          console.error(`Status code ${errorData.statusCode} received`)
          console.error(`errorData:`, errorData)
          if (errorData.statusCode === 500) {
            verbalize("API statusCode 500 received, re-attempting.")
            if (!singleDateRequest.numberOfRepeatCalls) {
              singleDateRequest.numberOfRepeatCalls = 0
            }
            singleDateRequest.numberOfRepeatCalls++
            if (singleDateRequest.numberOfRepeatCalls > maximumRepeatCalls) {
              throw "Maximum number of repeat data requests exceeded"
            }
            setTimeout(singleDateRequest, repeatCallTimeout, iso8601date)
          } else {
            console.error(`Cannot recover from API statusCode ${errorData.statusCode}`)
            console.error("Dumping received data as-is.")
            console.error(`Data was not received for ${iso8601dates.length - numberOfDataResponces} dates.`)
            callback(outputData)
            throw "un-recoverable mPulse API error"
          }
        }
      )
    })
  }
})()
