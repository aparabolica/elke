'use strict';

const crypto = require('crypto');

// Add any common hooks you want to share across services in here.
//
// Below is an example of how a hook is written and exported. Please
// see http://docs.feathersjs.com/hooks/readme.html for more details
// on hooks.

exports.createRandom = (property = false, numBytes = 20) => hook => {
  if(property)
    hook.data[property] = crypto.randomBytes(numBytes).toString('hex');
  return hook;
};

exports.loggedIn = () => hook => !!hook.params.user;
