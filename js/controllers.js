'use strict';

var ptControllers = angular.module('pageTemplateControllers', ['toaster']);

ptControllers.controller('PageTemplateController', function($scope,$route,$location,portfolio,toaster) {
  $scope.portfolio = [];
  $scope.ptIndex = 0;

  var handleSuccess = function(data, status) {
    $scope.portfolio = data;
    $scope.currentPage = 0;
    $scope.pageSize = 4;
  };

  portfolio.getPortfolio().success(handleSuccess);

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

  $scope.go = function ( path,id ) {
    if(typeof id != 'undefined') {
      path = path+id;
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
      $scope.go('/detail/'+$scope.thisTemplate.id);
    }
  };
});

ptControllers.controller('DeleteController', function($scope,$routeParams,portfolio,toaster){
  portfolio.deletePageTemplate($scope, $scope.ptIndex);
  toaster.pop('success', "Success!", "Page Template successfully deleted");
  $scope.go('/detail/'+$scope.portfolio[0].id);
});