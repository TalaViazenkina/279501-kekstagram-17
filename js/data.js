'use strict';

// модуль с исходными данными
(function () {
  var formElement = document.querySelector('#upload-select-image');
  var mainElement = document.querySelector('main');
  var photoLoaderElement = formElement.querySelector('#upload-file'); // поле загрузки фото
  var previewElement = formElement.querySelector('.img-upload__preview img');
  window.data = {
    form: formElement,
    main: mainElement,
    photoLoader: photoLoaderElement,
    preview: previewElement
  };
})();

