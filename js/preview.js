'use strict';

// модуль показа полноэкранного изображения
(function () {
  var bigPictureElement = document.querySelector('.big-picture');
  var closeButtonElement = bigPictureElement.querySelector('#picture-cancel');

  /**
  * закрывает окно просмотра
  */
  var closeBigPicture = function () {
    document.body.classList.remove('modal-open');
    bigPictureElement.classList.add('hidden');

    // удаляем листенеры
    closeButtonElement.removeEventListener('click', onCloseButtonClick);
    document.removeEventListener('keydown', onBigPictureEscPress);
  };

  /**
  * закрывает окно просмотра при клике на "крестик"
  * @param {Event} evt
  */
  var onCloseButtonClick = function (evt) {
    evt.preventDefault();
    closeBigPicture();
  };

  /**
  * закрывает окно просмотра по esc
  * @param {Event} evt
  */
  var onBigPictureEscPress = function (evt) {
    if (window.utils.isEscEvent(evt)) {
      evt.preventDefault();
      closeBigPicture();
    }
  };

  /**
  * отрисовывает полноэкранное изображение
  */
  var renderBigPicture = function () {
    document.body.classList.add('modal-open');
    bigPictureElement.classList.remove('hidden');

    closeButtonElement.addEventListener('click', onCloseButtonClick);
    document.addEventListener('keydown', onBigPictureEscPress);
  };

  window.preview = {
    render: renderBigPicture
  };
})();
