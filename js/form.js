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

  // управление эффектами
  var effectLine = form.querySelector('.effect-level__line'); //шкала
  var effectPin = effectLine.querySelector('.effect-level__pin'); //ползунок
  var effectDepth = effectLine.querySelector('.effect-level__depth');
  var effectInput = form.querySelector('.effect-level__value'); // инпут
  var pinSize; // размер пина
  var currentFilter; // текущий выбранный фильтр
  var pinLocation = {
    min: 0,
    max: 0
  };


  /**
  * скрывает форму редактирования
  */
  var closeForm = function () {
    formContainer.classList.add('hidden');
    fileUploadField.value = '';

    form.removeEventListener('click', onFormClick);
    form.removeEventListener('change', onFormChange);
    effectPin.removeEventListener('mousedown', onPinMouseDown);
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
    if (evt.target === scaleBigger) {
      increaseSize();
    } else if (evt.target === scaleSmaller) {
      decreaseSize();
    }

  };


  // объект-мапа соотношений названий фильтров и соответствующих стилей
  var filterStyleMap = {
    'chrome': {
      min: 0,
      max: 1,
      unit: '',
      style: 'grayscale'
    },

    'sepia': {
      min: 0,
      max: 1,
      unit: '',
      style: 'sepia'
    },

    'marvin': {
      min: 0,
      max: 100,
      unit: '%',
      style: 'invert'
    },

    'phobos': {
      min: 0,
      max: 3,
      unit: 'px',
      style: 'blur'
    },

    'heat': {
      min: 1,
      max: 3,
      unit: '',
      style: 'brightness'
    }
  };


  /** сравнивает полученную координату с заданным диапазоном
  * @param {number} initialCoord
  * @param {number} shiftCoord
  * @param {number} minCoord
  * @param {number} maxCoord
  * @return {number}
  */
  var checkCoord = function (initialCoord, shiftCoord, minCoord, maxCoord) {
    var testCoord = initialCoord + shiftCoord;
    if (testCoord < minCoord) {
      testCoord = minCoord;
      return testCoord;
    }
    if (testCoord > maxCoord) {
      testCoord = maxCoord;
    }

    return testCoord;
  };

  var onPinMouseDown = function (evt) {
    evt.preventDefault();

    // определяяем координату курсора в момент нажатия мышки
    var startCoord = evt.clientX;

    var onPinMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      // определяем сдвиг курсора относительно предыдущего
      var shift = moveEvt.clientX - startCoord;

      // перемещаем пин
      var currentValue = checkCoord(effectPin.offsetLeft, shift, pinLocation.min, pinLocation.max);
      effectPin.style.left = currentValue + 'px';
      //  изменяем размер окрашенной области шкалы
      effectDepth.style.width = currentValue + 'px';
      // изменяем значение глубины эффекта
      effectInput.value = (currentValue - pinLocation.min) / (pinLocation.max - pinLocation.min) * 100;
      // применим эффект
      var filterValueString = filterStyleMap[currentFilter].style + '(' + ((effectInput.value / 100) * (filterStyleMap[currentFilter].max - filterStyleMap[currentFilter].min) + filterStyleMap[currentFilter].min) + filterStyleMap[currentFilter].unit + ')';
      preview.style.filter = filterValueString;
      console.log(filterValueString);


      // записываем в стартовую координату текущую координату
      startCoord = moveEvt.clientX;
    };

    var onPinMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onPinMouseMove);
      document.removeEventListener('mouseup', onPinMouseUp);
    };

    document.addEventListener('mousemove', onPinMouseMove);
    document.addEventListener('mouseup', onPinMouseUp);

  };

  var onFormChange = function (evt) {
    if (evt.target.name === 'effect') {

      // удаляем с превью класс начинающийся с 'effects__preview--'
      removeClass(preview, 'effects__preview--');

      // добавляем новый класс в зависимости от фильтра
      if (evt.target.value !== 'none') {
        preview.classList.add('effects__preview--' + evt.target.value);
        currentFilter = evt.target.value;
        effectPin.addEventListener('mousedown', onPinMouseDown);
      }

    }
  };

  // открытие формы редактирования при выборе файла
  fileUploadField.addEventListener('change', function () {
    formContainer.classList.remove('hidden');
    // получим необходимые размеры
    pinSize = effectPin.offsetWidth;
    pinLocation.min = pinSize / 2;
    pinLocation.max = effectLine.offsetWidth - (pinSize / 2);


    form.addEventListener('click', onFormClick);
    // переключение фильтра
    form.addEventListener('change', onFormChange);



    // закрытие формы
    formCloseButton.addEventListener('click', onCloseButtonClick);
    document.addEventListener('keydown', onFormEscPress);
  });



})();
