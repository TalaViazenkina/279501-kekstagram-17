'use strict';

// модуль для устранения "эффекта дребезга" в отрисовке галерии при частой смене фильтра
(function () {
  var DEBOUNCE_INTERVAL = 500; // 0,5s
  var lastTimeout;

  window.debounce = function (cb) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(cb, DEBOUNCE_INTERVAL);
  };

})();
