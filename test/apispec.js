'use strict';
/* jshint jasmine: true */

var Api = require('../api');
var api;
var matchers = {
  toBeInstanceOf: function(expected) {
    return this.actual instanceof expected && this.actual.length > 0;
  },
  toBeA: function(expected) {
    return typeof this.actual === expected;
  },
  toBeArray: function() {
    return Array.isArray(this.actual);
  },
  toBeObject: function() {
    return !Array.isArray(this.actual) && typeof this.actual === 'object';
  }
}

var promiseHandler = function(promise, done) {
  promise.then(function() {
    done();
  }).catch(function(err) {
    expect(err).toBeFalsy();
    done();
  });
}

describe('api tests', function() {
  beforeEach(function() {
    this.addMatchers(matchers);
  });

  it("should connect", function(done) {
    api = new Api();
    console.log(api)
    api.on('connect', function() {
      done();
    });
  });
  /*it("should get RealRecord", function(done) {
    var test = Api.createRecord('test');
    var promise = test.create({'one': 'two'});
    promiseHandler(promise, done);
  });*/
});
