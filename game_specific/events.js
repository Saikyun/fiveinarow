'use strict';

var curry = require('sai_curry');
var checkWinner = require('./check_winner.js');

var pushMove = function(getMoves, setMoves, socket, move) {
	var moves = getMoves();
	moves.push(move);
	setMoves(moves);
};

module.exports = function(getMoves, setMoves, socket) {
	return [
		{
			name: 'move',
			func: curry(
				pushMove,
				getMoves,
				setMoves,
				socket
			)
		}
	];
};