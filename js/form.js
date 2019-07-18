'use strict';

// модуль формы редактирования фотографии
(function () {
  var ScaleValue = {
    MIN: 25,
    MAX: 100,
    STEP: 25
  };

  var formElement = document.querySelector('#upload-select-image');

  var fileUploadElement = formElement.querySelector('#upload-file'); // поле загрузки фото
  var formContainerElement = formElement.querySelector('.img-upload__overlay');
  var formCloseElement = formElement.querySelector('#upload-cancel'); // закрытие формы редактирования

  var previewElement = formElement.querySelector('.img-upload__preview img');

  // управление размером
  var scaleSmallerElement = formElement.querySelector('.scale__control--smaller');
  var scaleBiggerElement = formElement.querySelector('.scale__control--bigger');
  var scaleInputElement = formElement.querySelector('.scale__control--value');

  // управление эффектами (фильтрами)
  var filterScaleElement = formElement.querySelector('.effect-level__line'); //шкала
  var filterPinElement = filterScaleElement.querySelector('.effect-level__pin'); //ползунок
  var filterDepthElement = filterScaleElement.querySelector('.effect-level__depth');
  var filterInputElement = formElement.querySelector('.effect-level__value'); // инпут

  var pinSize; // размер пина
  var currentFilter; // текущий выбранный фильтр

  // диапазон возможных положений пина
  var pinLocation = {
    min: 0,
    max: 0
  };

  // ф-ции, необходимые для закрытия формы редактирования
  /**
  * скрывает форму редактирования
  */
  var closeForm = function () {
    formContainerElement.classList.add('hidden');
    fileUploadElement.value = '';

    formElement.removeEventListener('click', onButtonSizeClick);
    formElement.removeEventListener('change', onFormFilterChange);
    filterPinElement.removeEventListener('mousedown', onPinMouseDown);
    formCloseElement.removeEventListener('click', onCloseButtonClick);
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


  //  ф-ции, необходимые для изменения размеров превью
  /**
  * увеличивает размер превью
  */
  var increaseSize = function () {
    var currentValue = parseInt(scaleInputElement.value, 10);
    currentValue += ScaleValue.STEP;

    scaleInputElement.value = (currentValue <= ScaleValue.MAX) ? (currentValue + '%') : (ScaleValue.MAX + '%');
    previewElement.style.transform = 'scale(' + (parseInt(scaleInputElement.value, 10) / 100) + ')';
  };

  /**
  * уменьшает размер превью
  */
  var decreaseSize = function () {
    var currentValue = parseInt(scaleInputElement.value, 10);
    currentValue -= ScaleValue.STEP;

    scaleInputElement.value = (currentValue >= ScaleValue.MIN) ? (currentValue + '%') : (ScaleValue.MIN + '%');
    previewElement.style.transform = 'scale(' + (parseInt(scaleInputElement.value, 10) / 100) + ')';
  };

  /**
  * изменяет размер превью в зависисти от кнопки
  * @param {Event} evt
  */
  var onButtonSizeClick = function (evt) {
    if (evt.target === scaleBiggerElement) {
      increaseSize();
    } else if (evt.target === scaleSmallerElement) {
      decreaseSize();
    }
  };


  // ф-ции, необходимые для реализации эффектов фильтров
  /** сравнивает полученную координату с заданным диапазоном (при передвижении пина)
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

  /**
  * составляет строку-значение для CSS-свойства filter
  * @param {Object} filter
  * @param {number} value
  * @return {string}
  */
  var composeFilterString = function (filter, value) {
    // рассчитаем величину эффекта в зависимости от min и max значений, допустимых для данного фильтра
    var calculatedValue = value * (filter.max - filter.min) + filter.min;
    // соберем строку с названием фильтра, его значением и единицами измерения
    var filterString = filter.style + '(' + calculatedValue + filter.unit + ')';

    return filterString;
  };

  /**
  * действия при "захвате" ползунка мышкой
  * @param {Event} evt
  */
  var onPinMouseDown = function (evt) {
    evt.preventDefault();

    // определяяем координату курсора в момент нажатия мышки
    var startCoord = evt.clientX;

    /**
    * действия при перемещении мышки
    * @param {Event} moveEvt
    */
    var onPinMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      // определяем сдвиг курсора относительно предыдущего
      var shift = moveEvt.clientX - startCoord;
      // переменная для хранения результатов вычисления координат
      var currentValue = checkCoord(filterPinElement.offsetLeft, shift, pinLocation.min, pinLocation.max);

      // перемещаем пин
      filterPinElement.style.left = currentValue + 'px';
      // изменяем размер окрашенной области шкалы
      filterDepthElement.style.width = currentValue + 'px';
      // изменяем значение глубины эффекта
      filterInputElement.value = (currentValue - pinLocation.min) / (pinLocation.max - pinLocation.min);
      // применяем эффект
      previewElement.style.filter = composeFilterString(filterStyleMap[currentFilter], filterInputElement.value);

      // записываем в стартовую координату текущую координату
      startCoord = moveEvt.clientX;
    };

    /**
    * действия при отпускании ползунка мышкой
    * @param {Event} upEvt
    */
    var onPinMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onPinMouseMove);
      document.removeEventListener('mouseup', onPinMouseUp);
    };

    document.addEventListener('mousemove', onPinMouseMove);
    document.addEventListener('mouseup', onPinMouseUp);
  };

  // ф-ции, необходимые для реализации переключения фильтров
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


  var onFormFilterChange = function (evt) {
    if (evt.target.name === 'effect') {

      // удаляем с превью класс начинающийся с 'effects__preview--'
      removeClass(previewElement, 'effects__preview--');

      // добавляем новый класс в зависимости от фильтра
      if (evt.target.value !== 'none') {
        previewElement.classList.add('effects__preview--' + evt.target.value);
        currentFilter = evt.target.value;
        filterPinElement.addEventListener('mousedown', onPinMouseDown);
      }

    }
  };

  // открытие формы редактирования при выборе файла
  fileUploadElement.addEventListener('change', function () {
    formContainerElement.classList.remove('hidden');
    // получим необходимые размеры пина и шкалы
    pinSize = filterPinElement.offsetWidth;
    pinLocation.min = pinSize / 2;
    pinLocation.max = filterScaleElement.offsetWidth - (pinSize / 2);

    // установим значения по умолчанию в соответствии с ТЗ
    scaleInputElement.value = '100%';

    // добавляем листенер изменения размеров превью
    formElement.addEventListener('click', onButtonSizeClick);
    // добавляем листенер переключения фильтров
    formElement.addEventListener('change', onFormFilterChange);



    // добавляем листенеры закрытия формы
    formCloseElement.addEventListener('click', onCloseButtonClick);
    document.addEventListener('keydown', onFormEscPress);
  });



})();
