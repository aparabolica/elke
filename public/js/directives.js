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
          if(confirm('Are you sure?'))
            service.remove(streaming._id);
        };
        scope.goLive = function(streaming) {
          service.patch(streaming._id, {status: 'live'});
        };
      }
    }
  }
])

.directive('ratio', [
  function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var ratio = attrs.ratio ? attrs.ratio.split(':') : false;
        function applyRatio() {
          if(ratio) {
            element.css({
              height: (element[0].offsetWidth * parseInt(ratio[1]) / parseInt(ratio[0])) + 'px'
            });
          } else {
            element.css({height: null});
          }
        }
        applyRatio();
        window.addEventListener('resize', applyRatio);
        scope.$on('$destroy', function() {
          window.removeEventListener('resize', applyRatio);
        });
      }
    }
  }
])

.directive('elkeMedia', [
  function() {
    return {
      restrict: 'A',
      scope: {
        'streaming': '=elkeMedia'
      },
      templateUrl: '/views/stream/media.html',
      link: function(scope, element, attrs) {
        scope.streamUrl = '';
        scope.$watch('streaming.liveKey', function(liveKey) {
          if(liveKey)
            scope.streamUrl = 'rtmp://localhost/live?key=' + liveKey;
        });
      }
    };
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
        scope.media = {};
        scope.$watch('streaming', function(streaming) {
          if(streaming.status == 'streaming') {
            scope.media = {
              sources: [
                {
                  src: 'rtmp://localhost:1935/live/flv:' + streaming.streamName,
                  type: 'rtmp/mp4'
                }
                // {
                //   src: 'http://localhost:8080/live/hls/' + streaming.streamName + '.m3u8',
                //   type: 'application/x-mpegURL'
                // },
                // {
                //   src: 'http://localhost:8080/live/dash/' + streaming.streamName + '_high/index.mpd',
                //   type: 'application/dash+xml'
                // }
              ]
            };
          } else if(streaming.status == 'encoded') {
            scope.media = {
              sources: [
                {
                  src: '/videos/' + streaming.streamName + '/720p.mp4',
                  type: 'video/mp4'
                }
              ],
              poster: '/videos/' + streaming.streamName + '/thumbs/tn_3.png'
            };
          }
        });
        //listen for when the vjs-media object changes
        // scope.$on('vjsVideoReady', function (e, data) {
        //   console.log('video id:' + data.id);
        //   console.log('video.js player instance:' + data.player);
        //   console.log('video.js controlBar instance:' + data.controlBar);
        // });
        // scope.$on('vjsVideoMediaChanged', function (e, data) {
        //   console.log('vjsVideoMediaChanged event was fired');
        // });
      }
    }
  }
]);
