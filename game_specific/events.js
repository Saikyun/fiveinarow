'use strict';

var curry = require('sai_curry');

var pushMove = function(getMoves, setMoves, move) {
	var moves = getMoves();
	moves.push(move);
	setMoves(moves);
	console.log('the move', move, 'was made!');
	console.log(getMoves());
};

module.exports = function(getMoves, setMoves) {
	return [
		{
			name: 'move',
			func: curry(pushMove,
				getMoves,
				setMoves
			)
		}
	];
};