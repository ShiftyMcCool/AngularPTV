'use strict';

var ptControllers = angular.module('pageTemplateControllers', ['toaster']);

ptControllers.controller('PageTemplateController', function($scope,$route,$location,portfolio,toaster) {
  $scope.portfolio = [];
  $scope.ptIndex = 0;
  $scope.dataSourceUrl = 'http://localhost:8088';

  var handleSuccess = function(data, status) {
    $scope.portfolio = data;
    $scope.currentPage = 0;
    $scope.pageSize = 4;
    $scope.selectedID = $scope.portfolio[0].id;
  };

  portfolio.getPortfolio($scope).success(handleSuccess);

  $scope.prevEnabled = function() {
    if($scope.currentPage == 0) {
      $scope.prevClass = 'page-button-disabled';
      return true;
    }
    else {
      $scope.prevClass = 'page-button';
      return false;
    }
  };

  $scope.nextEnabled = function() {
    if($scope.currentPage >= $scope.portfolio.length/$scope.pageSize - 1) {
      $scope.nextClass = 'page-button-disabled';
      return true;
    }
    else {
      $scope.nextClass = 'page-button';
      return false;
    }
  };

  $scope.activatePageTemplate = function(id) {
    $scope.selectedID = id;
  };

  $scope.go = function ( path,arg ) {
    if(typeof arg != 'undefined') {
      path = path+arg;
    } 

    $location.path( path );
  };
});

ptControllers.controller('DetailController', function($scope,$routeParams,portfolio) {
  portfolio.getPageTemplate($scope,$routeParams.pageTemplateID);
});

ptControllers.controller('FormController', function($scope,$routeParams,portfolio,toaster) {
    portfolio.getPageTemplate($scope,$routeParams.pageTemplateID);
    var ptIndex = $scope.ptIndex;

  $scope.savePageTemplate = function() {
    if($scope.portfolio[ptIndex].id == $scope.thisTemplate.id) {
      portfolio.updatePageTemplate($scope, ptIndex);
      toaster.pop('success', "Success!", "Page Template successfully updated");
      $scope.go('/detail/'+$scope.portfolio[ptIndex].id);
    }
    else {
      portfolio.addPageTemplate($scope);
      toaster.pop('success', "Success!", "Page Template successfully added");
      $scope.selectedID = $scope.thisTemplate.id;
      $scope.go('/detail/'+$scope.thisTemplate.id);
    }
  };
});

ptControllers.controller('DeleteController', function($scope,$routeParams,portfolio,toaster){
  portfolio.deletePageTemplate($scope, $routeParams.pageTemplateIndex);
  toaster.pop('success', "Success!", "Page Template successfully deleted");
  $scope.selectedID = $scope.portfolio[0].id;
  $scope.go('/detail/'+$scope.portfolio[0].id);
});