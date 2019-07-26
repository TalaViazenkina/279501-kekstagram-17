'use strict';

// модуль сообщения об успешной загрузке фото
(function () {
  var successTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');

  var successNode;
  var successButtonElement;

  /**
  * закрывает попап
  */
  var closePopup = function () {
    // удаляем попап из разметки
    window.data.main.removeChild(successNode);

    // удляем обработчики
    document.removeEventListener('keydown', onPopupEscPress);
    document.removeEventListener('click', onPopupClick);
    successButtonElement.removeEventListener('click', onButtonClick);
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

    // добавляем в разметку
    window.data.main.insertAdjacentElement('afterbegin', successNode);
  };


  /**
  * описывает действия при успешной отправке
  */
  var onSuccess = function () {
    window.form.close();

    renderSuccess();
    // добавляем обработчики закрытия
    successButtonElement.addEventListener('click', onButtonClick);
    document.addEventListener('click', onPopupClick);
    document.addEventListener('keydown', onPopupEscPress);
  };

  window.success = onSuccess;

})();
