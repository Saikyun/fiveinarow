'use strict';

var test = require('./test.js');
var curry = require('sai_curry');

function ruleChecker() {
	var events = {};

	return {
		addEvent: function addEvent(event, rules, setEvent, error, data) {
			events[event.name] = function testAndRun(obj) {
				obj = event.before(obj, data);
				
				if (!test(rules, obj, data, error)) {
					return false;
				}
				
				return event.after(obj);
			};
			
			setEvent(event.name, events[event.name]);
		},
		removeEvent: function(event, removeEvent) {
			removeEvent(event.name, events[event.name]);
		},
		getEvents: function() { return events; }
	};
};

module.exports = ruleChecker;