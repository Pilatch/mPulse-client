;(function () {
  "use strict"
  var requestor = require("./HttpsUtf8Requestor")
  var verbalize = require("./verbalize")

  function getBaseOptions() {
    return {
      headers: {},
      host: "mpulse.soasta.com",
      path: "/concerto/mpulse/api/v2/"
    }
  }
  module.exports = function ApiRequestor(securityToken) {
    this.requestData = (apiKey, queryType, params, successCallback, errorCallback) => {
      var requestOptions = getBaseOptions()

      if (typeof params === "object") {
        params.format = "json"
      }
      requestOptions.headers.Authentication = securityToken
      requestOptions.path += `${apiKey}/${queryType}`
      verbalize("requestOptions.path: ", requestOptions.path)
      requestor.get(requestOptions, params, successCallback, errorCallback)
    }
  }
})()
