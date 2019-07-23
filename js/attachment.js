'use strict';

// модуль добавления пользовательского фото
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png']; // допустимые расширения файлов

  var photo;

  /**
  * проверяет соответствие расширения файла заданному
  * @param {File} file
  * @return {boolean}
  */
  var checkType = function (file) {
    var fileName = file.name.toLowerCase();
    return FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
  };

  /**
  * отрисовывает превью файла
  * @param {File} file;
  */
  var renderPreview = function (file) {
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      window.data.preview.src = reader.result;
    });
    reader.readAsDataURL(file);
  };


  // добавление нового фото
  window.data.photoLoader.addEventListener('change', function () {
    photo = window.data.photoLoader.files[0];
    if (photo && checkType(photo)) {
      renderPreview(photo);
    }
  });

})();
