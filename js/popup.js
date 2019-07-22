'use strict';

// модуль сообщений о загрузке/отправке данных
(function () {
  var onSuccess = function () {
    console.log('Файл загружен');
  };

  var onError = function () {
    console.log('Файл не загружен');
  };

  window.popup = {
    onSuccess: onSuccess,
    onError: onError
  };
})();
