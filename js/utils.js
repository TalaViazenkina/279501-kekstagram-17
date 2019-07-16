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
    }
  };
})();
