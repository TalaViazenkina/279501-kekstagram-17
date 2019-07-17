'use strict';

// модуль формы редактирования фотографии
(function () {
  var ScaleValue = {
    MIN: 25,
    MAX: 100,
    STEP: 25
  };

  var form = document.querySelector('#upload-select-image');

  var fileUploadField = form.querySelector('#upload-file'); // поле загрузки фото
  var formContainer = form.querySelector('.img-upload__overlay');
  var formCloseButton = form.querySelector('#upload-cancel'); // закрытие формы редактирования

  var preview = form.querySelector('.img-upload__preview img');

  // управление размером
  var scaleSmaller = form.querySelector('.scale__control--smaller');
  var scaleBigger = form.querySelector('.scale__control--bigger');
  var scaleInput = form.querySelector('.scale__control--value');

  /**
  * скрывает форму редактирования
  */
  var closeForm = function () {
    formContainer.classList.add('hidden');
    fileUploadField.value = '';

    form.removeEventListener('click', onFormClick);
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

  /**
  * удаляет с элемента класс, начинающийся с искомой строки
  * @param {Element} el
  * @param {String} unit
  */
  var removeClass = function (el, unit) {
    if (el.classList.length !== 0) {
      var initialClasses = Array.prototype.slice.call(el.classList);
      initialClasses.forEach(function (it) {
        if (it.indexOf(unit) === 0) {
          el.classList.remove(it);
        }
      });
    }
  };

  /**
  * увеличивает размер превью
  */
  var increaseSize = function () {
    var currentValue = parseInt(scaleInput.value, 10);
    currentValue += ScaleValue.STEP;

    scaleInput.value = (currentValue <= ScaleValue.MAX) ? (currentValue + '%') : (ScaleValue.MAX + '%');
    preview.style.transform = 'scale(' + (parseInt(scaleInput.value, 10) / 100) + ')';
  };

    /**
  * уменьшает размер превью
  */
  var decreaseSize = function () {
    var currentValue = parseInt(scaleInput.value, 10);
    currentValue -= ScaleValue.STEP;

    scaleInput.value = (currentValue >= ScaleValue.MIN) ? (currentValue + '%') : (ScaleValue.MIN + '%');
    preview.style.transform = 'scale(' + (parseInt(scaleInput.value, 10) / 100) + ')';
  };

  var onFormClick = function (evt) {
    if (evt.target.name === 'effect') {
      // удаляем с превью класс начинающийся с 'effects__preview--'
      removeClass(preview, 'effects__preview--');

      // добавляем новый класс в зависимости от фильтра
      if (evt.target.value !== 'none') {
        preview.classList.add('effects__preview--' + evt.target.value);
      }
    } else if (evt.target === scaleBigger) {
      increaseSize();
    } else if (evt.target === scaleSmaller) {
      decreaseSize();
    }

  };


  // открытие формы редактирования при выборе файла
  fileUploadField.addEventListener('change', function () {
    formContainer.classList.remove('hidden');

    // переключение фильтра
    form.addEventListener('click', onFormClick);

    // закрытие формы
    formCloseButton.addEventListener('click', onCloseButtonClick);
    document.addEventListener('keydown', onFormEscPress);
  });



})();
