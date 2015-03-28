'use strict';
/* jshint jasmine: true */

var Resource = require('../resource');
var tests, perf, perfs;

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

describe('resource tests', function() {
  beforeEach(function() {
    this.addMatchers(matchers);
  });
  it("should save 1000 record", function(done) {
    var reqs = 0;
    var cb = function(err) {
      reqs--;
      expect(err).toBeFalsy();
      if (reqs === 0) {
        done();
      }
    }
    var perf = new Resource('perf');
    for (var i = 0; i < 1000; i++) {
      reqs++;
      var p = perf.create({no: i});
      p.save(cb);
    }
  });
  it("should get 1000 records", function(done) {
    perf = new Resource('perf');
    perf.get({}, function(err, res) {
      expect(err).toBeFalsy();
      console.log('length', res.length);
      perfs = res;
      done();
    });
  });
  it("should receive events on update", function(done) {
    var j = 0;
    var fn = function(err, data) {
      console.log(err, data);
      j++;
      if (j === 1000) {
        done();
        perf.removeListener('save', fn);
      }
    }
    perf.on('save', fn);
    for (var i = 0, len = perfs.length; i < len; i++) {
      perfs[i].tsst = 'tsst';
      perfs[i].save();
    }
  });
  it("should update 1000 records", function(done) {
    var reqs = 0;
    var cb = function(err) {
      reqs--;
      expect(err).toBeFalsy();
      if (reqs === 0) {
        done();
      }
    }
    for (var i = 0, len = perfs.length; i < len; i++) {
      reqs++;
      perfs[i].five = 'six';
      perfs[i].save(cb);
    }
  });
  it("should remove 1000 records", function(done) {
    var reqs = 0;
    var cb = function(err) {
      reqs--;
      expect(err).toBeFalsy();
      if (reqs === 0) {
        done();
      }
    }
    for (var i = 0, len = perfs.length; i < len; i++) {
      reqs++;
      perfs[i].remove(cb);
    }
  });
  it("should disconnect resource", function() {
    perf.disconnect();
  });
});
