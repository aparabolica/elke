angular.module('elke')

.config([
  '$feathersProvider',
  function($feathersProvider) {
    $feathersProvider.setAuthStorage(window.localStorage);
    $feathersProvider.setEndpoint('');
    $feathersProvider.useSocket(true);
  }
])

.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  '$httpProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    var auth = [
      '$q',
      '$feathers',
      function($q, $feathers) {
        var deferred = $q.defer();
        $feathers.authenticate().then(function(res) {
          console.log(res);
          deferred.resolve(res);
        }).catch(function(err) {
          deferred.resolve(false);
        })
        return deferred.promise;
      }
    ];

    var isAuth = [
      '$q',
      'Auth',
      function($q, Auth) {
        if(Auth) {
          return true;
        } else {
          return $q.reject('Not logged in');
        }
      }
    ];

    $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
    });
    $locationProvider.hashPrefix('!');

    $stateProvider
    .state('main', {
      abstract: true,
      template: '<ui-view/>',
      resolve: {
        App: [
          '$http',
          function($http) {
            return $http.get('/app');
          }
        ],
        Auth: auth
      }
    })
    .state('main.home', {
      url: '/',
      templateUrl: '/views/home.html',
      controller: 'HomeCtrl',
      resolve: {
        Streamings: [
          '$feathers',
          'Auth',
          function($feathers) {
            return $feathers.service('streamings').find();
          }
        ]
      }
    })
    .state('main.auth', {
      url: '/auth/?register',
      controller: 'AuthCtrl',
      templateUrl: '/views/auth.html'
    })
    .state('main.streamEdit', {
      url: '/streams/edit/?id',
      controller: 'StreamCtrl',
      templateUrl: '/views/stream/edit.html',
      resolve: {
        isAuth: isAuth
      }
    })
    .state('main.stream', {
      url: '/streams/:id/',
      controller: 'StreamCtrl',
      templateUrl: '/views/stream/single.html'
    });

    /*
     * Trailing slash rule
     */
    $urlRouterProvider.rule(function($injector, $location) {
      var path = $location.path(),
      search = $location.search(),
      params;
      // check to see if the path already ends in '/'
      if (path[path.length - 1] === '/') {
        return;
      }
      // If there was no search string / query params, return with a `/`
      if (Object.keys(search).length === 0) {
        return path + '/';
      }
      // Otherwise build the search string and return a `/?` prefix
      params = [];
      angular.forEach(search, function(v, k){
        params.push(k + '=' + v);
      });
      return path + '/?' + params.join('&');
    });

  }
]);
