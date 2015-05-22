'use strict';

var isSet = require('sai_generic').isSet;

function test(rules, obj, data, error) {
	error = error || function(message) {
		console.warn(message);
	};

	if (isSet(rules)) {
		if (!rules(obj, data,error)) {
			return false;
		}
		
		return true;
		/*
		var passed = rules.filter(function(ruleTest) {
			if (typeof ruleTest === 'function') {
				return ruleTest(obj, error);
			} else if (ruleTest.hasOwnProperty('params') && ruleTest.hasOwnProperty('test')) {
				var params;
				
				if (!Array.isArray(ruleTest.params)) {
					params = [ruleTest.params];
				} else {
					params = ruleTest.params;
				}
				
				var newParams = params.map(function(param) {
					if (!isSet(data[param])) {
						error('data.' + ruleTest.params + ' is not set for', data);
						return 'bajs';
					}
					
					return data[param];
				});
				
				newParams.unshift(obj);
				newParams.push(error);
				
				return ruleTest.test.apply(null, newParams);
			} else {
				error('something is very wrong with ruleTest ' + ruleTest);
				return 'bajs';
			}
		});
		
		if (passed.length === rules.length) {
			return true;
		} else {
			return false;
		}*/
	}
	
	console.log('no rules given');
	
	return true;
}

module.exports = test;