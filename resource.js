'use strict';

var url = 'http://localhost:3000/';
var io = require('socket.io-client');

function Record(name, socket, data) {
  this.$shallowClearAndCopy = function(src, des) {
    for (var key in src) {
      var o = src[key];
      if (src.hasOwnProperty(key) &&
          typeof o !== 'object' &&
          typeof o !== 'function' &&
          key.charAt(0) !== '$') {
        des[key] = o;
      }
    }
  }
  this.$name = name;
  this.$shallowClearAndCopy(data || {}, this);
  this.$socket = socket;
}

Record.prototype.save = function (callback) {
  var rec = this;
  var data = {};
  this.$shallowClearAndCopy(this, data);
  this.$socket.emit('save', data, function(err, res) {
    rec._id = res._id;
    if (callback) {
      callback(err, res);
    }
  });
}

Record.prototype.remove = function (callback) {
  if (!this._id) {
    throw "can't remove record without id";
  }
  this.$socket.emit('remove', this._id, function(err, res) {
    if (callback) {
      callback(err, res);
    }
  });
}

//Record.prototype = new EventEmitter();

function Resource(name) {
  var reso = this;
  var l = reso.$listeners = {save:[], remove:[]};
  reso.$name = name;
  reso.$socket = io.connect(url + reso.$name);
  reso.$socket.on('save', function(err, data) {
    for (var i = 0, len = l.save.length; i < len; i++) {
      l.save[i](err, reso.create(data));
    }
  });
  reso.$socket.on('remove', function(err, id) {
    for (var i = 0, len = l.remove.length; i < len; i++) {
      l.remove[i](err, id);
    }
  });
}

Resource.prototype.get = function (data, callback) {
  var reso = this;
  this.$socket.emit('get', data, function(err, res) {
    if (callback) {
      var result;
      if (typeof res === 'object') {
        result = [];
        for (var i = 0, len = res.length; i < len; i++) {
          result.push(new Record(reso.$name, reso.$socket, res[i]));
        }
      }
      callback(err, result);
    }
  });
};

Resource.prototype.create = function (data) {
  return new Record(this.$name, this.$socket, data);
};

Resource.prototype.on = function (name, callback) {
  if (name !== 'save' && name !== 'remove') {
    throw 'listener ' + name + ' is not supported';
  }
  this.$listeners[name].push(callback);
};

Resource.prototype.removeListener = function (name, fn) {
  var l = this.$listeners[name];
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
  this.$listeners.save = [];
  this.$listeners.remove = [];
};

Resource.prototype.disconnect = function () {
  this.$socket.disconnect();
};

module.exports = Resource;
