var fs = require("fs")
var configuration = require("../configuration")
var credentials = require(configuration.credentialsFilePath)
var verbalize = require("./verbalize")
var TokenRequestor = require("./TokenRequestor")

module.exports = callback => {
  "use strict"
  var mpulseSecurityToken

  if ( fs.existsSync(configuration.tokenFilePath) ) {
    let tokenFileStats = fs.statSync(configuration.tokenFilePath)
    let now = new Date().getTime()
    let tokenModifiedTime = tokenFileStats.mtime.getTime()

    verbalize("token file exists")
    if (now - tokenModifiedTime < configuration.tokenTimeToLive) {
      verbalize("token is alive")
      mpulseSecurityToken = fs.readFileSync(configuration.tokenFilePath, "utf8")
    }
  }
  if (mpulseSecurityToken) {
    callback(mpulseSecurityToken)
  } else {
    new TokenRequestor(credentials).requestToken(dataReceived => {
      verbalize(`dataReceived: ${dataReceived}`)
      mpulseSecurityToken = JSON.parse(dataReceived).token
      verbalize(`token ${mpulseSecurityToken} received`)
      fs.writeFile(configuration.tokenFilePath, mpulseSecurityToken, "utf8", () => {
        callback(mpulseSecurityToken)
      })
    })
  }
}
