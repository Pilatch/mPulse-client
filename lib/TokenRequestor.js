;(function () {
  "use strict"
  var requestor = require("./HttpsUtf8Requestor")

  function getBaseRequestOptions() {
    return {
      headers: {
        "Content-Type": "application/json"
      },
      host: "mpulse.soasta.com",
      path: "/concerto/services/rest/RepositoryService/v1/Tokens"
    }
  }

  module.exports = function TokenRequestor(credentials) {
    var dataToSend = {
      userName: credentials.userName,
      password: credentials.password
    }
    var requestOptions = getBaseRequestOptions()

    this.requestToken = (successCallback, errorCallback) => {
      requestor.put(requestOptions, dataToSend, successCallback, errorCallback)
      // requestOptions.headers["Content-Length"] = dataToSend.length //this should be in the requestToken function
      // var callbacks = {
      //   successCallback: successCallback,
      //   errorCallback: errorCallback
      // }
      // var request = https.request( requestOptions, responseHandler.bind(callbacks) )

      // request.on("error", requestErrorHandler.bind({
      //   errorCallback: errorCallback
      // }))
      // request.write(dataToSend)
      // request.end()
    }
  }
})()
