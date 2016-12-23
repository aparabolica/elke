angular.module('elke', [
  'ui.router',
  'ngFeathers'
])

.run([
  '$rootScope',
  '$state',
  '$feathers',
  function($rootScope, $state, $feathers) {
    $feathers.authenticate().then($rootScope.digest);
  }
]);

angular.element(document).ready(function() {
  if(self != top) {
    angular.element('body').addClass('iframe');
  }
  angular.bootstrap(document, ['elke']);
  angular.element(document.body).css({display:'block'});
});
