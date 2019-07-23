'use strict';

// модуль сообщений оошибке загрузки/отправки данных
(function () {
  // шаблон сообщения об ошибке
  var errorTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');

  var errorNode;
  var errorButtonElement;
  var errorButtonRepeatElement;
  var errorButtonChoiceElement;


  /**
  * закрывает сообщение об ошибке отправки формы
  */
  var closeSavingError = function () {
    // удаляем попап из разметки
    window.data.main.removeChild(errorNode);
    // возвращаем листенер формы
    document.addEventListener('keydown', window.form.onEscPress);

    // удаляем листенеры
    errorButtonRepeatElement.removeEventListener('click', onButtonRepeatClick);
    errorButtonChoiceElement.removeEventListener('click', onButtonChoiceClick);
    document.removeEventListener('keydown', onPopupEscPress);
    document.removeEventListener('click', onPopupClick);
  };

  /**
  * закрывает сообщение об ошибке загрузки данных
  */
  var closeLoadingError = function () {
    // удаляем попап из разметки
    window.data.main.removeChild(errorNode);

    // удаляем листенеры
    errorButtonElement.removeEventListener('click', onButtonClick);
    document.removeEventListener('keydown', onPopupEscPress);
    document.removeEventListener('click', onPopupClick);
  };

  /**
  * закрывает ошибку загрузки по клику на кнопку
  * @param {Event} evt
  */
  var onButtonClick = function (evt) {
    evt.preventDefault();
    closeLoadingError();
    // запускаем повторную загрузку
    window.backend.load(window.gallery.onSuccessLoad, onLoadingError);
  };

  /**
  * закрывает ошибку отправки по клику на кнопку "Попробовать снова"
  * @param {Event} evt
  */
  var onButtonRepeatClick = function (evt) {
    evt.preventDefault();
    closeSavingError();
  };

  /**
  * закрывает ошибку отправки по клику на кнопку "Выбрать другой файл"
  * @param {Event} evt
  */
  var onButtonChoiceClick = function (evt) {
    evt.preventDefault();
    closeSavingError();
    window.form.fileLoader.click();
  };

  /**
  * закрывает попап по esc
  * @param {Event} evt
  */
  var onPopupEscPress = function (evt) {
    if (window.utils.isEscEvent(evt)) {
      evt.preventDefault();
      var closePopup = (errorButtonElement) ? closeLoadingError : closeSavingError;
      closePopup();
    }
  };

  /**
  * закрывает попап по клику на произвольную область
  * @param {event} evt
  */
  var onPopupClick = function (evt) {
    evt.preventDefault();
    var closePopup = (errorButtonElement) ? closeLoadingError : closeSavingError;
    closePopup();
  };


  /**
  * отрисовывает сообщение об ошибке отправки
  * @param {string} message
  */
  var renderError = function (message) {
    errorNode = errorTemplate.cloneNode(true); // клонируем шаблон
    // добавляем стили
    errorNode.style.zIndex = '3';

    // добавим абзац с расшифровкой ошибки
    var errorTextElement = document.createElement('p');
    errorNode.querySelector('.error__inner').insertBefore(errorTextElement, errorNode.querySelector('.error__buttons'));
    errorTextElement.textContent = message;
    errorTextElement.style.marginTop = '0';
    errorTextElement.style.marginBottom = '2em';

    // добавляем в разметку
    window.data.main.insertAdjacentElement('afterbegin', errorNode);
  };

  /**
  * описывает действия при ошибке отправки формы
  * @param {string} message
  */
  var onSavingError = function (message) {
    renderError(message);

    errorButtonChoiceElement = errorNode.querySelector('.error__button--choice');
    errorButtonRepeatElement = errorNode.querySelector('.error__button--repeat');

    // добавляем листенеры закрытия
    document.addEventListener('click', onPopupClick);
    document.addEventListener('keydown', onPopupEscPress);
    errorButtonRepeatElement.addEventListener('click', onButtonRepeatClick);
    errorButtonChoiceElement.addEventListener('click', onButtonChoiceClick);

    // убираем листенер закрытия формы
    document.removeEventListener('keydown', window.form.onEscPress);
  };


  /**
  * отрисовывает сообщение об ошибке загрузки
  * @param {string} message
  */
  var renderLoadingError = function (message) {
    // отрисуем сообщение
    renderError(message);

    // исправим текст
    errorNode.querySelector('.error__title').textContent = 'Ошибка загрузки данных';

    // уберем лишнюю кнопку
    window.utils.hideNode(errorNode.querySelector('.error__button--choice'));
  };

  /**
  * описывает действия при ошибке загрузки данных
  * @param {string} message
  */
  var onLoadingError = function (message) {
    renderLoadingError(message);

    errorButtonElement = errorNode.querySelector('.error__button--repeat');
    // добавляем листенеры закрытия
    document.addEventListener('click', onPopupClick);
    document.addEventListener('keydown', onPopupEscPress);
    errorButtonElement.addEventListener('click', onButtonClick);
  };

  window.error = {
    onSaving: onSavingError,
    onLoading: onLoadingError
  };
})();
