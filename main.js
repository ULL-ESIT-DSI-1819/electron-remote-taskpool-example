// This works in the either the main or renderer processes.

/*
 * electron-remote provides an alternative to Electron's remote module based around Promises instead of synchronous execution. 
 * It also provides an automatic way to use BrowserWindows as "background processes" that auto-scales based on usage, similar to Grand Central Dispatch or the .NET TPL Taskpool.
*/
const {app, BrowserWindow} = require("electron");
const { requireTaskPool } = require('electron-remote');
const work = requireTaskPool(require.resolve('./work'));

const debug = /--debug/.test(process.argv[2])

let win;

function createWindow() {
  win = new BrowserWindow({width:800, height: 600});
  win.loadFile("index.html")
  //win.loadURL("https://github.com");

  /*
     let contents = win.webContents
     console.log(contents)
  */
  
  // Launch fullscreen with DevTools open, usage: npm run debug
  if (debug) {
    win.webContents.openDevTools()
    win.maximize()
    require('devtron').install()
  }


  console.log('start work main pid = ', process.pid);

  // `work` will get executed concurrently in separate processes

  work(1).then(result => {
    console.log('work done');
    console.log(result);
  });

  work(2).then(result => {
    console.log('work done');
    console.log(result);
  });

  work(3).then(result => {
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

/* Output in the console:

      start work main pid =  34307
      work done
      { id: 1, pid: 34312, timeElapsed: 2 }
      work done
      { id: 3, pid: 34314, timeElapsed: 2 }
      work done
      { id: 2, pid: 34313, timeElapsed: 3 }

*/
