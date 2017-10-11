const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// read the client html file into memory
const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html'});
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);

// io Server
const io = socketio(app);

// iterator for updating text
let drawStack = [];

io.on('connection', (socket) => {
   // Join the Room
   socket.join('room1');
   
   // When they add a square to the draw stack, broadcast it.
   socket.on('newsquare', (data) => {
       drawStack.push(data);
      io.sockets.in('room1').emit('updateDraw', drawStack);
   });
   
   // When they disconnect, leave the room
   socket.on('disconnect', () => {
      socket.leave('room1'); 
   });
    
    // broadcast the current drawstack
    socket.emit('updateDraw', drawStack);
});