'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('streaming service', function() {
  it('registered the streamings service', () => {
    assert.ok(app.service('streamings'));
  });
});
