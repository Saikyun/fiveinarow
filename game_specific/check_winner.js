'use strict';

function getPosition(xy) {
	return xy.y * 3 + xy.x;
}

function getBoard(moves) {
	var board = [];
	
	for (var i = 0; i < 9; i++) {
		board[i] = null;
	}
	
	moves.forEach(function(move) {
		board[getPosition(move)] = move.player;
	});
	
	return board;
}

function checkWinner(moves) {
	var board = getBoard(moves);
	
	function getXY(position) {
		return {x: position % 3, y: Math.floor(position / 3)};	
	}
	
	function findLine(board, position, direction, steps) {
		var xy = getXY(position);
		xy.x += direction.x * steps;
		xy.y += direction.y * steps;
		
		if (xy.x > 2 || xy.y > 2 || xy.x < 0 || xy.y < 0) {
			return steps;
		}
		
		if (board[getPosition(xy)] !== board[position]) {
			return steps;
		}
		
		return findLine(board, position, direction, steps + 1);
	}
	
	var directions = [];
	for (var x = -1; x <= 1; x++) {
		for (var y = -1; y <= 1; y++) {
			if (x !== 0 || y !== 0) {
				directions.push({x: x, y: y});
			}
		}
	}
	
	var lines = [];
	board
		.forEach(function(spot, position) {
			directions.forEach(function(direction) {
				if (spot === null) { return; }
						
				var line = findLine(board, position, direction, 1);
				lines.push({player: spot, length: line});
			});	
	});
	
	var winningLines = lines.filter(function(line) { return line.length >= 3; });
	
	if (winningLines.length > 0) {
		return winningLines[0].player;	
	} else if (board.filter(function(spot) { return spot === null; }).length === 0) {
		return -1;
	}
	
	return false;
}

module.exports = checkWinner;