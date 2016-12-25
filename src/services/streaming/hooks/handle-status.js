'use strict';

const errors = require('feathers-errors');

module.exports = (options = {}) => hook => {
  const streamingService = hook.app.service('streamings');
  if(hook.data.status) {
    return streamingService.get(hook.id).then(streaming => {
      if(streaming.status == 'finished' && hook.data.status !== 'finished') {
        throw new errors.BadRequest('Finished streamings cannot change their status');
      } else if(streaming.status == 'live') {
        if(hook.data.status == 'pending') {
          throw new errors.BadRequest('Live streamings cannot go back to pending status');
        }
      }
      return hook;
    });
  } else {
    return hook;
  }
}
