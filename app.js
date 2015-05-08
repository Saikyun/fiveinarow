'use strict';

var app = require('express')();
var socketio = require('socket.io');
var loadEvents = require('./load_events.js');
var events = require('./events.js');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/js/bundle.js', function(req, res) {
	res.sendFile(__dirname + '/public/js/bundle.js');
});

var server = app.listen(3000, function() {
	console.log('listening on 127.0.0.1:3000');
});

var io = socketio(server);

var moves = [];

io.on('connection', function(socket) {
	console.log('someone connected', socket.id);
	
	loadEvents(socket, events(function error(message) {
		socket.emit('error_message', message);
	},
	function() { return moves; },
	function(newMoves) { moves = newMoves; socket.emit('moves', {moves: moves} ); }));
	
	socket.on('disconnect', function() {
		console.log('someone disconnected', socket.id);
	});
});