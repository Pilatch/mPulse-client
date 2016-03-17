;(function () {
  "use strict"
  var path = require("path")

  module.exports = () => {
    var configurationRequirePath = "../configuration"
    var configuration = require(configurationRequirePath)
    var configurationFileDirectory = path.resolve( __dirname, path.dirname(configurationRequirePath) )
    var apiKeysRequirePath = path.resolve(configurationFileDirectory, configuration.apiKeysFilePath)

    try {
      return require(apiKeysRequirePath)
    } catch (problem) {
      throw `Could not find API Keys file at "${configuration.apiKeysFilePath}"
Specify this value in configuration.json, with the "apiKeysFilePath" key.`
    }
  }
})()
