angular.module('elke')

.controller('AppCtrl', [
  '$scope',
  '$feathers',
  function($scope, $feathers) {
    $scope.$watch(function() {
      return $feathers.get('user');
    }, function(user) {
      $scope.user = user;
    });
    $scope.logout = $feathers.logout;
  }
])

.controller('HomeCtrl', [
  '$scope',
  '$state',
  '$feathers',
  'App',
  'Elke',
  'Streamings',
  function($scope, $state, $feathers, App, Elke, Streamings) {
    Elke.set('host', App.data.host);
    if(!App.data.active) {
      $state.go('main.auth', {register: true});
    }
    var streamingService = $feathers.service('streamings');
    $scope.streamings = Streamings.data;
    streamingService.on('created', function(data) {
      $scope.$apply(function() {
        $scope.streamings.push(data);
      });
    });
    streamingService.on('removed', function(data) {
      $scope.$apply(function() {
        $scope.streamings = _.filter($scope.streamings, function(streaming) {
          return streaming.id !== data.id;
        });
      });
    });
    streamingService.on('updated', function(data) {
      $scope.$apply(function() {
        $scope.streamings.forEach(function(streaming, i) {
          if(streaming.id == data.id) {
            $scope.streamings[i] = data;
          }
        });
      });
    });
    streamingService.on('patched', function(data) {
      $scope.$apply(function() {
        $scope.streamings.forEach(function(streaming, i) {
          if(streaming.id == data.id) {
            $scope.streamings[i] = data;
          }
        });
      });
    });
  }
])

.controller('AuthCtrl', [
  '$scope',
  '$feathers',
  '$state',
  '$stateParams',
  'App',
  function($scope, $feathers, $state, $stateParams, App) {
    var userService = $feathers.service('users');
    $scope.app = App.data;
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
        $state.go('main.home', {}, {reload:true});
      }).catch(function(err) {
        console.error('Error authenticating', err);
      });
    };
    $scope.auth = function() {
      if($scope.registration) {
        userService.create($scope.credentials)
          .then(auth)
          .catch(function(err) {
            console.error('Error creating user', err);
          });
      } else {
        auth();
      }
    }
  }
])

.controller('StreamCtrl', [
  '$scope',
  '$state',
  '$feathers',
  'Streaming',
  function($scope, $state, $feathers, Streaming) {
    var service = $feathers.service('streamings');
    $scope.streaming = Streaming;
    $scope.createStream = function() {
      service.create($scope.streaming).then(function(res) {
        $state.go('main.home');
      }).catch(function(err) {
        console.error('Error getting streaming', err);
      });
    };
  }
]);
