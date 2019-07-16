'use strict';

// модуль формы редактирования фотографии
(function () {
  var form = document.querySelector('#upload-select-image');

  var fileUploadField = form.querySelector('#upload-file'); // поле загрузки фото
  var formContainer = form.querySelector('.img-upload__overlay');
  var formCloseButton = form.querySelector('#upload-cancel'); // закрытие формы редактирования


  /**
  * скрывает форму редактирования
  */
  var closeForm = function () {
    formContainer.classList.add('hidden');
    fileUploadField.value = '';

    formCloseButton.removeEventListener('click', onCloseButtonClick);
    document.removeEventListener('keydown', onFormEscPress);
  };

  /**
  * закрывает форму по клику на "крестик"
  */
  var onCloseButtonClick = function () {
    closeForm();
  };

  /**
  * закрывает форму по esc
  * @param {Event} evt
  */
  var onFormEscPress = function (evt) {
    if (window.utils.isEscEvent(evt)) {
      closeForm();
    }
  };


  fileUploadField.addEventListener('change', function () {
    formContainer.classList.remove('hidden');

    formCloseButton.addEventListener('click', onCloseButtonClick);
    document.addEventListener('keydown', onFormEscPress);
  });

})();
