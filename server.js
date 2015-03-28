'use strict';
//var fs = require('fs');
var db = new (require('./modules/mongodb'))('127.0.0.1:27017/RealRecord');
if (process.env.NODE_ENV !== 'production') {
  if (!process.env.DEBUG) {
    process.env.DEBUG = 'server:*';
  }
}

function handler (/*req, res*/) {}

var app = require('http').createServer(handler);
var io = require('socket.io')(app);
function createListener(name) {
  io.of(name)
  .on('connection', function (socket) {
    console.log('connection ' + name);
    socket.on('save', function (data, cb) {
      //console.log('save test');
      db.save(name, data).nodeify(function(err, res) {
        cb(err, res);
        if (!err) {
          socket.broadcast.emit('value', res);
        }
      });
    });
    socket.on('get', function (data, cb) {
      //console.log('get test');
      db.get(name, data).nodeify(cb);
    });
    socket.on('remove', function (id, cb) {
      //console.log('remove test', id);
      db.remove(name, id).nodeify(cb);
    });
  });
}

createListener('test');
createListener('perf');

app.listen(3000, function() {
  console.log('server listening in 3000');
});

