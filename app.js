'use strict';

var app = require('express')();
var socketio = require('socket.io');
var ruleCheckerFactory = require('rule_checker');

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

var data = require('./game_specific/data.js');

io.on('connection', function(socket) {
	console.log('someone connected', socket.id);

	socket.emit('moves', {moves: data.get('moves')} );
	
	var events = require('./game_specific/events.js')(
		function() { return data.get('moves'); },
		function(newMoves) {
			data.set('moves', newMoves);
			socket.emit('moves', {moves: data.get('moves')} );
		}
	);
	
	var rules = require('./game_specific/rules.js');
	
	var ruleChecker = ruleCheckerFactory();
	
	events.forEach(function(event) {
		ruleChecker.addEvent(
			event,
			rules[event.name],
			function(event, callback) { socket.on(event, callback); },
			function error(message) {
				socket.emit('error_message', message);
			},
			data
		);
	});
	
	socket.on('disconnect', function() {
		console.log('someone disconnected', socket.id);
	});
});