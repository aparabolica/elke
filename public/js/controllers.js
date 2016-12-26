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
  '$feathers',
  'App',
  'Streamings',
  function($scope, $state, $feathers, App, Streamings) {
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
          return streaming._id !== data._id;
        });
      });
    });
    streamingService.on('updated', function(data) {
      $scope.$apply(function() {
        $scope.streamings.forEach(function(streaming, i) {
          if(streaming._id == data._id) {
            $scope.streamings[i] = data;
          }
        });
      });
    });
    streamingService.on('patched', function(data) {
      $scope.$apply(function() {
        $scope.streamings.forEach(function(streaming, i) {
          if(streaming._id == data._id) {
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
  '$state',
  '$feathers',
  function($scope, $state, $feathers) {
    var service = $feathers.service('streamings');
    $scope.streaming = {};
    $scope.createStream = function() {
      service.create($scope.streaming).then(function(res) {
        console.log('streaming created', res);
        $state.go('main.home');
      }).catch(function(err) {
        console.log(err);
      });
    };
    $scope.deleteStream = function(streaming) {
      service.remove(streaming._id);
    };
    $scope.goLive = function(streaming) {
      service.patch(streaming._id, {status: 'live'});
    };
    $scope.getStreamURL = function(streaming) {
      return 'rtmp://localhost/live?key=' + streaming.liveKey;
    }
    $scope.getMedia = _.memoize(function(streaming) {
      var media;
      if(streaming.status == 'streaming') {
        media = {
          sources: [
            {
              src: 'http://localhost:8080/live/hls/' + streaming.streamName + '.m3u8',
              type: 'application/x-mpegURL'
            },
            // {
            //   src: 'http://localhost:8080/live/dash/' + streaming.streamName + '_high/index.mpd',
            //   type: 'application/dash+xml'
            // },
            // {
            //   src: 'rtmp://localhost/show/flv:' + streaming.streamName + '_high',
            //   type: 'rtmp/mp4'
            // }
          ]
        };
      } else if(streaming.status == 'finished') {
        media = {
          sources: [
            {
              src: '/videos/' + streaming.streamName + '_hd720.flv',
              type: 'video/x-flv'
            }
          ]
        };
      }
      return media;
    }, function() {
      return JSON.stringify(arguments);
    });
  }
]);
