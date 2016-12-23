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
      '$feathers',
      function($feathers) {
        return $feathers.authenticate();
      }
    ];

    $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
    });
    $locationProvider.hashPrefix('!');

    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/views/home.html',
    })
    .state('auth', {
      url: '/auth/',
      controller: 'AuthCtrl',
      templateUrl: '/views/auth.html'
    })
    .state('stream', {
      url: '/streams/:id',
      controller: 'StreamCtrl',
      templateUrl: '/views/stream/single.html',
      resolve: {
        Auth: auth
      }
    })
    .state('streamEdit', {
      url: '/streams/edit/?id',
      controller: 'StreamCtrl',
      templateUrl: '/views/stream/edit.html',
      resolve: {
        Auth: auth
      }
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
