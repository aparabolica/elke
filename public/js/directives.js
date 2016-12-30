angular.module('elke')

.directive('streamingItem', [
  '$feathers',
  function($feathers) {
    return {
      restrict: 'A',
      scope: {
        'streaming': '=streamingItem'
      },
      templateUrl: '/views/stream/list-item.html',
      link: function(scope, element, attrs) {
        var service = $feathers.service('streamings');
        scope.deleteStream = function(streaming) {
          service.remove(streaming._id);
        };
        scope.goLive = function(streaming) {
          service.patch(streaming._id, {status: 'live'});
        };
        scope.getStreamURL = function(streaming) {
          return 'rtmp://localhost/live?key=' + streaming.liveKey;
        }
      }
    }
  }
])

.directive('elkePlayer', [
  function() {
    return {
      restrict: 'AC',
      scope: {
        'streaming': '='
      },
      templateUrl: '/views/stream/player.html',
      link: function(scope, element, attrs) {
        scope.getMedia = _.memoize(function(streaming) {
          var media;
          if(streaming.status == 'streaming') {
            media = {
              sources: [
                {
                  src: 'http://localhost:8080/live/hls/' + streaming.streamName + '.m3u8',
                  type: 'application/x-mpegURL'
                },
                {
                  src: 'http://localhost:8080/live/dash/' + streaming.streamName + '_high/index.mpd',
                  type: 'application/dash+xml'
                },
                {
                  src: 'rtmp://localhost/show/flv:' + streaming.streamName + '_high',
                  type: 'rtmp/mp4'
                }
              ]
            };
          } else if(streaming.status == 'encoded') {
            media = {
              sources: [
                {
                  src: '/videos/' + streaming.streamName + '/480p.mp4',
                  type: 'video/mp4'
                }
              ]
            };
          }
          return media;
        }, function() {
          return JSON.stringify(arguments);
        });
      }
    }
  }
]);
