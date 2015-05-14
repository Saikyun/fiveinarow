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

function getGame(player, games) {
	return games.filter(function(game) { return game.player1 === player || game.player2 === player; })[0];
}

function emitToPlayers(game, event, obj) {
	if (clients[game.player1]) {
		clients[game.player1].emit(event, obj);	
	}
	
	if (clients[game.player2]) {
		clients[game.player2].emit(event, obj);	
	}
}

function sendMoves(socket, data) {
	var game = getGame(socket.id, data.get('games'));
	emitToPlayers(game, 'moves', game);
			
	var result = require('./game_specific/check_winner.js')(game.moves, data.get('size'));
	
	if (result !== false) {
		if (result === -1) {
			console.log('it\'s a draw!');
		} else {
			console.log('player %n won!', result);
		}
		
		emitToPlayers(game, 'winner', result);
	}
}

var clients = {};

function getPlayer(id, game) {
	if (game.player1 === id) {
		return 1;
	} else if (game.player2 === id) {
		return 2;
	}
	
	throw new Error('player with id ' + id + ' doesn\'t belong in game ' + game);
}

function getOpponent(id, game) {
	var player = getPlayer(id, game);
	
	return player === 1 ? 2 : 1;
}

io.on('connection', function(socket) {
	clients[socket.id] = socket;
	
	console.log('someone connected', socket.id);
	
	var games = data.get('games');
	var game = null;
	
	if (games.length === 0 || games[games.length - 1].player2 !== null) {
		game = {
			player1: socket.id,
			player2: null,
			moves: []
		};
		games.push(game);
		data.set('games', games);
	} else {
		game = games[games.length - 1];
		game.player2 = socket.id;
		games[games.length - 1] = game;
		data.set('games', games);
	}

	socket.emit('me', getPlayer(socket.id, game));
	sendMoves(socket, data);
	
	var events = require('./game_specific/events.js')(
		function(move) { move.player = getPlayer(socket.id, game); return move; },
		function() { return getGame(socket.id, data.get('games')).moves; },
		function(newMoves) {
			var games = data.get('games');
			var game = getGame(socket.id, games);
			game.moves = newMoves;
			games[games.indexOf(game)] = game;
			data.set('games', games);
			sendMoves(socket, data);
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
			{size: data.get('size'), moves: game.moves}
		);
	});
	
	socket.on('disconnect', function() {
		var games = data.get('games');
		var game = getGame(socket.id, games);
		
		var opponent = getOpponent(socket.id, game);
		var opponentClient = clients[game['player' + opponent]];
		if (opponentClient) {
			console.log('notified');
			opponentClient.emit('notify', 'your opponent has disconnected.');
		} else {
			game['player' + opponent] = -1;			
		}
		console.log('someone disconnected', socket.id);
		
		games[games.indexOf(game)] = game;
		data.set('games', games);
	});
});