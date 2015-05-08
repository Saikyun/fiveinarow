'use strict';

var test = require('./test.js');
var curry = require('sai_curry');

function ruleChecker() {
	var events = {};

	return {
		addEvent: function addEvent(setEvent, event, rules, error) {
			events[event.name] = function(obj) {
				if (!test(rules, obj, error)) {
					return false;
				}
				
				return event.func(obj);
			}
			
			setEvent(event.name, events[event.name]);
		},
		removeEvent: function(removeEvent, event) {
			removeEvent(event.name, events[event.name]);
		},
		getEvents: function() { return events; }
	};
};

module.exports = ruleChecker;