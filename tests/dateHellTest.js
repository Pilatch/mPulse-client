/*eslint-env mocha*/
;(function () {
  "use strict"
  var expect = require("chai").expect
  var dateHell = require("../lib/dateHell")

  describe("Date Hell's time travel function", () => {
    it("should navigate you relative to today if no fromDate is specified", () => {
      var dateTimeTraveledTo = dateHell.timeTravel(-1)
      var manuallyCreatedDate = new Date()

      manuallyCreatedDate.setDate(manuallyCreatedDate.getDate() - 1)
      console.info(manuallyCreatedDate)
      expect( dateTimeTraveledTo instanceof Date ).to.be.true
      expect( dateTimeTraveledTo.getDate() ).to.equal( manuallyCreatedDate.getDate() )
    })
  })
})()
