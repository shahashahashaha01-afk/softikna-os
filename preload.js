const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('softikna', {
 openExternal: url => ipcRenderer.invoke('open-external', url),
 saveTextFile: (name, content) => ipcRenderer.invoke('save-text-file', name, content),
 readLocalFiles: () => ipcRenderer.invoke('read-local-files')
});
