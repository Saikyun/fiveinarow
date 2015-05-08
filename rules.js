'use strict';

var isSet = require('./is_set.js');
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

function checkXY(move, error) {
	if (move.x < 0 || move.y < 0) {
		error('move.x or move.y is lower than zero');
		return false;
	}
	
	if (move.x >= DEFINED_RULES.width || move.y >= DEFINED_RULES.height) {
		error('move.x or move.y is higher than width/height');
		return false;
	}
	
	return true;
}

var rules = {
	move: [
		curry(standard, isSet),
		areAttrsSet(['x', 'y', 'player']),
		checkXY
	]
};

module.exports = rules;