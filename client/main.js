var socketio = require('socket.io-client');

var socket = socketio();
var test = require('./../rule_checker/test.js');
var rules = require('./../game_specific/rules.js');

window.socket = socket;

socket.on('connect', function() {
	console.log('connected!');
});

socket.on('error_message', function(message) {
	console.warn(message);
});

socket.on('moves', function(moves) {
	console.log('moves are', moves.moves);
});

function makeMove(x, y, player) {
	var move = {x: x, y: y, player: player};
	
	runEvent('move', socket, move);
}

function runEvent(event, socket, obj) {
	if (test(rules[event], obj)) {
		socket.emit(event, obj);
	}
}

window.makeMove = makeMove;