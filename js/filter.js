'use strict';

// модуль фильтрации фотографий
(function () {
  var LATEST_PHOTO_AMOUNT = 10; // количество фотографий, добавляемых по ТЗ фильтром "Новые"

  var filterElements = window.gallery.filtersContainer.querySelectorAll('button');
  var currentFilter; // текущий выбранный фильтр
  var classActive = 'img-filters__button--active';

  var filteredPhotos = []; // массив отфильтрованных данных
  /**
  * отрисовывает галлерею на основе отфильтрованных данных
  */
  var updateGallery = function () {
    window.gallery.renderPictureList(filteredPhotos);
  };


  /**
  * создает массив заданной длинны из неповторяющихся фото
  * @param {Array} arr
  * @return {Array}
  */
  var filterLatestPhoto = function (arr) {
    var copyArray = arr.slice();
    var filteredArray = window.utils.getMixedArray(copyArray).slice(0, LATEST_PHOTO_AMOUNT);
    return filteredArray;
  };

  /**
  * создает копию массива
  * @param {Array} arr
  * @return {Array}
  */
  var filterPopularPhoto = function (arr) {
    var filteredArray = arr.slice();
    return filteredArray;
  };

  /**
  * создает массив отсортированных по убыванию количества комментариев фото
  * @param {Array} arr
  * @return {Array}
  */
  var filterDiscussedPhoto = function (arr) {
    var filteredArray = arr.slice().sort(function (first, second) {
      return second.comments.length - first.comments.length;
    });
    return filteredArray;
  };

  // создадим объект-мапу, хранящий соотношение id фильтра и функции, возвращающей массив фотографий
  var filterFunctiontMap = {
    'filter-popular': filterPopularPhoto,
    'filter-new': filterLatestPhoto,
    'filter-discussed': filterDiscussedPhoto
  };


  // определим текущий выбранный фильтр
  var filtersArray = Array.prototype.slice.call(filterElements);
  filtersArray.forEach(function (it) {
    if (it.classList.contains(classActive)) {
      currentFilter = it;
    }
  });

  // добавим обработчик переключения фильтра
  window.gallery.filtersContainer.addEventListener('click', function (evt) {
    if (evt.target.type === 'button') {
      // если выбранный фильтр не является активным
      if (evt.target !== currentFilter) {
        // перенесем на него classActive
        currentFilter.classList.remove(classActive);
        evt.target.classList.add(classActive);
        currentFilter = evt.target;
      }
      // в зависимоти от фильтра получим массив фото
      filteredPhotos = filterFunctiontMap[evt.target.id](window.gallery.data);
      // отрисуем полученный массив
      window.debounce(updateGallery);
    }
  });

})();
