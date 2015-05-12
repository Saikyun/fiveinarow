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

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
	console.log('listening on 127.0.0.1:' + port);
});

var io = socketio(server);

var data = require('./game_specific/data.js');

var sendMoves = function(socket, data, doSet) {
	socket.emit('moves', { moves: data.get('moves') });
			
	var result = require('./game_specific/check_winner.js')(data.get('moves'));
	
	if (result === -1) {
		console.log('it\'s a draw!');
	} else if (result !== false) {
		console.log('player %n won!', result);
		socket.emit('winner', result);
		
		var timeout = setTimeout(function() { if (doSet) {data.set('moves', []);} sendMoves(socket, data, true); clearTimeout(timeout); }, 5000);
	}
}

io.on('connection', function(socket) {
	console.log('someone connected', socket.id);

	sendMoves(socket, data, false);
	
	var events = require('./game_specific/events.js')(
		function() { return data.get('moves'); },
		function(newMoves) {
			data.set('moves', newMoves);
			sendMoves(socket, data, true);
		},
		socket
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