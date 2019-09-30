/** BEGIN connect to neurosky **/
var thinkgear = require('./neurosky_socket');

var client = thinkgear.createClient({ enableRawOutput: false });

const broadcastEvent = name => client.on(name, data => {
	wss.broadcast({ name, ...data });
});

['meditation', 'attention', 'blink', 'signal', 'status'].forEach(broadcastEvent);

// initiate connection
client.connect();
/** END connect to neurosky **/

/** BEGIN start our websocket server **/
// start websocket server to broadcast
var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({port: 8080});

const clients = []

// broadcast function (broadcasts message to all clients)
wss.broadcast = function(data) {
	const msg =  JSON.stringify(data);
	clients.forEach(x => x.send(msg));
};

// bind each connection
wss.on('connection', function(ws) {
	clients.push(ws)

    ws.on('message', function(message) {
        console.log('[Websocket][CLIENT] %s', message);
	});
	
	console.log('[Websocket] Listening on port 8080');
});
/** END start our websocket server **/

module.exports = {
	client: client,
	wss: wss
};