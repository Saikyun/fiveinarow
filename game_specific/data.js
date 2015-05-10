'use strict';

var data = {
	moves: [],
	size: {
		width: 3,
		height: 3
	}
};

function get(name) {
	if (data.hasOwnProperty(name)) {
		return data[name];
	}
	
	throw new Error('cant\'t get attr ' + name + ' from data ' + data);
}

function set(name, value) {
	data[name] = value;
}

module.exports = {
	get: get,
	set: set
};