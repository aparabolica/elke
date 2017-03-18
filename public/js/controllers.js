navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

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

.controller('PeerCtrl', [
  '$scope',
  function($scope) {
    // Peer tests
    var peer = new Peer({
      host: 'localhost',
      port: 8080,
      path: '/ws/peer',
      debug: 3
    });
    var getStream = function() {
      // Tenta pegar dispositivo de audio e video
      navigator.getUserMedia({audio: true, video: true}, function(stream) {
        $scope.$apply(function() {
          $scope.myVideo = URL.createObjectURL(stream);
          $scope.localStream = stream;
        });
      }, function() {
        console.error('Error retrieving local stream', arguments);
      });
    };
    getStream();
    var createCall = function(call) {
      // Fecha chamada existente se existir
      if($scope.existingCall) {
        $scope.existingCall.close();
      }
      // Aguarda sinal de dispositivo fisico para criar chamada
      call.on('stream', function(stream) {
        $scope.$apply(function() {
          $scope.streamUrl = URL.createObjectURL(stream);
        });
      });
      // Define como chamada atual
      $scope.existingCall = call;
      $scope.theirId = call.peer;
    };
    peer.on('open', function(id) {
      console.log(id);
      $scope.myID = id;
    });
    peer.on('call', function(call) {
      // Responde a chamada criando uma chamada entre os dois usuários
      var call = peer.call($scope.callToID, $scope.localStream);
      call.answer($scope.localStream);
      $scope.$apply(function() {
        createCall(call);
      });
    });
    peer.on('error', function(err) {
      console.error('Peer error', err.message);
    });
    $scope.makeCall = function() {
      var call = peer.call($scope.peerId, $scope.localStream);
      createCall(call);
    };
    $scope.endCall = function() {
      $scope.existingCall.close();
    };
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
    }
  }
]);
