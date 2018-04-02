/* API SERVER */

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);


const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://root:12345@ds231199.mlab.com:31199/loft-school-node');

require('./models/user');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ type: 'text/plain' }));

app.use('/api', require('./routes/index'));

app.get('*', function (req, res) {
  res.send(fs.readFileSync(path.resolve(path.join('public', 'index.html')), 'utf8'));
});

app.use((req, res, next) => {
  res.status(404).json({err: '404'});
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({err: '500'});
});

server.listen(3000, function() {
  console.log('Server is running on port 3000');
});

/* SOCKET SERVER */

const io = require('socket.io').listen(server);

const sockets = {}

io.sockets.on('connection', (socket) => {
  const socketData = {
    id: socket.id,
    username: socket.handshake.headers.username
  };
  sockets[socket.id] = socketData;
  socket.emit('all users', sockets);
  socket.broadcast.emit('new user', socketData);

  socket.on('chat message', (message, targetUser) => {
    socket.broadcast
      .to(targetUser)
      .emit('chat message', message, socket.id);
  });

  socket.on('disconnect',  () => {
    delete sockets[socket.id];
    socket.broadcast.emit('delete user', socket.id);
  });
});
