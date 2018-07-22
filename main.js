// This works in the either the main or renderer processes.

/*
 * electron-remote provides an alternative to Electron's remote module based around Promises instead of synchronous execution. It also provides an automatic way to use BrowserWindows as "background processes" that auto-scales based on usage, similar to Grand Central Dispatch or the .NET TPL Taskpool.
*/
const {app, BrowserWindow} = require("electron");
const { requireTaskPool } = require('electron-remote');
const work = requireTaskPool(require.resolve('./work'));

let win;

function createWindow() {
  win = new BrowserWindow({width:800, height: 600});
  win.loadFile("index.html")
  //win.loadURL("https://github.com");
  console.log('start work');

  // `work` will get executed concurrently in separate processes

  work().then(result => {
    console.log('work done');
    console.log(result);
  });

  work().then(result => {
    console.log('work done');
    console.log(result);
  });

  work().then(result => {
    console.log('work done');
    console.log(result);
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
  console.log("window-all-closed!!");
});

app.on("activate", () => {
  if (win === null) createWindow();
  console.log("activate!!");
});

