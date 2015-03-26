'use strict';
//var fs = require('fs');

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
io.on('connection', function (socket) {
  console.log('connection');
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
app.listen(3000, function() {
  console.log('server listening in 3000');
});

