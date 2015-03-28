'use strict';
//var fs = require('fs');
var db = new (require('./modules/mongodb'))('127.0.0.1:27017/RealRecord');
if (process.env.NODE_ENV !== 'production') {
  if (!process.env.DEBUG) {
    process.env.DEBUG = 'server:*';
  }
}

var app = require('http').createServer(function (/*req, res*/) {});
var io = require('socket.io')(app);
function createListener(name) {
  var room = io.of(name)
  .on('connection', function (socket) {
    console.log('connection ' + name);
    socket.on('save', function (data, cb) {
      //console.log('save test');
      db.save(name, data).nodeify(function(err, res) {
        cb(err, res);
        if (!err) {
          //socket.broadcast.emit('save', data);
          room.emit('save', data);
        }
      });
    });
    socket.on('get', function (data, cb) {
      //console.log('get test');
      db.get(name, data).nodeify(cb);
    });
    socket.on('remove', function (id, cb) {
      //console.log('remove test', id);
      db.remove(name, id).nodeify(function(err) {
        cb(err);
        if (!err) {
          //socket.broadcast.emit('remove', id);
          room.emit('remove', id);
        }
      });
    });
  });
}

createListener('test');
createListener('perf');

app.listen(3000, function() {
  console.log('server listening in 3000');
});

