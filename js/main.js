'use strict';

// константы
var PHOTOS_NUMBER = 25; // количество фотографий, которые необходимо описать


// общие функции, необходимые для расчетов
// создание числового массива заданной длины
var getArrayOfNumbers = function (arrayLength) {
  var arrayOfNumbers = [];
  for (var i = 1; i <= arrayLength; i++) {
    arrayOfNumbers.push(i);
  }

  return arrayOfNumbers;
};

// перемешивание массива
var getMixedArray = function (arr) {
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
};

// генерирование случайного элемента массива
var getRandomArrayItem = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// генерирование случайного числа из диапазона
var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};


// исходные данные для генерирования описаний
// количество лайков
var like = {
  min: 15,
  max: 200
};

// количество комментариев
var commentScore = {
  min: 0,
  max: 5
};

// текст комментариев
var commentTexts = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

// имена авторов комментариев
var commentName = ['Артем', 'Ксюша', '212-85-06', 'ДедМазай', 'Злобный Кто', 'ProffИ', 'Dr.Good', 'Сан Саныч', 'Coca&Coca'];

// массив чисел для генерации адреса фотографии
var photoUrls = getMixedArray(getArrayOfNumbers(PHOTOS_NUMBER));

// сгенерируем случайный комментарий
var getComment = function (authorName) {
  getMixedArray(commentTexts);
  return {
    avatar: 'img/avatar-' + getRandomNumber(1, 6) + '.svg',
    message: Math.round(Math.random()) ? commentTexts[0] : (commentTexts[0] + commentTexts[1]),
    name: authorName
  };
};

// сгенерируем блок комментариев к фотографии
var getCommentList = function (score) {
  getMixedArray(commentName);
  var commentList = [];
  for (var i = 1; i <= score; i++) {
    commentList.push(getComment(commentName[i]));
  }

  return commentList;
};

// создадим случайное описание фотографии
var getDescription = function (numericalItem) {
  return {
    url: 'photos/' + numericalItem + '.jpg',
    likes: getRandomNumber(like.min, like.max),
    comments: getCommentList(getRandomNumber(commentScore.min, commentScore.max))
  };
};
