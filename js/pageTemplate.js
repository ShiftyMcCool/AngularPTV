var app=angular.module('myApp', ['ngRoute'],
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
    .otherwise({
      redirectTo:'/'
    });
});

app.factory('portfolio', function($http){
  return {
    getPortfolio: function() {
      return $http.get('/xml/PageTemplatePortfolio.xml', {
        transformResponse:function(data) {
          var x2js = new X2JS();
          var json = x2js.xml_str2json( data ).portfolio.pagetemplate;
          console.log(json);
          return json;
        }
      });
    },
    getPageTemplate: function($scope,id) {
      angular.forEach($scope.portfolio, function(value, key){
        if(value.id == id){
          $scope.ptIndex = key;
          $scope.thisTemplate = angular.copy($scope.portfolio[key]);
        }
      });
    },
    addPageTemplate: function($scope,index) {
      $scope.portfolio.push({
        id:$scope.thisTemplate.id, 
        title:$scope.thisTemplate.title,
        description:$scope.thisTemplate.description,
        cost:$scope.thisTemplate.cost,
        smallpic:$scope.thisTemplate.smallpic,
        largepic:$scope.thisTemplate.largepic
      });
    },
    updatePageTemplate: function($scope,index) {
      $scope.portfolio[index] = $scope.thisTemplate;
      $scope.thisTemplate = "";
    }
  };
});

app.controller('PageTemplateController', function($scope,$route,$location,portfolio) {
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

app.controller('DetailController', function($scope,$routeParams,portfolio) {
  portfolio.getPageTemplate($scope,$routeParams.pageTemplateID);
});

app.controller('FormController', function($scope,$routeParams,portfolio) {
    portfolio.getPageTemplate($scope,$routeParams.pageTemplateID);
    var ptIndex = $scope.ptIndex;

  $scope.savePageTemplate = function() {
    if($scope.portfolio[ptIndex].id == $scope.thisTemplate.id) {
      portfolio.updatePageTemplate($scope, ptIndex);
      $scope.go('/detail/'+$scope.portfolio[ptIndex].id);
    }
    else {
      portfolio.addPageTemplate($scope);
      $scope.go('/detail/'+$scope.thisTemplate.id);
    }

    
  };
});

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start;
        return input.slice(start);
    };
});

app.directive('onChange', function() {    
  return {
    restrict: 'A',
    scope:{'onChange':'=' },
    link: function(scope, elm, attrs) {
      scope.$watch('onChange', function(nVal) { elm.val(nVal); });            
      elm.bind('blur', function() {
        var currentValue = elm.val();
        if( scope.onChange !== currentValue ) {
          scope.$apply(function() {
           scope.onChange = currentValue;
          });
        }
      });
    }
  };        
});