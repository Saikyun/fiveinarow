'use strict';

var rules = require('./rules.js');
var test = require('./test.js');
var isSet = require('./is_set.js');

var error;
var getMoves;
var setMoves;

var moveEvent = {
	name: 'move',
	precallback: function(move) {
		return test(rules[moveEvent.name], move, error);
	},
	callback: function(move) {
		if (isSet(moveEvent.precallback) && !moveEvent.precallback(move)) {
			console.log('test failed');
			return false;
		}
		
		return function(getMoves, setMoves, move) {
			var moves = getMoves();
			moves.push(move);
			setMoves(moves);
			console.log('the move', move, 'was made!');
			console.log(getMoves());
		}(
			getMoves,
			setMoves,
			move
		);
	}
};

var events = [
	moveEvent
];

module.exports = function(newError, newGetMoves, newSetMoves) {
	error = newError;
	getMoves = newGetMoves;
	setMoves = newSetMoves;
	
	return events;
};