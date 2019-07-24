'use strict';

// модуль с исходными данными
(function () {
  var formElement = document.querySelector('#upload-select-image');
  var mainElement = document.querySelector('main');
  var photoLoaderElement = formElement.querySelector('#upload-file'); // поле загрузки фото
  var previewElement = formElement.querySelector('.img-upload__preview img');

  // диапазон возможных положений ползунка на шкале эффектов
  var pinLocation = {
    min: 0,
    max: 0
  };
  window.data = {
    COEFFICIENT: 100, // для перевода долей в проценты
    form: formElement,
    main: mainElement,
    photoLoader: photoLoaderElement,
    preview: previewElement,
    pinLocation: pinLocation
  };
})();

