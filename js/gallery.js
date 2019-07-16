'use strict';

// модуль работы с галлереей
(function () {
  var data = []; // массив данных, полученных с сервера

  var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('a.picture');

  var picturesContainer = document.querySelector('section.pictures');

  /**
  * отрисовывает фото
  * @param {Object} obj
  * @return {Element}
  */
  var renderPicture = function (obj) {
    // клонируем шаблон
    var picture = pictureTemplate.cloneNode(true);

    // заполняем адрес фото
    var pictureImg = picture.querySelector('.picture__img');
    pictureImg.src = obj.url;

    // вводим количество лайков
    var pictureLike = picture.querySelector('.picture__likes');
    pictureLike.textContent = obj.likes;

    // вводим количество комментариев
    var pictureComment = picture.querySelector('.picture__comments');
    pictureComment.textContent = obj.comments.length;

    return picture;
  };

  /**
  * добавляет в разметку список фотографий
  * @param {Array} arr
  */
  var renderPictureList = function (arr) {
    var fragment = document.createDocumentFragment();

    arr.forEach(function (it) {
      fragment.appendChild(renderPicture(it));
    });

    picturesContainer.appendChild(fragment);
  };

  var onSuccessLoad = function (response) {
    data = response;
    renderPictureList(data);
  };

  var onErrorLoad = function (message) {
    console.log(message);
  };

  window.backend.load(onSuccessLoad, onErrorLoad);

})();
