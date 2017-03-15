'use strict';

const replaceItems = require('feathers-hooks-common/lib/utils').replaceItems;
const errors = require('feathers-errors');

const publicStatuses = ['streaming', 'encoding', 'encoded'];

module.exports = () => hook => {
  if(hook.type === 'after') {
    if(hook.method === 'find') {
      replaceItems(hook, hook.result.data.filter(current =>
        publicStatuses.indexOf(current.status) !== -1
      ));
    } else if(hook.method === 'get') {
      if(
        hook.result.status &&
        publicStatuses.indexOf(hook.result.status) === -1
      ) {
        throw new errors.Forbidden('You are not authorized to access this content');
      }
    }
  }
  return hook;
};
