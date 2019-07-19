'use strict';

(function () {
  /**
  * @const
  * @type {number}
  */
  var Keycode = {
    ENTER: 13,
    ESC: 27
  };

  window.utils = {
    /**
    * проверяет, был ли нажат esc
    * @param {event} evt
    * @return {Boolean}
    */
    isEscEvent: function (evt) {
      return evt.keyCode === Keycode.ESC;
    },

    /**
    * проверяет, был ли нажат enter
    * @param {event} evt
    * @return {Boolean}
    */
    isEnterEvent: function (evt) {
      return evt.keyCode === Keycode.ENTER;
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
    }
  };
})();
