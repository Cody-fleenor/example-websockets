import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3000');
const stocketSocket = new WebSocket('ws://localhost:9000');

const sendMessage = (connection, type, message) => {
    if (connection && message) {
        console.log('Attempting to send message to ' + connection + ': ' + message)
        connection.send(JSON.stringify({type: type, message: message}))
    }
}

ws.on('open', function open() {
    sendMessage(ws, 'say_hello', 'I am saying hello')
    // ws.send(JSON.stringify(message))
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});

stocketSocket.on('open', function open() {
    console.log('connected successfully stock');
});

stocketSocket.on('message', function message(data) {
  console.log('from stock socket received: %s', data);
});