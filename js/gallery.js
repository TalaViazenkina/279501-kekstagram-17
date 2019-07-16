'use strict';

// модуль работы с галлереей
(function () {
  var data = []; // массив данных, полученных с сервера

  var onSuccessLoad = function (response) {
    data = response;
    console.log(data);
  };

  var onErrorLoad = function (message) {
    console.log(message);
  };

  window.backend.load(onSuccessLoad, onErrorLoad);

})();
