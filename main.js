const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const localShortcut = require("electron-localshortcut");

let mainWindow;

app.on('window-all-closed', function(){
	if(process.platform != "darwin"){
		app.quit();
	}
});
app.on('ready', function(){
	mainWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		}
	});
	// mainWindow.openDevTools();
	mainWindow.setMenu(null);
	mainWindow.setMenuBarVisibility(false);
	mainWindow.removeMenu();
	// mainWindow.setMenu(null);
	mainWindow.loadURL('file://' + __dirname + '/index.html');
	mainWindow.maximize()
	mainWindow.on('closed', function(){
		mainWindow = null;
	});
});
