'use strict';

// модуль показа полноэкранного изображения
(function () {
  var COMMENT_MAX_COUNT = 5;
  var AVATAR_SIZE = 35;

  var bigPictureElement = document.querySelector('.big-picture');
  var closeButtonElement = bigPictureElement.querySelector('#picture-cancel');
  var imageElement = bigPictureElement.querySelector('.big-picture__img img'); // фотография
  var descriptionElement = bigPictureElement.querySelector('.social__caption');
  var likesCountElement = bigPictureElement.querySelector('.likes-count'); // количество лайков
  var commentsCountElement = bigPictureElement.querySelector('.comments-count'); //  количество комментариев
  var commentsListElement = bigPictureElement.querySelector('.social__comments'); // блок с комментариями

  var commentItem; // шаблон комментария

  /**
  * закрывает окно просмотра
  */
  var closeBigPicture = function () {
    document.body.classList.remove('modal-open');
    window.utils.hideNode(bigPictureElement);

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
  * заполняет атрибут src изображения
  * @param {HTMLElement} field
  * @param {string} url
  */
  var fillImage = function (field, url) {
    field.src = url;
  };

  /**
  * заполняет атрибут alt изображения
  * @param {HTMLElement} field
  * @param {string} text
  */
  var fillAlt = function (field, text) {
    field.alt = text;
  };

  /**
  * заполняет поле текстовой информацией
  * @param {HTMLElement} field
  * @param {number | string} data
  */
  var fillField = function (field, data) {
    field.textContent = data;
  };

  /**
  * удаляет комментарии
  */
  var clearComments = function () {
    var liArray = Array.prototype.slice.call(commentsListElement.querySelectorAll('li'));
    liArray.forEach(function (li) {
      li.remove();
    });
  };

  /**
  * создает шаблон комментария
  * @return {HTMLElement}
  */
  var createComment = function () {
    // создадим блок комментария
    var comment = document.createElement('li');
    comment.classList.add('social__comment');

    // добавим изображение
    var image = document.createElement('img');
    image.classList.add('social__picture');
    image.width = AVATAR_SIZE;
    image.height = AVATAR_SIZE;
    comment.appendChild(image);

    // добавим текстовое поле
    var text = document.createElement('p');
    text.classList.add('social__text');
    comment.appendChild(text);

    return comment;
  };

  /**
  * заполняет комментарий
  * @param {HTMLElement} comment
  * @param {Object} obj
  * @return {HTMLElement}
  */
  var fillComment = function (comment, obj) {
    var avatarElement = comment.querySelector('img');
    fillImage(avatarElement, obj.avatar);
    fillAlt(avatarElement, obj.name);

    var textElement = comment.querySelector('.social__text');
    fillField(textElement, obj.message);

    return comment;
  };

  /**
  * заполняет блок комментариями
  * @param {Array} comments
  */
  var fillCommentsList = function (comments) {
    // удалим присутствующие в разметки комментарии
    clearComments();

    var fragment = document.createDocumentFragment();

    comments.forEach(function (it) {
      var commentClone = commentItem.cloneNode(true);
      fragment.appendChild(fillComment(commentClone, it));
    });

    commentsListElement.appendChild(fragment);
  };

  /**
  * отрисовывает полноэкранное изображение
  * @param {Object} obj
  */
  var renderBigPicture = function (obj) {
    // покажем попап с полноэкранным изображением
    document.body.classList.add('modal-open');
    window.utils.showNode(bigPictureElement);

    // отрисуем полноэкранное изображение для текущего фото
    fillImage(imageElement, obj.url);
    // заполним количество лайков и комментариев, описание фото
    fillField(likesCountElement, obj.likes);
    fillField(commentsCountElement, obj.comments.length);
    fillField(descriptionElement, obj.description);

    // отрисовка комментариев
    // очистим блок с комментариями, если комментариев нет
    if (!obj.comments || obj.comments.length === 0) {
      clearComments();
    } else {
      commentItem = createComment();
      fillCommentsList(obj.comments);
    }




    // добавим листнеры закрытия
    closeButtonElement.addEventListener('click', onCloseButtonClick);
    document.addEventListener('keydown', onBigPictureEscPress);
  };

  window.preview = {
    render: renderBigPicture
  };
})();
