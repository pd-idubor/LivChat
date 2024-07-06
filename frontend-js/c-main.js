import sth from './server.js';
const activeUsers = new Set();
const data = req.userId;

//Functionalities

io.on('connection', function(socket) {
    console.log('Made socket connection...');

    socket.on('new user', function(data) {
        socket.userId = data;
        activeUsers.add(data);
        io.emit('new user', [...activeUsers]);
    });

    socket.on('disconnect', () => {
        activeUsers.delete(socket.userId);
        io.emit('user is inactive', socket.userId);
    });

    //Broadcast user message
    socket.on('chat message', function(data) {
        io.emit('chat message', data);
    });

    socket.on('typing', function(data) {
        socket.broadcast.emit('typing', data);
    });
});