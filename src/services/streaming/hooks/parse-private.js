'use strict';

module.exports = () => hook => {
  // Check for logged in user and provider existance
  // (so it doesnt interfere with internal requests)
  if(!hook.params.user && hook.params.provider) {
    console.log('parsing private');
    hook.result = hook.result.filter(current =>
      current.status == 'streaming' ||
      current.status == 'encoding' ||
      current.status == 'encoded'
    );
  }
  return hook;
}
