var capitalize = require("capitalize")
var pageTypeAliases = {
  address: "billing",
  bag: "cart",
  confirm: "review",
  receipt: "thanks",
  shipmethods: "shipping",
  shoppingcart: "cart"
}

module.exports = (storeCode, shortPageType) => {
  var capitalizedPageName

  if (shortPageType) {
    storeCode = storeCode.toUpperCase()
    shortPageType = shortPageType.toLowerCase()
    if (pageTypeAliases[shortPageType]) {
      shortPageType = pageTypeAliases[shortPageType]
    }
    capitalizedPageName = capitalize(shortPageType.toLowerCase())
    return `${storeCode} ${capitalizedPageName} Page`
  }
}
