'use strict';


// модуль применения эффетов в форме редактирования
(function () {
  var preview = window.data.preview;
  // управление эффектами (фильтрами)
  var scaleBlockElement = window.data.form.querySelector('.img-upload__effect-level'); // весь блок со шкалой и ползунком
  var filterScaleElement = scaleBlockElement.querySelector('.effect-level__line'); // шкала
  var filterPinElement = filterScaleElement.querySelector('.effect-level__pin'); // ползунок
  var filterDepthElement = filterScaleElement.querySelector('.effect-level__depth');
  var filterInputElement = scaleBlockElement.querySelector('.effect-level__value'); // инпут

  var filterValueInitial = 100; // стартовое значение фильтра

  var isScaleVisible; // флаг отображения шкалы эффекта

  var currentFilter; // текущий выбранный фильтр

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
    var calculatedValue = value / window.data.COEFFICIENT * (filter.max - filter.min) + filter.min;
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
      var currentValue = checkCoord(filterPinElement.offsetLeft, shift, window.data.pinLocation.min, window.data.pinLocation.max);

      // перемещаем ползунок
      movePin(currentValue);
      // изменяем значение глубины эффекта
      filterInputElement.value = Math.round((currentValue - window.data.pinLocation.min) / (window.data.pinLocation.max - window.data.pinLocation.min) * window.data.COEFFICIENT);
      // применяем эффект
      preview.style.filter = composeFilterString(filterStyleMap[currentFilter], filterInputElement.value);

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

  /**
  * действия при переключении фильтров
  * @param {Event} evt
  */
  var onFormFilterChange = function (evt) {
    if (evt.target.name === 'effect') {

      // удаляем с превью класс начинающийся с 'effects__preview--'
      window.utils.removeClass(preview, 'effects__preview--');

      if (evt.target.id !== 'effect-none') {
        // добавляем шкалу, если она была скрыта и обработчик перемещения ползунка
        if (!window.effect.isScale) {
          window.utils.showNode(scaleBlockElement);
          window.effect.isScale = true; // меняем флаг
          filterPinElement.addEventListener('mousedown', onPinMouseDown);
        }
        // выставляем ползунок на максимум
        movePin(window.data.pinLocation.max);

        // сбрасываем значение глубины фильтра
        filterInputElement.value = filterValueInitial;

        // обновляем значение текущего фильтра
        currentFilter = evt.target.value;
        // добавляем новый класс в зависимости от фильтра
        preview.classList.add('effects__preview--' + currentFilter);
        // обновляем стили
        preview.style.filter = composeFilterString(filterStyleMap[currentFilter], filterInputElement.value);

      } else {
        // скрываем шкалу и удаляем обработчик
        if (window.effect.isScale) {
          window.utils.hideNode(scaleBlockElement);
          window.effect.isScale = false; // меняем флаг
          filterPinElement.removeEventListener('mousedown', onPinMouseDown);
        }
        // обнуляем стили
        preview.style.filter = '';
      }

    }
  };


  window.effect = {
    isScale: isScaleVisible,
    scale: filterScaleElement,
    scaleBlock: scaleBlockElement,
    pin: filterPinElement,
    onChange: onFormFilterChange,
    onPinMouseDown: onPinMouseDown
  };

})();
