'use strict';

(function () {
  /**
  * @const
  * @type {number}
  */
  var ESC_KEYCODE = 27;

  window.utils = {
    /**
    * проверяет, был ли нажат esc
    * @param {event} evt
    * @return {Boolean}
    */
    isEscEvent: function (evt) {
      return evt.keyCode === ESC_KEYCODE;
    },

    /**
    * перемешивает массив
    * @param {Array} arr
    * @return {Array}
    */
    getMixedArray: function (arr) {
      for (var i = arr.length - 1; i > 0; i--) {
        // получаем индекс случайного элемента в массиве с длинной (i + 1),
        // на первой итерации длина массива равна длине исходного,
        // с каждой последующей - на единицу меньше
        var randomIndex = Math.floor(Math.random() * (i + 1));

        // меняем элементы местами
        var temp = arr[i];
        arr[i] = arr[randomIndex]; // случайно выбранный элемент перенесен в конец массива
        arr[randomIndex] = temp; // на место случайно выбранного элемента записан элемент с индексом i
      }
      return arr;
    },

    /**
    * добавляет к элементу класс hidden
    * @param {HTMLElement} node
    */
    hideNode: function (node) {
      if (!node.classList.contains('hidden')) {
        node.classList.add('hidden');
      }
    },

    /**
    * удаляет у элемента класс hidden
    * @param {HTMLElement} node
    */
    showNode: function (node) {
      if (node.classList.contains('hidden')) {
        node.classList.remove('hidden');
      }
    },

    /**
    * удаляет с элемента класс, начинающийся с искомой строки
    * @param {Element} el
    * @param {String} unit
    */
    removeClass: function (el, unit) {
      if (el.classList.length !== 0) {
        var initialClasses = Array.prototype.slice.call(el.classList);
        initialClasses.forEach(function (it) {
          if (it.indexOf(unit) === 0) {
            el.classList.remove(it);
          }
        });
      }
    }

  };
})();
