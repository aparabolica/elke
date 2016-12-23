'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('streamings service', function() {
  it('registered the streamings service', () => {
    assert.ok(app.service('streamings'));
  });
});
