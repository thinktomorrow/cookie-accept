"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var ConsentCheckboxes = exports["default"] = {
  updateCheckboxesByCookieValue: function updateCheckboxesByCookieValue(checkboxes, cookieValue) {
    for (var i = 0; i < checkboxes.length; i++) {
      if (Object.prototype.hasOwnProperty.call(cookieValue, checkboxes[i].name)) {
        checkboxes[i].checked = cookieValue[checkboxes[i].name];
      }
    }
    return checkboxes;
  },
  toCookieValues: function toCookieValues(checkboxes) {
    var object = {};
    for (var i = 0; i < checkboxes.length; i++) {
      object[checkboxes[i].name] = checkboxes[i].checked;
    }
    return object;
  },
  toCookieValuesForcedToTrue: function toCookieValuesForcedToTrue(checkboxes) {
    var object = {};
    for (var i = 0; i < checkboxes.length; i++) {
      object[checkboxes[i].name] = true;
    }
    return object;
  },
  toCookieValuesForcedToFalse: function toCookieValuesForcedToFalse(checkboxes) {
    var requiredConsentNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var object = {};
    for (var i = 0; i < checkboxes.length; i++) {
      // We assume that the required / functional consent is disabled in the consent banner
      // And that all the other consent checkboxes are never disabled. This way we can
      // retrieve all rejectable cookie values by checking the disabled attribute
      object[checkboxes[i].name] = !!requiredConsentNames.includes(checkboxes[i].name);
    }
    return object;
  }
};