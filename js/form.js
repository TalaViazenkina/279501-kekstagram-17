'use strict';

// модуль формы редактирования фотографии
(function () {
  // диапазон значений размеров превью по ТЗ
  var ScaleValue = {
    MIN: 25,
    MAX: 100,
    STEP: 25
  };

  // диапазон длины хэш-тега по ТЗ
  var HashtagLength = {
    MIN: 2,
    MAX: 20
  };

  // маскимальное допустимое количество хэш-тегов по ТЗ
  var HASHTAG_MAX_COUNT = 5;

  var formContainerElement = window.data.form.querySelector('.img-upload__overlay');
  var formCloseElement = window.data.form.querySelector('#upload-cancel'); // закрытие формы редактирования

  var preview = window.data.preview;
  var photoInitial = preview.src; // превью поумолчанию

  // управление размером
  var scaleSmallerElement = window.data.form.querySelector('.scale__control--smaller');
  var scaleBiggerElement = window.data.form.querySelector('.scale__control--bigger');
  var scaleInputElement = window.data.form.querySelector('.scale__control--value');

  var pinSize; // размер пина
  var filterOriginalElement = window.data.form.querySelector('#effect-none'); // фильтр "без эффекта"

  var textareaElement = window.data.form.querySelector('.text__description'); // поле ввода комментария
  var hashtagInputElement = window.data.form.querySelector('.text__hashtags'); // поле ввода хэш-тегов


  //  ф-ции, необходимые для изменения размеров превью
  /**
  * увеличивает размер превью
  */
  var increaseSize = function () {
    var currentValue = parseInt(scaleInputElement.value, 10);
    currentValue += ScaleValue.STEP;

    scaleInputElement.value = (currentValue <= ScaleValue.MAX) ? (currentValue + '%') : (ScaleValue.MAX + '%');
    preview.style.transform = 'scale(' + (parseInt(scaleInputElement.value, 10) / 100) + ')';
  };

  /**
  * уменьшает размер превью
  */
  var decreaseSize = function () {
    var currentValue = parseInt(scaleInputElement.value, 10);
    currentValue -= ScaleValue.STEP;

    scaleInputElement.value = (currentValue >= ScaleValue.MIN) ? (currentValue + '%') : (ScaleValue.MIN + '%');
    preview.style.transform = 'scale(' + (parseInt(scaleInputElement.value, 10) / 100) + ')';
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


  /**
  * убирает у превью эффект фильтра
  */
  var clearEffect = function () {
    // удаляем с превью класс начинающийся с 'effects__preview--'
    window.utils.removeClass(preview, 'effects__preview--');
    // сбрасывает стили
    preview.style.filter = '';
  };


  // ф-ции необходимые для валидации хэш-тегов
  /**
  * проверяет наличие решетки в начале хэш-тега
  * @param {Array} arr
  * @return {boolean}
  */
  var checkHashtagStart = function (arr) {
    return arr.some(function (it) {
      return it[0] !== '#';
    });
  };

  /**
  * проверяет длину хэш-тега
  * @param {Array} arr
  * @return {boolean}
  */
  var checkHashtagLength = function (arr) {
    return arr.some(function (it) {
      return it.length < HashtagLength.MIN || it.length > HashtagLength.MAX;
    });
  };

  /**
  * проверяет разделители хэш-тегов
  * @param {Array} arr
  * @return {boolean}
  */
  var checkHashtagSeparator = function (arr) {
    return arr.some(function (it) {
      return it.lastIndexOf('#') > 0;
    });
  };

  /**
  * проверяет уникальность хэш-тегов
  * @param {Array} arr
  * @return {boolean}
  */
  var checkUniqueHashtag = function (arr) {
    // создадим вспомогательный объект
    var obj = {};
    // и все элементы массивы запишем в виде ключей этого объекта
    // ключи уникальны, поэтому если элементы повторяются, значение ключа будет переписано, но ключ повторяться не будет
    arr.forEach(function (it) {
      var key = it;
      obj[key] = true;
    });

    // сравним количество ключей и длину исходного массива
    return arr.length === Object.keys(obj).length;
  };

  /**
  * валидирует поле ввода хэш-тега
  */
  var onHashtagInputChange = function () {
    // преобразуем строку с хэштегами в массив
    // и удалим пустые элементы (последствия двойных пробелов и пробела в конце строки)
    var hashtags = hashtagInputElement.value.toLowerCase().split(' ').filter(function (it) {
      return it.length > 0;
    });
    // зададим начальное значение сообщению об ошибке
    var validityMessage = '';

    if (checkHashtagStart(hashtags)) {
      validityMessage += 'Хэш-тег должен начинаться со знака #. ';
    }

    if (checkHashtagLength(hashtags)) {
      validityMessage += 'Длина хэш-тег (не включая #) должна быть не менее 1 символа и не более 19. ';
    }

    if (checkHashtagSeparator(hashtags)) {
      validityMessage += 'Хэш-теги должны быть разделены пробелом (знак \'#\' означает начало нового хэш-тега). ';
    }

    if (hashtags.length > HASHTAG_MAX_COUNT) {
      validityMessage += 'Максимальное допустимое число хэш-тегов равно 5. ';
    }

    if (!checkUniqueHashtag(hashtags)) {
      validityMessage += 'Хэш-теги не должны повторяться. ';
    }

    hashtagInputElement.setCustomValidity(validityMessage);
    hashtagInputElement.style.boxShadow = (validityMessage.length > 0) ? '0 0 0 3px red' : 'none';
  };

  // ф-ции, необходимые для закрытия формы редактирования
  /**
  * меняет превью на превью по умолчанию
  */
  var clearPhoto = function () {
    window.data.preview.src = photoInitial;
  };


  /**
  * скрывает форму редактирования
  */
  var closeForm = function () {
    window.utils.hideNode(formContainerElement);
    // "сбрасываем" форму
    window.data.form.reset();
    window.data.photoLoader.value = '';
    // у превью удаляем класс с именем эффекта и обнуляем эффекты
    clearEffect();
    // возвращаем исходное превью
    clearPhoto();

    // удаляем листенеры
    window.data.form.removeEventListener('click', onButtonSizeClick);
    window.data.form.removeEventListener('change', window.effect.onChange);
    window.data.form.removeEventListener('submit', onFormSubmit);
    hashtagInputElement.removeEventListener('change', onHashtagInputChange);
    formCloseElement.removeEventListener('click', onCloseButtonClick);
    document.removeEventListener('keydown', onFormEscPress);
    if (window.effect.isScale) {
      window.effect.pin.removeEventListener('mousedown', window.effect.onPinMouseDown);
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
    if (window.utils.isEscEvent(evt) &&
      textareaElement !== document.activeElement &&
      hashtagInputElement !== document.activeElement) {
      closeForm();
    }
  };


  /**
  * отправляет форму
  * @param {Event} evt
  */
  var onFormSubmit = function (evt) {
    evt.preventDefault();
    // запускаем отправку данных на сервер только в том случае,
    // если в данный момент никакая другая отправка не выполняется
    if (!window.backend.isSaving) {
      window.backend.isSaving = true;
      var formData = new FormData(window.data.form);
      window.backend.save(formData, window.success, window.error.onSaving);
    }
  };

  /**
  * описывает действия при выборе файла
  */
  var onPhotoLoaderChange = function () {
    // показываем форму редактирования
    window.utils.showNode(formContainerElement);
    // и шкалу, чтобы снять с неё размеры
    window.utils.showNode(window.effect.scaleBlock);
    // получим необходимые размеры пина и шкалы
    pinSize = window.effect.pin.offsetWidth;
    window.data.pinLocation.min = pinSize / 2;
    window.data.pinLocation.max = window.effect.scale.offsetWidth - (pinSize / 2);

    // установим значения по умолчанию в соответствии с ТЗ
    scaleInputElement.value = '100%';

    // переключаем фильтр на Оригинал и скрываем шкалу
    filterOriginalElement.checked = true;
    window.utils.hideNode(window.effect.scaleBlock);
    window.effect.isScale = false; // меняем флаг

    // добавляем листенер изменения размеров превью
    window.data.form.addEventListener('click', onButtonSizeClick);
    // добавляем листенер переключения фильтров
    window.data.form.addEventListener('change', window.effect.onChange);

    // добавляем листенер ввода хэш-тегов
    hashtagInputElement.addEventListener('change', onHashtagInputChange);

    // добавляем листенер отправки
    window.data.form.addEventListener('submit', onFormSubmit);

    // добавляем листенеры закрытия формы
    formCloseElement.addEventListener('click', onCloseButtonClick);
    document.addEventListener('keydown', onFormEscPress);
  };

  // открытие формы редактирования при выборе файла
  window.data.photoLoader.addEventListener('change', onPhotoLoaderChange);

  window.form = {
    close: closeForm,
    open: onPhotoLoaderChange,
    onEscPress: onFormEscPress
  };

})();
