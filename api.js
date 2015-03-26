'use strict';
/* global define*/
var url = 'http://localhost:3000';
var EventEmitter = require('event-emitter');
/*var Q = require('q');
var util = require('util');*/

function Query() {

}

function Get() {

}

function Save() {

}

function Delete() {

}

function RealRecord(url /*url, paramDefaults, actions, options*/) {
  var rec = this;
  rec.query = new Query(url);
  rec.get = new Get(url);
  rec.save = new Save(url);
  rec.update = new Save(url);
  rec.delete = new Delete(url);
}
RealRecord.prototype = new EventEmitter();

function Api() {
  var api = this;
  api.RealRecord = RealRecord;
  var socket = require('socket.io-client')(url);
  socket.on('connect', function() {
    console.log('connect')
    api.emit('connect');
  });

  /*socket.on('event', function(data) {
    api.emit('event', data);
  });*/

  socket.on('disconnect', function() {
    api.emit('disconnect');
  });
  api.createRecord = function(name) {
    return new RealRecord(name);
  }
}
Api.prototype = new EventEmitter();

// UMD pattern
// https://github.com/umdjs/umd
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
  // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
  // Node. Does not work with strict CommonJS, but
  // only CommonJS-like environments that support module.exports,
  // like Node.
    module.exports = factory();
  } else {
  // Browser globals (root is window)
    root.returnExports = factory();
  }
  /* jshint validthis: true */
}(this, function() {
  return Api;
}));
