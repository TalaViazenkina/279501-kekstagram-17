'use strict';

// модуль фильтрации фотографий
(function () {

  var filterElements = window.gallery.filtersContainer.querySelectorAll('button');
  var currentFilter; // текущий выбранный фильтр
  var classActive = 'img-filters__button--active';

  var filtersArray = Array.prototype.slice.call(filterElements);
  // определим текущий выбранный фильтр
  filtersArray.forEach(function (it) {
    if (it.classList.contains(classActive)) {
      currentFilter = it;
    }
  });

  // добавим обработчик переключения фильтра
  window.gallery.filtersContainer.addEventListener('click', function (evt) {
    if (evt.target.type === 'button') {
      // если выбранный фильтр не является активным
      // перенесем на него classActive
      if (evt.target !== currentFilter) {
        currentFilter.classList.remove(classActive);
        evt.target.classList.add(classActive);
        currentFilter = evt.target;
      }
    }
  });

})();
