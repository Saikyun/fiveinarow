'use strict';

var isSet = require('sai_generic').isSet;
var curry = require('sai_curry');

var standard = function(callback, obj, error) {
	if (!callback(obj)) {
		error(callback.name + ' failed for ' + obj);
		return false;
	}
	
	return true;
}

function areAttrsSet(attrs) {
	return function(obj, error) {
		var passed = attrs.filter(function(attr) {
			if (!isSet(obj[attr])) {
				error(isSet.name + ' failed for ' + obj + '\'s ' + attr);
				return false;
			}
			
			return true;
		});
		
		if (passed.length === attrs.length) {
			return true;	
		} else {
			return false;
		}		
	};
}

function xyLowerThanZero(move) {
	return move.x >= 0 && move.y >= 0;
}

function xyHigherThanLimit(move, size, error) {
	if (move.x >= size.width || move.y >= size.height) {
		error('move.x or move.y is bigger than ' + size.width + ' or ' + size.height);
		return false;
	}
	
	return true;
}

function isSameMove(move1, move2) {
	if (move1.x === move2.x && move1.y === move2.y) {
		return true;
	}
	
	return false;
}

function isUniqueMove(move, moves, error) {
	var same = moves.filter(curry(isSameMove, move));
	
	if (same.length > 0) {
		error('the move ' + move + ' has already been made');
		return false;
	}
	
	return true;
}

function isNotSamePlayerAsLast(move, moves, error) {
	if (moves.length === 0) {
		return true;
	}
	
	if (moves[moves.length - 1].player === move.player) {
		error('the new move has the same player as the last. switch it up please.');
		return false;
	}
	
	return true;
}

module.exports = {
		move: [
			curry(standard, isSet),
			areAttrsSet(['x', 'y', 'player']),
			curry(standard, xyLowerThanZero),
			{test: xyHigherThanLimit, params: 'size'},
			{test: isUniqueMove, params: 'moves'},
			{test: isNotSamePlayerAsLast, params: 'moves'}
		]
};