'use strict';

// модуль работы с галлереей
(function () {
  var data = []; // массив данных, полученных с сервера

  var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('a.picture');

  var picturesContainerElement = document.querySelector('section.pictures');

  var filtersContainerElement = document.querySelector('section.img-filters');

  var isPictureList; // флаг наличия отрисованных фото

  /**
  * удаляет отрисованные фото из разметки
  */
  var clearPicture = function () {
    var pictureArray = Array.prototype.slice.call(document.querySelectorAll('.picture'));
    pictureArray.forEach(function (it) {
      it.remove();
    });
    isPictureList = false; // меняем флаг
  };

  /**
  * отрисовывает фото
  * @param {Object} obj
  * @return {Element}
  */
  var renderPicture = function (obj) {
    // клонируем шаблон
    var picture = pictureTemplate.cloneNode(true);

    // заполняем адрес фото
    var pictureImgElement = picture.querySelector('.picture__img');
    pictureImgElement.src = obj.url;

    // вводим количество лайков
    var pictureLikeElement = picture.querySelector('.picture__likes');
    pictureLikeElement.textContent = obj.likes;

    // вводим количество комментариев
    var pictureCommentElement = picture.querySelector('.picture__comments');
    pictureCommentElement.textContent = obj.comments.length;

    picture.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.bigpicture.render(obj);
    });

    return picture;
  };

  /**
  * добавляет в разметку список фотографий
  * @param {Array} arr
  */
  var renderPictureList = function (arr) {
    // удаляем уже отрисованные фото, если они есть
    if (isPictureList) {
      clearPicture();
    }

    var fragment = document.createDocumentFragment();

    arr.forEach(function (it) {
      fragment.appendChild(renderPicture(it));
    });

    picturesContainerElement.appendChild(fragment);
    isPictureList = true; // меняем флаг
  };

  var onSuccessLoad = function (response) {
    window.gallery.data = response;
    renderPictureList(window.gallery.data);
    filtersContainerElement.classList.remove('img-filters--inactive');
  };


  window.backend.load(onSuccessLoad, window.error.onLoading);

  window.gallery = {
    data: data,
    filtersContainer: filtersContainerElement,
    renderPictureList: renderPictureList,
    onSuccessLoad: onSuccessLoad
  };

})();
