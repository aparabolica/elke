angular.module('elke')

.controller('AppCtrl', [
  '$scope',
  '$feathers',
  function($scope, $feathers) {
    $scope.$watch(function() {
      return $feathers.get('user');
    }, function(user) {
      console.log(user);
      $scope.user = user;
    });
    $scope.logout = $feathers.logout;
  }
])

.controller('HomeCtrl', [
  '$scope',
  '$state',
  'App',
  'Streamings',
  function($scope, $state, App, Streamings) {
    console.log(App);
    if(!App.data.active) {
      $state.go('auth', {register: true});
    }
    $scope.streamings = Streamings.data;
    console.log(Streamings);
  }
])

.controller('AuthCtrl', [
  '$scope',
  '$feathers',
  '$state',
  '$stateParams',
  function($scope, $feathers, $state, $stateParams) {
    var userService = $feathers.service('users');
    if($stateParams.register) {
      $scope.registration = true;
    }
    $scope.credentials = {};
    var auth = function() {
      $feathers.authenticate({
        type: 'local',
        email: $scope.credentials.email,
        password: $scope.credentials.password
      }).then(function(res) {
        $state.go('home');
      }).catch(function(err) {
        console.error('Error authenticating', err);
      });
    };
    $scope.auth = function() {
      if($scope.registration) {
        userService.create($scope.credentials)
          .then(auth)
          .catch(function(err) {
            console.log('Error creating user', err);
          });
      } else {
        auth();
      }
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
