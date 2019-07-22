'use strict';

// модуль сообщений о загрузке/отправке данных
(function () {
  var mainElement = document.querySelector('main');
  var successTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');

  var successNode;
  var successButtonElement;


  /**
  * закрывает попап
  */
  var closePopup = function () {
    // удаляем из разметки
    mainElement.removeChild(successNode);

    // удляем обработчики
    successButtonElement.removeEventListener('click', onSuccessButtonClick);
    document.removeEventListener('keydown', onSuccessEscPress);
    document.removeEventListener('click', onSuccessClick);
  };

  /**
  * закрывает попап по клику на кнопку
  * @param {Event} evt
  */
  var onSuccessButtonClick = function (evt) {
    evt.preventDefault();
    closePopup();
  };

  /**
  * закрывает попап по esc
  * @param {Event} evt
  */
  var onSuccessEscPress = function (evt) {
    if (window.utils.isEscEvent(evt)) {
      evt.preventDefault();
      closePopup();
    }
  };

  /**
  * закрывает попап по клику на произвольную область
  * @param {event} evt
  */
  var onSuccessClick = function (evt) {
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
    successButtonElement.addEventListener('click', onSuccessButtonClick);
    document.addEventListener('click', onSuccessClick);
    document.addEventListener('keydown', onSuccessEscPress);

    // добавляем в разметку
    mainElement.insertAdjacentElement('afterbegin', successNode);
  };


  /**
  * описывает действия при успешной отправке
  */
  var onSuccess = function () {
    window.form.close();
    renderSuccess();
  };

  var onError = function () {
    console.log('Файл не загружен');
  };

  window.popup = {
    onSuccess: onSuccess,
    onError: onError
  };
})();
