'use strict';

var app = angular.module('myApp', [
  'ngRoute',
  'pageTemplateControllers',
  'pageTemplateServices',
  'pageTemplateDirectives',
  'pageTemplateFilters'
  ],
  function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl:'/views/detail.html'
    })
    .when('/detail/:pageTemplateID', {
      controller:'DetailController',
      templateUrl:'/views/detail.html'
    })
    .when('/edit/:pageTemplateID', {
      controller:'FormController',
      templateUrl:'/views/edit.html'
    })
    .when('/new', {
      controller:'FormController',
      templateUrl:'/views/edit.html'
    })
    .when('/delete/:pageTemplateIndex', {
      controller:'DeleteController',
      templateUrl:'/views/detail.html'
    })
    .otherwise({
      redirectTo:'/'
    });
});