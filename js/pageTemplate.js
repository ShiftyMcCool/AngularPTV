function TodoCtrl($scope,$http) {
  $http.get('/xml/PageTemplatePortfolio.xml',
    {transformResponse:function(data) {
      //console.log(data);
      // convert the data to JSON and provide
      // it to the success function below
        var x2js = new X2JS();
        var json = x2js.xml_str2json( data ).portfolio.pagetemplate;
        //console.log(json);
        return json;
        }
    }).
    success(function(data, status) {
      //console.log(data);
      $scope.portfolio = data;
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

    $scope.todoText = '';
  };

  $scope.todos = [
    {text:'learn angular', done:true},
    {text:'build an angular app', done:false}];

  $scope.addTodo = function() {
    $scope.todos.push({text:$scope.todoText, done:false});
    $scope.todoText = '';
  };
 
  $scope.remaining = function() {
    var count = 0;
    angular.forEach($scope.todos, function(todo) {
      count += todo.done ? 0 : 1;
    });
    return count;
  };
 
  $scope.archive = function() {
    var oldTodos = $scope.todos;
    $scope.todos = [];
    angular.forEach(oldTodos, function(todo) {
      if (!todo.done) $scope.todos.push(todo);
    });
  };
}