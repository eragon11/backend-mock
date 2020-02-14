let socket_io = require('socket.io');
class AutoUpdate {
    constructor(server) {
        this.server = server;
    }
    intialize() {
        console.log("initialization in progress");
        var io = new socket_io(this.server, {
            path: '/vzupdate'
        });
        io.on('connection', function (socket) {
            console.log('Connection received');
            socket.emit('news', { hello: 'world' });
            socket.on('my other event', function (data) {
                console.log(data);
            });
            socket.on('Test', (data) => {
                console.log(data)
            })
            socket.on('disconnect', () => {
                console.log('User disconnected');
            })
        });
        
    }
}


export default AutoUpdate;