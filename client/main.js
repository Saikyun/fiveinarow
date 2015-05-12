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

socket.on('notify', displayError);

socket.on('me', function(player) {
	data.set('me', player);
})

socket.on('moves', function(obj) {
	data.set('moves', obj.moves);

	if (obj.player2 === null) {
		displayWinner('waiting for opponent');
	} else {
		var moves = data.get('moves');
		var player = moves.length === 0 || moves[moves.length - 1].player === 2 ? 1 : 2;
	
		if (data.get('me') === player) {
			displayWinner('your turn');
		} else {
			displayWinner('your opponent\'s turn');
		}
	}
});

socket.on('winner', function(result) {
	data.set('winner', result);
	if (result === -1) {
		displayWinner('it\'s a draw!!! refresh to join a new game!');
	} else {
		displayWinner('the winner is player ' + colors['player' + result] + '!!!! refresh to start a new game!');		
	}
});

var colors = {
	player1: 'green',
	player2: 'red',
	empty: '#3c3c3c'
}

function renderMoves(moves) {
	var board = [];
	
	var size = data.get('size');
	
	for (var i = 0; i < size.width * size.height; i++) {
		board[i] = null;
	}
	
	var html = '';
	moves.forEach(function(move) {
		html += '<div style="background-color: ' + colors['player' + move.player] + ';position: absolute; left: ' + move.x * 51 + 'px; top: ' + move.y * 51 + 'px; width: 50px; height: 50px;">';
		//html += move.player;
		html += '</div>';
		board[move.y * size.width + move.x] = move;
	});
	
	var player = moves.length === 0 || moves[moves.length - 1].player === 2 ? 1 : 2;

	
	board.forEach(function(move, i) {
		if (move !== null) {
			return;
		}
		
		var x = i % size.width;
		var y = Math.floor(i / size.width);
		var onclick = '';
		if (data.get('me') === player) {
			onclick = 'onclick="makeMove(' + x + ', ' + y + ', ' + player + ');"';
		}
		
		html += '<div ' + onclick + ' style="background-color: ' + colors['empty'] + '; position: absolute; left: ' + x * 51 + 'px; top: ' + y * 51 + 'px; width: 50px; height: 50px;">';
		//html += '_';
		html += '</div>';
	});
	
	document.body.innerHTML = html;
}

function makeMove(x, y, player) {
	var move = {x: x, y: y, player: player};
	
	if (runEvent('move', socket, move)) {
		var moves = data.get('moves');
		moves.push(move);
		data.set('moves', moves);
		
		renderMoves(moves);
	}
}

var data = require('./../game_specific/data.js');

function displayError(text) {
	renderMoves(data.get('moves'));
	document.body.innerHTML += '<h3 style="position: absolute; bottom: 5px; color: red;">' + text + '</h3>';
}

function displayWinner(text) {
	renderMoves(data.get('moves'));
	document.body.innerHTML += '<h1 style="position: absolute; bottom: 5px; color: green;">' + text + '</h1>';
}

function runEvent(event, socket, obj) {
	if (test(rules[event], obj, {moves: data.get('moves'), size: data.get('size')}, displayError)) {
		socket.emit(event, obj);
		return true;
	}
	
	return false;
}

window.makeMove = makeMove;