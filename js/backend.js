'use strict';

// модуль для обмена данными с сервером
(function () {
  var URL_LOAD = 'https://js.dump.academy/kekstagram/data';
  var URL_SAVE = 'https://js.dump.academy/kekstagram';
  var TIMEOUT = 10000; // 10s
  var STATUS_OK = 200; // Код ответа сервера 200
  window.backend = {
    isSaving: false, // флаг текущей отправки
    load: function (onSuccess, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.timeout = TIMEOUT;

      xhr.addEventListener('load', function () {
        if (xhr.status === STATUS_OK) {
          onSuccess(xhr.response);
        } else {
          onError('Ошибка загрузки данных. Статус ответа сервера: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
      });

      xhr.open('GET', URL_LOAD);
      xhr.send();
    },

    save: function (data, onSuccess, onError) {

      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === STATUS_OK) {
          onSuccess(xhr.response);
        } else {
          onError('Статус ответа сервера: ' + xhr.status + ' ' + xhr.statusText);
        }
        window.backend.isSaving = false; // меняем флаг
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
        window.backend.isSaving = false; // меняем флаг
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
        window.backend.isSaving = false; // меняем флаг
      });

      xhr.timeout = TIMEOUT;

      xhr.open('POST', URL_SAVE);
      xhr.send(data);
    }


  };
})();
