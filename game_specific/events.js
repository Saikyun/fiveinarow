'use strict';

var curry = require('sai_curry');

var pushMove = function(getMoves, setMoves, socket, move) {
	var moves = getMoves();
	moves.push(move);
	setMoves(moves);
};

module.exports = function(setPlayer, getMoves, setMoves, socket) {
	return [
		{
			name: 'move',
			before: setPlayer,
			after: curry(
				pushMove,
				getMoves,
				setMoves,
				socket
			)
		}
	];
};