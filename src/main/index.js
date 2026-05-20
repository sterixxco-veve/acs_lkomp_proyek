import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import db from './db_handlers' // Vite akan mem-bundle file ini secara otomatis

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      // Pastikan path preload benar sesuai standar build electron-vite
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Memuat URL dari Vite (dev) atau file html (prod)
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

/**
 * REGISTRASI HANDLER DATABASE
 * Channel ini harus sama dengan yang dipanggil di preload/index.js
 */
function registerIpcHandlers() {
  ipcMain.handle('db:login', async (_, credentials) => {
    return await db.login(credentials)
  })

  ipcMain.handle('db:getPCs', async (_, labId) => {
    return await db.getAllPCs(labId)
  })

  ipcMain.handle('db:reportDamage', async (_, data) => {
    return await db.reportDamage(data)
  })

  // FIX: sesuaikan nama function
  ipcMain.handle('db:getRekap', async () => {
    return await db.getRekapPeminjaman()
  })

  ipcMain.handle('db:getHealth', async () => {
    return await db.getLabHealth()
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // registerIpcHandlers()
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
