const { contextBridge, ipcRenderer } = require('electron');
console.log(" PRELOAD LOADED");

contextBridge.exposeInMainWorld('electronAPI', {
  saveFees: (data) => ipcRenderer.invoke('save-fees', data),
  getLocalFees: () => ipcRenderer.invoke('get-local-fees'),
  saveUser: (user) => ipcRenderer.invoke('save-user', user),
  getUser: () => ipcRenderer.invoke('get-user'),
  saveStudent: (data) => ipcRenderer.invoke('save-student', data),
  getLocalStudents: () => ipcRenderer.invoke('get-local-students'),
  saveExpense: (data) => ipcRenderer.invoke('save-expense', data),
  getLocalExpenses: () => ipcRenderer.invoke('get-local-expenses'),
  saveMarks: (data) => ipcRenderer.invoke("save-marks", data),
  onUploadStatus: (callback) => {
    ipcRenderer.on("upload-status", (event, data) => callback(data));
  },
  onSyncStatus: (callback) => {
    ipcRenderer.on("sync-status", (event, data) => callback(data));
  }
});