'use strict';
/* global define*/

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
  var url = 'http://localhost:3000/';
  //var EventEmitter = require('event-emitter');
  var io = require('socket.io-client');

  function Record(name, socket, data) {
    this._shallowClearAndCopy = function(src, des) {
      for (var key in src) {
        var o = src[key];
        if (src.hasOwnProperty(key) &&
            typeof o !== 'object' &&
            typeof o !== 'function' &&
            (key === '_id' ||
             key.charAt(0) !== '_')) {
          des[key] = o;
        }
      }
    }
    this._name = name;
    this._shallowClearAndCopy(data || {}, this);
    this._socket = socket;
  }

  Record.prototype.save = function (callback) {
    var data = {};
    this._shallowClearAndCopy(this, data);
    this._socket.emit('save', data, function(err, res) {
      if (callback) {
        callback(err, res);
      }
    });
  }

  Record.prototype.remove = function (callback) {
    if (!this._id) {
      throw "can't remove record without id";
    }
    this._socket.emit('remove', this._id, function(err, res) {
      if (callback) {
        callback(err, res);
      }
    });
  }

  //Record.prototype = new EventEmitter();

  function Resource(name) {
    var l = this._listeners = {save:[], remove:[]};
    this._name = name;
    this._socket = io.connect(url + this._name);
    this._socket.on('save', function(data) {
      for (var i = 0, len = l.save.length; i < len; i++) {
        l.save[i](data);
      }
    });
    this._socket.on('remove', function(id) {
      for (var i = 0, len = l.remove.length; i < len; i++) {
        l.remove[i](id);
      }
    });
  }

  Resource.prototype.get = function (data, callback) {
    var req = this;
    this._socket.emit('get', data, function(err, res) {
      if (callback) {
        var result;
        if (typeof res === 'object') {
          result = [];
          for (var i = 0, len = res.length; i < len; i++) {
            result.push(new Record(req._name, req._socket, res[i]));
          }
        }
        callback(err, result);
      }
    });
  };

  Resource.prototype.create = function (data) {
    return new Record(this._name, this._socket, data);
  };

  Resource.prototype.on = function (name, callback) {
    if (name !== 'save' && name !== 'remove') {
      throw 'listener ' + name + ' is not supported';
    }
    this._listeners[name].push(callback);
  };

  Resource.prototype.removeListener = function (name, fn) {
    var l = this._listeners[name];
    if (!l) {
      return;
    }
    var i, len = l.length;
    for (i = 0; i < len; i++) {
      if (fn === l[i]) {
        l.splice(i, 1);
        break;
      }
    }
  };

  Resource.prototype.removeListeners = function () {
    this._listeners.save = [];
    this._listeners.remove = [];
  };

  Resource.prototype.disconnect = function () {
    this._socket.disconnect();
  };


  /*
function Api() {
  var api = this;
  api.createRecord = function(name) {
    return new Record(name);
  }
}
Api.prototype = new EventEmitter();
*/
  return Resource;
}));
