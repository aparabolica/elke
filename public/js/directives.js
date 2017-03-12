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
        scope.$watch(function() {
          return $feathers.get('user');
        }, function(user) {
          scope.user = user;
        });
        var service = $feathers.service('streamings');
        scope.deleteStream = function(streaming) {
          if(confirm('Are you sure?'))
            service.remove(streaming.id);
        };
        scope.goLive = function(streaming) {
          service.patch(streaming.id, {status: 'live'});
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
  'Elke',
  function(Elke) {
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
            scope.streamUrl = 'rtmp://' + Elke.get('host') + '/live?key=' + liveKey;
        });
      }
    };
  }
])

.directive('elkePlayer', [
  'Elke',
  function(Elke) {
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
                  src: 'rtmp://' + Elke.get('host') + '/live/' + streaming.streamName,
                  type: 'rtmp/flv'
                }
              ]
            };
          } else if(streaming.status == 'encoded') {
            scope.media = {
              sources: [
                {
                  src: 'rtmp://' + Elke.get('host') + '/archive/&mp4:' + streaming.streamName + '/720p.mp4',
                  type: 'rtmp/mp4'
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
])

.directive('matchHeight', [
  '$document',
  '$window',
  function($document, $window) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var matchHeight = function() {
          var height = document.getElementById(attrs.matchHeight).offsetHeight;
          element.css({
            height: height + 'px'
          });
        };
        element.css({
          height: '0px'
        });
        setTimeout(function() {
          matchHeight();
        }, 100);
        window.addEventListener('resize', matchHeight);
        scope.$on('$destroy', function() {
          window.removeEventListener('resize', matchHeight);
        });
      }
    }
  }
])

.directive('scrollToBottom', [
  function() {
    return {
      restrict: 'AC',
      link: function(scope, element, attrs) {
        setTimeout(function() {
          element[0].scrollTop = element[0].scrollHeight;
        }, 150);
      }
    }
  }
])

.directive('elkeComments', [
  '$feathers',
  '$document',
  function($feathers, $document) {
    return {
      restrict: 'A',
      scope: {
        'streaming': '=elkeComments'
      },
      templateUrl: '/views/stream/comments.html',
      link: function(scope, element, attrs) {
        var commentList = element[0].querySelector('.comment-list');
        var service = $feathers.service('comments');
        scope.newComment = {
          streamingId: scope.streaming.id
        };
        scope.comments = [];
        service.find({
          query: {
            streamingId: scope.streaming.id.toString(),
            $sort: { createdAt: -1 },
            $limit: 10
          }
        }).then(function(res) {
          scope.$apply(function() {
            scope.comments = res.data;
          });
        }).catch(function(err) {
          console.error('Could not retrieve comments', err);
        });
        service.on('created', function(data) {
          var scrollToBottom = false;
          scope.$apply(function() {
            if(data.streamingId == scope.streaming.id) {
              var totalScroll = commentList.clientHeight + commentList.scrollTop;
              if(commentList.scrollHeight - totalScroll < 60)
                scrollToBottom = true;
              scope.comments.push(data);
              setTimeout(function() {
                if(scrollToBottom) {
                  commentList.scrollTop = commentList.scrollHeight;
                }
              }, 50);
            }
          });
        });
        scope.sendComment = function() {
          service.create(scope.newComment).then(function() {
            scope.newComment.comment = '';
            document.getElementById('comment-field').focus();
          });
        }
      }
    };
  }
]);
