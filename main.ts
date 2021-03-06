/* eslint global-require: 1 */

import { app, BrowserWindow } from 'electron';

let mainWindow = null;
let mainUrl = `file://${__dirname}/index.html`;

if (process.env.NODE_ENV === 'development') {
	mainUrl = 'http://localhost:1212/index.html';
}

if (process.env.NODE_ENV === 'production') {
	const sourceMapSupport = require('source-map-support');
	sourceMapSupport.install();
}

if (
	process.env.NODE_ENV === 'development' ||
	process.env.DEBUG_PROD === 'true'
) {
	require('electron-debug')();
	const path = require('path');
	const p = path.join(__dirname, '..', 'app', 'node_modules');
	require('module').globalPaths.push(p);
}

const installExtensions = async () => {
	const installer = require('electron-devtools-installer');
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
	const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

	return Promise.all(
		extensions.map(name => installer.default(installer[name], forceDownload))
	).catch(console.log)
}

/**
 * Add event listeners...
 */
app.on('window-all-closed', () => {
	// Respect the OSX convention of having the application in memory even
	// after all windows have been closed
	if (process.platform !== 'darwin') {
		app.quit();
	}
})

app.on('ready', async () => {
	if (
		process.env.NODE_ENV === 'development' ||
		process.env.DEBUG_PROD === 'true'
	) {
		await installExtensions();
	}

	mainWindow = new BrowserWindow({
		height: 728,
		show: false,
		width: 1024,
	});



	mainWindow.loadURL(mainUrl);

	// @TODO: Use 'ready-to-show' event
	//        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
	mainWindow.webContents.on('did-finish-load', () => {
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined');
		}
		mainWindow.show();
		mainWindow.focus();

		if (process.env.NODE_ENV === 'development') {
			mainWindow.openDevTools();
		}
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
})
