'use strict';

// модуль сообщений о загрузке/отправке данных
(function () {
  var mainElement = document.querySelector('main');
  var successTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');

  var successNode;
  var successButtonElement;

  var errorTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');

  var errorNode;
  var errorButtonRepeatElement;
  var errorButtonChoiceElement;

  var isSuccess; // флаг успешного сообщения


  /**
  * закрывает попап
  */
  var closePopup = function () {
    // удляем обработчики
    document.removeEventListener('keydown', onPopupEscPress);
    document.removeEventListener('click', onPopupClick);
    if (isSuccess) {
      // удаляем попап из разметки
      mainElement.removeChild(successNode);
      // удляем обработчик с кнопки
      successButtonElement.removeEventListener('click', onButtonClick);
      return;
    } else {
      // удаляем попап из разметки
      mainElement.removeChild(errorNode);
      // возвращаем листенер формы
      document.addEventListener('keydown', window.form.onEscPress);
      // удаляем листенеры кнопок
      errorButtonRepeatElement.removeEventListener('click', onButtonClick);
      errorButtonChoiceElement.removeEventListener('click', onButtonChoiceClick);
    }

      return;


  };

  /**
  * закрывает попап по клику на кнопку
  * @param {Event} evt
  */
  var onButtonClick = function (evt) {
    evt.preventDefault();
    closePopup();
  };

  /**
  * закрывает попап по клику на кнопку error__button--choice
  * @param {Event} evt
  */
  var onButtonChoiceClick = function (evt) {
    evt.preventDefault();
    closePopup();
    window.form.fileLoader.click();
  };

  /**
  * закрывает попап по esc
  * @param {Event} evt
  */
  var onPopupEscPress = function (evt) {
    if (window.utils.isEscEvent(evt)) {
      evt.preventDefault();
      closePopup();
    }
  };

  /**
  * закрывает попап по клику на произвольную область
  * @param {event} evt
  */
  var onPopupClick = function (evt) {
    evt.preventDefault();
    closePopup();
  };


  /**
  * выводит сообщение об успешной отправке
  */
  var renderSuccess = function () {
    successNode = successTemplate.cloneNode(true); // клонируем шаблон

    successButtonElement = successNode.querySelector('.success__button');

    // добавляем обработчики закрытия
    successButtonElement.addEventListener('click', onButtonClick);
    document.addEventListener('click', onPopupClick);
    document.addEventListener('keydown', onPopupEscPress);

    // добавляем в разметку
    mainElement.insertAdjacentElement('afterbegin', successNode);
  };


  /**
  * описывает действия при успешной отправке
  */
  var onSuccess = function () {
    isSuccess = true; // меняем флаг
    window.form.close();
    renderSuccess();
  };

  /**
  * выводит сообщение об ошибке отправки
  * @param {string} message
  */
  var renderError = function (message) {
    errorNode = errorTemplate.cloneNode(true); // клонируем шаблон
    // добавляем стили
    errorNode.style.zIndex = '3';

    // добавим абзац с расшифровкой текста ошибки
    var errorTextElement = document.createElement('p');
    errorNode.querySelector('.error__inner').insertBefore(errorTextElement, errorNode.querySelector('.error__buttons'));
    errorTextElement.textContent = message;
    errorTextElement.style.marginTop = '0';
    errorTextElement.style.marginBottom = '2em';

    errorButtonRepeatElement = errorNode.querySelector('.error__button--repeat');
    errorButtonChoiceElement = errorNode.querySelector('.error__button--choice');

    // добавляем листенеры закрытия
    document.addEventListener('click', onPopupClick);
    document.addEventListener('keydown', onPopupEscPress);
    errorButtonRepeatElement.addEventListener('click', onButtonClick);
    errorButtonChoiceElement.addEventListener('click', onButtonChoiceClick);

    // убираем листенер закрытия формы
    document.removeEventListener('keydown', window.form.onEscPress);

    // добавляем в разметку
    mainElement.insertAdjacentElement('afterbegin', errorNode);
  };


  /**
  * описывает действия при ошибке отправки
  * @param {string} message
  */
  var onError = function (message) {
    isSuccess = false; // меняем флаг
    renderError(message);
  };

  window.popup = {
    onSuccess: onSuccess,
    onError: onError
  };
})();
