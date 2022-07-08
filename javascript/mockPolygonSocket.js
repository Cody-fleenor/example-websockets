import { WebSocketServer } from 'ws';

const port = process.env.PORT || 9000
const host = process.env.HTTP_HOST || 'localhost'

const mockPacket = "Data"

const server = new WebSocketServer({
    host: host,
    port: port
  });

console.log('Mock server started on port ' + port + ' on host ' + host);

let connections = [];
let directory = { 
    stockUpdates: { subscribers: [] },
    newsUpdates: { subscribers: [] }
};

const addSubscriber = (subscriber, topic) => {
    console.log('Adding subscriber ' + subscriber)
    if (directory[topic]) {
        if(!directory[topic]['subscribers'].includes(subscriber)) {
            directory[topic]['subscribers'].push(subscriber);
            console.log('Added subscriber ' + subscriber + ' to topic ' + topic);
        }
    }
}

const removeSubscriber = (subscriber, topic) => {
    console.log('Removing subscriber ' + subscriber)
    if (directory[topic]) {
        if(directory[topic]['subscribers'].includes(subscriber)) {
            directory[topic]['subscribers'] =  directory[topic]['subscribers'].filter(id => id !== subscriber);
            console.log('Removed subscriber ' + subscriber + ' from topic ' + topic);
        }
    }
}

const handleMessage = (connection, message) => {
    if (message.type === 'subscribe') {
        try {
            addSubscriber(connection, message.topic)
            sendMessage(connection, 'success', 'Subscribed to topic ' + message.topic)
        } catch (error) {
            sendMessage(connection, 'error', 'There was a problem subscribing to the topic ' + message.topic)
        }
    }
    else if (message.type === 'unsubscribe') {
        try {
            removeSubscriber(connection, message.topic)
            sendMessage(connection, 'success', 'Removed from topic ' + message.topic)
        } catch (error) {
            sendMessage(connection, 'error', 'There was a problem removing the topic ' + message.topic)
        }
    }
    else if (message.type === 'say_hello'){
        try {
            sendMessage(connection,  'say_hello', 'hello world')
        } catch (error) {
            sendMessage(connection, 'error', 'There was a problem responding ')
        }
    }
}

const sendMessage = (connection, type, message) => {
    if (connection && message) {
        console.log('Attempting to send message to ' + connection + ': ' + message)
        connection.send(JSON.stringify({type: type, message: message}))
    }
}

server.on('connection', (connection) => {
    if (connections.length > 0) {
        setTimeout(() => {
            connections.forEach(connection => connection.send(mockPacket))
        }, 10);
    }
    connections.push(connection);
    connection.on('open', () => {
        console.log('Connection opened ' + connection)
        connection.send('connection established')
    })
    connection.on('close', () => {
        connections = connections.filter(id => id !== connection)
    })
})