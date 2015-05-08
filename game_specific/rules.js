'use strict';

var isSet = require('sai_generic').isSet;
var curry = require('sai_curry');

var DEFINED_RULES = {
	width: 10,
	height: 10
}

var standard = function(callback, obj, error) {
	if (!callback(obj)) {
		error(callback.name + ' failed for ' + obj);
		return false;
	}
	
	return true;
}

function areAttrsSet(attrs) {
	return function(obj, error) {
		attrs.forEach(function(attr) {
			if (!isSet(obj[attr])) {
				error(isSet.name + ' failed for ' + obj + '\'s ' + attr);
				return false;
			}
		});
		
		return true;
	};
}

function xyLowerThanZero(move) {
	if (move.x < 0 || move.y < 0) {
		return false;
	}
	
	return true;
}

function xyHigherThanLimit(move) {
	if (move.x >= DEFINED_RULES.width || move.y >= DEFINED_RULES.height) {
		return false;
	}
	
	return true;
}

var rules = {
	move: [
		curry(standard, isSet),
		areAttrsSet(['x', 'y', 'player']),
		curry(standard, xyLowerThanZero),
		curry(standard, xyHigherThanLimit)
	]
};

module.exports = rules;