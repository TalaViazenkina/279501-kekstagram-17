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
  var scaleBlockElement = formElement.querySelector('.img-upload__effect-level'); // весь блок со шкалой и ползунком
  var filterScaleElement = scaleBlockElement.querySelector('.effect-level__line'); // шкала
  var filterPinElement = filterScaleElement.querySelector('.effect-level__pin'); // ползунок
  var filterDepthElement = filterScaleElement.querySelector('.effect-level__depth');
  var filterInputElement = scaleBlockElement.querySelector('.effect-level__value'); // инпут
  var filterOriginalElement = formElement.querySelector('#effect-none'); // фильтр "без эффекта"
  var filterValueInitial = 100; // стартовое значение фильтра
  var coefficient = 100; // для перевода долей в проценты
  var isScaleVisible; // флаг отображения шкалы эффекта

  var pinSize; // размер пина
  var currentFilter; // текущий выбранный фильтр

  // диапазон возможных положений пина
  var pinLocation = {
    min: 0,
    max: 0
  };

  var textareaElement = formElement.querySelector('.text__description'); // поле ввода комментария

  // ф-ции, необходимые для закрытия формы редактирования
  /**
  * скрывает форму редактирования
  */
  var closeForm = function () {
    window.utils.hideNode(formContainerElement);
    fileUploadElement.value = '';

    formElement.removeEventListener('click', onButtonSizeClick);
    formElement.removeEventListener('change', onFormFilterChange);
    formCloseElement.removeEventListener('click', onCloseButtonClick);
    document.removeEventListener('keydown', onFormEscPress);
    if (isScaleVisible) {
      filterPinElement.removeEventListener('mousedown', onPinMouseDown);
    }
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
    if (window.utils.isEscEvent(evt) && textareaElement !== document.activeElement) {
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

  /**
  * перемещает ползунок и  изменяет окрашенную область шкалы на заданную величину
  * @param {number} value
  */
  var movePin = function (value) {
    filterPinElement.style.left = value + 'px';
    filterDepthElement.style.width = value + 'px';
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
    var calculatedValue = value / coefficient * (filter.max - filter.min) + filter.min;
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

      // перемещаем ползунок
      movePin(currentValue);
      // изменяем значение глубины эффекта
      filterInputElement.value = (currentValue - pinLocation.min) / (pinLocation.max - pinLocation.min) * coefficient;
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

      if (evt.target.value !== 'none') {
        // добавляем шкалу, если она была скрыта и обработчик перемещения ползунка
        if (!isScaleVisible) {
          window.utils.showNode(scaleBlockElement);
          isScaleVisible = true; // меняем флаг
          filterPinElement.addEventListener('mousedown', onPinMouseDown);
        }
        // выставляем ползунок на максимум
        movePin(pinLocation.max);

        // сбрасываем значение глубины фильтра
        filterInputElement.value = filterValueInitial;

        // обновляем значение текущего фильтра
        currentFilter = evt.target.value;
        // добавляем новый класс в зависимости от фильтра
        previewElement.classList.add('effects__preview--' + currentFilter);
        // обновляем стили
        previewElement.style.filter = composeFilterString(filterStyleMap[currentFilter], filterInputElement.value);

      } else {
        // скрываем шкалу и удаляем обработчик
        if (isScaleVisible) {
          window.utils.hideNode(scaleBlockElement);
          isScaleVisible = false; // меняем флаг
          filterPinElement.removeEventListener('mousedown', onPinMouseDown);
        }
        // обнуляем стили
        previewElement.style.filter = '';
      }

    }
  };

  // открытие формы редактирования при выборе файла
  fileUploadElement.addEventListener('change', function () {
    // показываем форму редактирования
    window.utils.showNode(formContainerElement);
    // получим необходимые размеры пина и шкалы
    pinSize = filterPinElement.offsetWidth;
    pinLocation.min = pinSize / 2;
    pinLocation.max = filterScaleElement.offsetWidth - (pinSize / 2);

    // установим значения по умолчанию в соответствии с ТЗ
    scaleInputElement.value = '100%';

    // переключаем фильтр на Оригинал и скрываем шкалу
    filterOriginalElement.checked = true;
    window.utils.hideNode(scaleBlockElement);
    isScaleVisible = false; // меняем флаг

    // добавляем листенер изменения размеров превью
    formElement.addEventListener('click', onButtonSizeClick);
    // добавляем листенер переключения фильтров
    formElement.addEventListener('change', onFormFilterChange);



    // добавляем листенеры закрытия формы
    formCloseElement.addEventListener('click', onCloseButtonClick);
    document.addEventListener('keydown', onFormEscPress);
  });



})();
