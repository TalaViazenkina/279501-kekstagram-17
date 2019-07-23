'use strict';

// модуль с исхожными данными
(function () {
  var formElement = document.querySelector('#upload-select-image');
  var mainElement = document.querySelector('main');
  window.data = {
    form: formElement,
    main: mainElement
  };
})();

