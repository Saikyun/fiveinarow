var socketio = require('socket.io-client');

var socket = socketio();
var test = require('rule_checker/test.js');
var rules = require('./../game_specific/rules.js');

window.curry = require('sai_curry');

window.socket = socket;

socket.on('connect', function() {
	console.log('connected!');
});

socket.on('error_message', function(message) {
	console.warn(message);
});

socket.on('moves', function(obj) {
	data.set('moves', obj.moves);
	renderMoves(data.get('moves'));
});

function renderMoves(moves) {
	var html = '';
	moves.forEach(function(move) {
		html += '<div style="position: absolute; left: ' + move.x * 51 + 'px; top: ' + move.y * 51 + 'px; width: 50px; height: 50px; background-color: #00FF00;">';
		html += move.player;
		html += '</div>';
	});
	
	document.body.innerHTML = html;
}

function makeMove(x, y, player) {
	var move = {x: x, y: y, player: player};
	
	runEvent('move', socket, move);
}

var data = require('./../game_specific/data.js');

function displayError(text) {
	renderMoves(data.get('moves'));
	document.body.innerHTML += '<h3 style="position: absolute; bottom: 5px; color: red;">' + text + '</h3>';
}

function runEvent(event, socket, obj) {
	if (test(rules[event], obj, data, displayError)) {
		socket.emit(event, obj);
	}
}

window.makeMove = makeMove;