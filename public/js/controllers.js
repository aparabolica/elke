angular.module('elke')

.controller('AppCtrl', [
  '$scope',
  '$feathers',
  function($scope, $feathers) {
    var userService = $feathers.service('users');
    $scope.$watch(function() {
      return $feathers.get('user');
    }, function(user) {
      console.log(user);
      $scope.user = user;
    });
    $scope.logout = $feathers.logout;
    // userService.on('created', function(msg) {
    //   console.log(msg);
    // });
    // userService.create({
    //   email: 'john@doe.com',
    //   password: 'unicorn'
    // }).then(function (res) {
    //   console.log(res)
    // }).catch(function (err) {
    //   console.error(err)
    // });
  }
])

.controller('AuthCtrl', [
  '$scope',
  '$feathers',
  '$state',
  function($scope, $feathers, $state) {
    $scope.credentials = {};
    $scope.auth = function() {
      $feathers.authenticate({
        type: 'local',
        email: $scope.credentials.email,
        password: $scope.credentials.password
      }).then(function(res) {
        $state.go('home');
      }).catch(function(err) {
        console.error('Error authenticating', err);
      });
    }
  }
])

.controller('StreamCtrl', [
  '$scope',
  '$feathers',
  function($scope, $feathers) {
    var service = $feathers.service('streamings');
    $scope.streaming = {};
    $scope.createStream = function() {
      service.create($scope.streaming).then(function(res) {
        console.log('streaming created', res);
      }).catch(function(err) {
        console.log(err);
      });
    };
  }
]);
