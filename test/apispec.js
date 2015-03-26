'use strict';
/* jshint jasmine: true */

var Api = require('../api');
var tests;

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

/*var promiseHandler = function(promise, done) {
  promise.then(function() {
    done();
  }).catch(function(err) {
    expect(err).toBeFalsy();
    done();
  });
}*/

describe('api tests', function() {
  beforeEach(function() {
    this.addMatchers(matchers);
  });

  /*it("should connect", function(done) {
    api = new Api();
    console.log(api)
    api.on('connect', function() {
      done();
    });
  });*/
  /*it("should save record", function(done) {
    var test = new Api('test', {'one': 'two'});
    test.save(function(err) {
      expect(err).toBeFalsy();
      done();
    });
  });*/
  it("should get records", function(done) {
    var test = new Api('test');
    test.get({}, function(err, res) {
      expect(err).toBeFalsy();
      //console.log(res);
      tests = res;
      done();
    });
  });
  it("should update all record", function(done) {
    var reqs = 0;
    var cb = function(err) {
      reqs--;
      expect(err).toBeFalsy();
      if (reqs === 0) {
        done();
      }
    }
    for (var i = 0, len = tests.length; i < len; i++) {
      reqs++;
      tests[i].five = 'six';
      tests[i].save(cb);
    }
  });
});
