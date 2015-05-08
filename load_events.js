'use strict';

function loadEvents(socket, events) {
	events.forEach(function(event) {
		socket.on(event.name, event.callback);
	});
}

module.exports = loadEvents;