const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require("./watchAttendance");

const { saveFees, getLocalFees, saveStudent, getLocalStudents, saveExpense, getLocalExpenses, saveMarks } = require('./api');
const { saveUser, getUser } = require('./user');
const { syncAll } = require('./sync');

const startWatcher = require("./watchAttendance");
const initUpdater = require("./updater");
const { runPostUpdateCleanup } = require("./postUpdateCleanup");


let mainWindow;

const isDev = !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.once('did-finish-load', () => {
      console.log("WINDOW LOADED");
    }); //  dev debugging
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));

    // IMPORTANT: enable devtools in exe also (TEMP for debugging)
    // mainWindow.webContents.openDevTools();

    initUpdater(mainWindow);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ---------------- IPC HANDLERS ----------------

// USER
ipcMain.handle('save-user', async (event, user) => {
  console.log("SAVE USER:", user);
  return await saveUser(user);
});

ipcMain.handle('get-user', async () => {
  return await getUser();
});

// FEES
ipcMain.handle('save-fees', async (event, data) => {
  try {
    console.log("IPC RECEIVED IN MAIN (FEES):", data);

    const result = await saveFees(data);

    console.log("SAVE FEES RESULT:", result);

    return result;

  } catch (err) {
    console.error("SAVE FEES ERROR:", err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-local-fees', async () => {
  try {
    const data = await getLocalFees();
    console.log("FETCH LOCAL FEES:", data.length);
    return data;
  } catch (err) {
    console.error("GET LOCAL FEES ERROR:", err);
    return [];
  }
});

// STUDENTS
ipcMain.handle('save-student', async (event, data) => {
  try {
    console.log("SAVE STUDENT:", data);
    return await saveStudent(data);
  } catch (err) {
    console.error("SAVE STUDENT ERROR:", err);
  }
});

ipcMain.handle('get-local-students', async () => {
  try {
    return await getLocalStudents();
  } catch (err) {
    console.error("GET STUDENTS ERROR:", err);
    return [];
  }
});

// EXPENSES
ipcMain.handle('save-expense', async (event, data) => {
  try {
    console.log("SAVE EXPENSE:", data);
    return await saveExpense(data);
  } catch (err) {
    console.error("SAVE EXPENSE ERROR:", err);
  }
});

ipcMain.handle('get-local-expenses', async () => {
  try {
    return await getLocalExpenses();
  } catch (err) {
    console.error("GET EXPENSE ERROR:", err);
    return [];
  }
});

// MARKS
ipcMain.handle("save-marks", async (event, data) => {
  try {
    console.log("SAVE MARKS:", data);
    return await saveMarks(data);
  } catch (err) {
    console.error("SAVE MARKS ERROR:", err);
  }
});

// ---------------- APP START ----------------

app.whenReady().then(async () => {

  // Run post update cleanup before anything else
  await runPostUpdateCleanup();

  createWindow();

  // START ATTENDANCE WATCHER
  startWatcher(mainWindow);

  // AUTO SYNC ENGINE
  setInterval(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      console.log("RUNNING SYNC ENGINE...");
      syncAll(mainWindow);
    } else {
      console.log("WINDOW NOT READY FOR SYNC");
    }
  }, 50000);

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});