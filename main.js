const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
let win;
function createWindow() {
  win = new BrowserWindow({width:1440,height:900,minWidth:900,minHeight:600,autoHideMenuBar:true,backgroundColor:'#090716',
    webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false}});
  win.loadFile('index.html'); win.setMenuBarVisibility(false);
  win.webContents.setWindowOpenHandler(({url})=>{try{const u=new URL(url);if(u.protocol==='https:'||u.protocol==='http:')shell.openExternal(u.href)}catch{}return {action:'deny'}});
}
app.whenReady().then(createWindow);
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow()});
ipcMain.handle('open-external',async(_,url)=>{try{const u=new URL(url);if(['https:','http:'].includes(u.protocol))await shell.openExternal(u.href)}catch{}});
ipcMain.handle('save-text-file',async(_,name,content)=>{
 const safe=String(name||'note.txt').replace(/[<>:"/\\\\|?*\\x00-\\x1F]/g,'_').slice(0,100);
 const dir=path.join(app.getPath('documents'),'Softikna OS');fs.mkdirSync(dir,{recursive:true});
 const target=path.join(dir,safe);fs.writeFileSync(target,String(content??''),'utf8');return target;
});
ipcMain.handle('read-local-files',async()=>{
 const dir=path.join(app.getPath('documents'),'Softikna OS');fs.mkdirSync(dir,{recursive:true});
 return fs.readdirSync(dir,{withFileTypes:true}).map(d=>({name:d.name,type:d.isDirectory()?'folder':'file'}));
});
