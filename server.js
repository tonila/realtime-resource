'use strict';
//var fs = require('fs');
var db = new (require('./modules/mongodb'))('127.0.0.1:27017/RealRecord');
if (process.env.NODE_ENV !== 'production') {
  if (!process.env.DEBUG) {
    process.env.DEBUG = 'server:*';
  }
}

function handler (/*req, res*/) {
  /*fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });*/
}

var app = require('http').createServer(handler);
var io = require('socket.io')(app);
/*io.on('connection', function (socket) {
  console.log('connection');
  socket.on('create', function (data) {
    console.log('create');
    db.save('collection', data);
  });
});*/
function createListener(name) {
  io.of(name)
  .on('connection', function (socket) {
    console.log('connection ' + name);
    socket.on('save', function (data, cb) {
      console.log('save test');
      db.save(name, data).nodeify(function(err, res) {
        cb(err, res);
        if (!err) {
          socket.broadcast.emit('value', res);
        }
      });
    });
    socket.on('get', function (data, cb) {
      console.log('get test');
      db.get(name, data).nodeify(cb);
    });
  });
}

createListener('test');

app.listen(3000, function() {
  console.log('server listening in 3000');
});

