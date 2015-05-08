'use strict';

var app = require('express')();
var socketio = require('socket.io');
var ruleChecker = require('./rule_checker');

var curry = require('sai_curry');

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
	
	var events = require('./game_specific/events.js')(
		function() { return moves; },
		function(newMoves) {
			moves = newMoves;
			socket.emit('moves', {moves: moves} );
		}
	);
	var rules = require('./game_specific/rules.js');
	var ruleChecker = require('./rule_checker')();
	
	events.forEach(function(event) {
		ruleChecker.addEvent(
			function(event, callback) { socket.on(event, callback); },
			event,
			rules[event.name], 
			function error(message) {
				socket.emit('error_message', message);
			}
		);
	});
	
	socket.on('disconnect', function() {
		console.log('someone disconnected', socket.id);
	});
});