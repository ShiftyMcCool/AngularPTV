var app=angular.module('myApp', []);

function PageTemplateController($scope,$http) {
  $http.get('/xml/PageTemplatePortfolio.xml', {
    transformResponse:function(data) {
      var x2js = new X2JS();
      var json = x2js.xml_str2json( data ).portfolio.pagetemplate;
      return json;
    }
  })
  .success(function(data, status) {
    $scope.portfolio = data;
    $scope.id = data[0].id;
    $scope.title = data[0].title;
    $scope.description = data[0].description;
    $scope.cost = data[0].cost;
    $scope.smallpic = data[0].smallpic;
    $scope.largepic = data[0].largepic;
    $scope.currentPage = 0;
    $scope.pageSize = 4;
  });

  $scope.addPageTemplate = function() {
      console.log($scope.title);
      $scope.portfolio.push({
      id:$scope.id, 
      title:$scope.title,
      description:$scope.description,
      cost:$scope.cost,
      smallpic:$scope.smallpic,
      largepic:$scope.largepic
    });
  };

  $scope.showPageTemplate = function(id) {
    angular.forEach($scope.portfolio, function(value, key){
      if(value.id == id){
        $scope.id = value.id;
        $scope.title = value.title;
        $scope.description = value.description;
        $scope.cost = value.cost;
        $scope.smallpic = value.smallpic;
        $scope.largepic = value.largepic;
      }
    });
  };

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
}

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start;
        return input.slice(start);
    };
});