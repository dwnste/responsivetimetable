import angular from 'angular';
import '../css/main.css';
import ngStorage from 'ngstorage';
import {timeToMilli} from '../js/helpers.js';

const app = angular.module('spa', ['ngStorage']);

class TableController{
    constructor($scope, $window, $localStorage, $filter, $http) {
        $scope.rawsLimit = 0;
        $scope.width = 0;
        $scope.counter = 0;
        $scope.columns=['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];
        $scope.data = [];
        $scope.daySelector = 'Понедельник';
        $scope.newSubject = '';
        $scope.editingMode = false; //режим удаления строк

    //Заполнить тестовыми данными
        $scope.addPreData = () => {
            $http({
                method: 'GET',
                url: '../test.json'
            }).then((response) => {
                    const parsedResponse = angular.fromJson(response['data']['data']);
                    const array = Object.keys(parsedResponse).map(function(k) {
                        return parsedResponse[k];
                    });
                    $scope.data = [];
                    $scope.data = array;
                    $scope.addToLocalStorage();
                });
        };


    //Добавить в localStorage данные из таблицы
        $scope.addToLocalStorage = () => {
            $localStorage.tableData = [];
            $localStorage.tableData = $scope.data;
        };
    //Загрузить данные из localStorage
        $scope.loadFromLocalStorage = () => {
            $scope.data = $localStorage.tableData;
        };
        /* дебаг */
        $scope.resetLocalStorage = () => {
            $localStorage.tableData = [];
        };
    //Показать следующий столбец(столбцы)
        $scope.goBack = () => {
            if ($scope.counter > 0){
                $scope.counter--;
            }
        };
    //Показать предыдущие
        $scope.goForward = () => {
            if ($scope.counter < ($scope.columns.length - $scope.rowsLimit)) {
                $scope.counter++;
            }
        };
    //Добавление новой строки в таблицу
        $scope.addItem = () => {
            if (($scope.time !== null) && ($scope.newSubject !== '')){ //в input time и input text не пусто
                const filteredTime = $filter('date')($scope.time, 'HH:mm');
                const a = {};
                a[$scope.daySelector] = $scope.newSubject;//данные в выбранный день недели пустого массива
                a['time'] = timeToMilli(filteredTime); //время в секундах в новый пустой массив
                const found = $filter('filter')($scope.data, {time: a['time']}, true);
                if (found.length) { //если элемент уже существует
                    $filter('filter')($scope.data, {time: a['time']}, true)[0][$scope.daySelector] = $scope.newSubject; //поиск и запись/перезапись
                } else { //если не существует, просто push
                    $scope.data.push(a);
                }
                $scope.time ='';
                $scope.newSubject ='';
            } else { //если какая-то из форм не заполнена
                    console.log('Information in form is incorrect');
            };
        };
    //Включение/выключение режима редактирования
        $scope.checkMode = () => {
            $scope.editingMode = !$scope.editingMode
        };
    //Получение ширины окна и запись в $scope.width
        $scope.updateWidth = () => {
            $scope.width = $window.innerWidth;
        };
    //Условия выбора количества столбцов
        $scope.tableRowLimiter = () => {
            if ($scope.width > 1200) {
                $scope.rowsLimit = 5;
            } else if ($scope.width > 992) {
                $scope.rowsLimit = 4;
            } else if ($scope.width >= 768){
                $scope.rowsLimit = 3;
            } else if ($scope.width < 768) {
                $scope.rowsLimit = 1;
            }
        };
    //Если количество столбцов 5, то прокрутка не нужна
        $scope.hideScrollers = () => {
            $scope.hideIfTrue = $scope.rowsLimit >= 5;
        };
    //Чтобы получить количество столбцов и разрешение, когда окно загрузилось
        $scope.updateWidth();
        $scope.tableRowLimiter();
        $scope.hideScrollers();
        //$scope.resetLocalStorage();
        //$scope.addPreData();
        $scope.loadFromLocalStorage();
    //Запускается при ресайзе
        $window.onresize = () => {
            $scope.counter = 0; //обнулять все время, чтобы при обратном ресайзе показывались все столбцы
            $scope.updateWidth();
            $scope.tableRowLimiter();
            $scope.hideScrollers();
            $scope.$apply();
        };
    }
}

app.controller('TableController', ['$scope', '$window', '$localStorage', '$filter', '$http', TableController]);