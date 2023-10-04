import io from 'socket.io-client';

let socket = io('http://localhost:3000/');
socket.on('connect', function () {
  socket.emit('echo', {msg: 'Hello universe!'}, function (response) {
    console.log(response.msg);
    socket.disconnect();  // otherwise the node process keeps on running.
  });
});
