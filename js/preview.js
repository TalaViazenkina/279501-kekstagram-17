'use strict';

// модуль показа полноэкранного изображения
(function () {
  var bigPictureElement = document.querySelector('.big-picture');

  var renderBigPicture = function () {
    bigPictureElement.classList.remove('hidden');
  };

  renderBigPicture();
})();
