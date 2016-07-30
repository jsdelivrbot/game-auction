'use strict';

let path = require('path');

global.appRoot = path.resolve(__dirname);

// Get a relative path from the app folder
global.getAppPath = (relPath) => {
	return path.resolve(global.appRoot, relPath)
};

global.joinAppPath = (relPath1, relPath2) => {
	return path.join(global.appRoot, relPath1, relPath2)
};