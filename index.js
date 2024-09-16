const dungeonWidth = 15;
const dungeonHeight = 15;
const minRoomSize = 5;
const cellSize = 30;

const assBox = document.querySelector('.assbox');

const drawDungeon = () => {
	for (let y = 0; y < dungeon.length; y++) {
		for (let x = 0; x < dungeon[y].length; x++) {
			const cell = dungeon[y][x];
			context.fillStyle = cell === 1 ? 'black' : 'white'
			context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
			context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
		}
	}
}

const addRoom = (x, y, width, height) => {
	width = Math.max(minRoomSize, width);
	height = Math.max(minRoomSize, height);
	for (let i = y; i < y + height; i++) {
		for (let j = x; j < x + width; j++) {
			if (i >= 1 && i < dungeonHeight && j >= 1 && j < dungeonWidth) {
				dungeon[i][j] = 0;
			}

		}
	}
	// Ensure walls around the room
	for (let i = y - 1; i <= y + height; i++) {
		for (let j = x - 1; j <= x + width; j++) {
			if (i >= 0 && i < dungeonHeight && j >= 0 && j < dungeonWidth) {
				if (i === y - 1 || i === y + height || j === x - 1 || j === x + width) {
					dungeon[i][j] = 1;
				}
			}
		}
	}
	rooms.push({x, y, width, height})
};

const splitRoom = (x, y, width, height) => {
	if (width > minRoomSize * 2 && height > minRoomSize * 2) {
		const verticalSplit = Math.random() > 0.5;
		if (verticalSplit) {
			//random number between the minimum room size and the width of the available area
			//This is teh x position of the vertical split
			const xSplit = Math.floor(Math.random() * (width - minRoomSize));
			//This defines the width of the first split, which would be the split position minus the x position
			const room1Width = xSplit - x
			//second room width which would be the total width plus the xposition, -xSplit
			const room2Width = (x + width) - xSplit

			const roomHeight = height;
			//recursively run splitRoom on each of the new rooms
			splitRoom(x, y, room1Width, roomHeight)
			splitRoom(xSplit, y, room2Width, roomHeight)
		} else {
			const ySplit = Math.floor(Math.random() * (height - minRoomSize));
			const room1Height = ySplit - y;
			const room2Height = (y + height) - ySplit
			const roomWidth = width
			splitRoom(x, y, roomWidth, room1Height)
			splitRoom(x, ySplit, roomWidth, room2Height)

		}
	} else {
		const roomWidth = Math.max(minRoomSize, width - 1);
		const roomHeight = Math.max(minRoomSize, height - 1);
		addRoom(x, y, roomWidth, roomHeight);
	}
}
const createPassages = () => {
	const passageWidth = 1;

	for (let i = 0; i < rooms.length; i++) {
		for (let j = i + 1; j < rooms.length; j++) {
			const roomA = rooms[i];
			const roomB = rooms[j];

			// Connect roomA to roomB
			const x1 = roomA.x + Math.floor(roomA.width / 2);
			const y1 = roomA.y + Math.floor(roomA.height / 2);
			const x2 = roomB.x + Math.floor(roomB.width / 2);
			const y2 = roomB.y + Math.floor(roomB.height / 2);

			// Create a horizontal then vertical passage
			if (x1 !== x2) {
				for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
					dungeon[y1][x] = 0;
				}
			}
			if (y1 !== y2) {
				for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
					dungeon[y][x2] = 0;
				}
			}
		}
	}
};
//takes a 2d array of 0's and 1's and converts it to a single array
createSingleArray = (twodarray) => {
	const tempArray = []
	for(let i = 0; i < twodarray.length; i++){
		for(let j = 0; j < twodarray[i].length; j++){
			tempArray.push(twodarray[i][j])
			
		}
	}
	return tempArray;
}

const dungeon = Array.from({ length: dungeonHeight }, () => Array(dungeonWidth).fill(1));
const rooms = [];
splitRoom(0, 0, dungeonWidth, dungeonHeight)
createPassages()

console.log(dungeon)
console.log(JSON.stringify(createSingleArray(dungeon)))

const canvas = document.querySelector('canvas');
const context = canvas.getContext("2d");
canvas.width = dungeonWidth * cellSize;
canvas.height = dungeonHeight * cellSize;


drawDungeon();

