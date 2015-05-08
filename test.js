'use strict';

var isSet = require('./is_set.js');

function test(rules, obj, error) {
	error = error || function(message) {
		console.warn(message);
	}

	if (isSet(rules)) {
		var passed = rules.filter(function(ruleTest) {
			return ruleTest(obj, error);
		});
		
		return passed.length === rules.length;
	}
	
	console.log('no rules given');
	
	return true;
}

module.exports = test;