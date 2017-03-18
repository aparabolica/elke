angular.module('elke')

.controller('AppCtrl', [
  '$scope',
  '$feathers',
  'App',
  'Elke',
  function($scope, $feathers, App, Elke) {
    $scope.user = false;
    $scope.$watch(function() {
      return $feathers.get('user');
    }, function(user) {
      $scope.user = user;
    });
    $scope.logout = $feathers.logout;
    // Store app data in global service
    for(var key in App.data) {
      Elke.set(key, App.data[key]);
    }
    // Redirect to registration if app not active (no users found in db)
    if(!Elke.get('active')) {
      $state.go('main.auth', {register: true});
    }
  }
])

.controller('HomeCtrl', [
  '$scope',
  '$state',
  '$feathers',
  'Elke',
  'Streamings',
  function($scope, $state, $feathers, Elke, Streamings) {
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
  'Elke',
  function($scope, $feathers, $state, $stateParams, Elke) {
    var userService = $feathers.service('users');
    $scope.active = Elke.get('active');
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
    $scope.streaming = angular.copy(Streaming);
    $scope.save = function() {
      if(Streaming.id) {
        service.patch(Streaming.id, $scope.streaming).then(function(streaming) {
          $scope.streaming = streaming;
        });
      } else {
        service.create($scope.streaming).then(function(res) {
          $state.go('main.home');
        }).catch(function(err) {
          console.error('Error creating streaming', err);
        });
      }
    };
  }
]);
