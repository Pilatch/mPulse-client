module.exports = function () {
  "use strict"
  if (global.VERBALIZE) {
    let argumentsArray = Array.prototype.slice.call(arguments)

    console.error.apply(console, argumentsArray)
  }
}
