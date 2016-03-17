;(function () {
  "use strict"
  var https = require("https")
  var querystring = require("querystring")
  var verbalize = require("./verbalize")

  function requestErrorHandler(error) {
    if (this.errorCallback) {
      this.errorCallback({
        error: error
      })
    } else {
      throw "Problem with request: " + error.message
    }
  }

  function responseHandler(response) {
    var dataReceived = ""
    var successCallback = this.successCallback
    var errorCallback = this.errorCallback

    if (response.statusCode !== 200) {
      if (errorCallback) {
        return errorCallback({
          statusCode: response.statusCode,
          headers: response.headers
        })
      }
      throw `Non-200 response status code: ${response.statusCode}, ${response.statusMessage}`
    }
    response.setEncoding("utf8")
    response.on("data", chunk => {
      dataReceived += chunk
    })
    response.on("end", () => {
      successCallback(dataReceived)
    })
  }

  module.exports = { //the below instance methods should be static instead
    get: (requestOptions, params, successCallback, errorCallback) => {
      var callbacks = {
        successCallback: successCallback,
        errorCallback: errorCallback
      }

      if (params) {
        if (!requestOptions.path.includes("?")) {
          requestOptions.path += "?"
        }
        if (typeof params === "object") {
          params = querystring.stringify(params)
        }
        requestOptions.path += params
      }
      verbalize(`requestOptions.path: ${requestOptions.path}`)
      https
      .get(requestOptions, responseHandler.bind(callbacks))
      .on("error", requestErrorHandler.bind({
        errorCallback: errorCallback
      }))
    },
    put: (requestOptions, dataToSend, successCallback, errorCallback) => {
      var callbacks = {
        successCallback: successCallback,
        errorCallback: errorCallback
      }
      var request

      if (typeof dataToSend !== "string") {
        dataToSend = JSON.stringify(dataToSend)
      }
      if (!requestOptions.headers) {
        requestOptions.headers = {}
      }
      requestOptions.headers["Content-Length"] = dataToSend.length
      requestOptions.method = "PUT"
      request = https.request( requestOptions, responseHandler.bind(callbacks) )
      request.on("error", requestErrorHandler.bind({
        errorCallback: errorCallback
      }))
      request.write(dataToSend)
      request.end()
    }
  }
})()
