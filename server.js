const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.on('message', (message) => {
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('join', (login) => {
    users.push(login);
    socket.broadcast.emit('newUser', { author: 'Chat Bot', content: `<i>${login.name} has joined the conversation!</i>`});
  });

  socket.on('disconnect', () => {
    const user = users.find(obj => obj.id === socket.id);
    const index = users.indexOf(user);
    users.splice(index, 1);
    if(user) {socket.broadcast.emit('removeUser', { author: 'Chat Bot', content: `<i>${user.name} has left the conversation... :(</i>` })};
  });
});