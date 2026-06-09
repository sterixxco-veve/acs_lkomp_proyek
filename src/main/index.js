import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import db from './db_handlers'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
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

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function registerIpcHandlers() {
  ipcMain.handle('db:register', async (_, data) => {
    return await db.register(data)
  })

  ipcMain.handle('db:login', async (_, credentials) => {
    return await db.login(credentials)
  })

  ipcMain.handle('db:getPCs', async (_, labId) => {
    return await db.getAllPCs(labId)
  })

  ipcMain.handle('db:addPC', async (_, data) => {
    return await db.addPC(data)
  })

  ipcMain.handle('db:updatePC', async (_, data) => {
    return await db.updatePC(data)
  })

  ipcMain.handle('db:deletePC', async (_, id) => {
    return await db.deletePC(id)
  })

  ipcMain.handle('db:getComponents', async () => {
    return await db.getComponents()
  })

  ipcMain.handle('db:addComponent', async (_, data) => {
    return await db.addComponent(data)
  })

  ipcMain.handle('db:getSoftwares', async () => {
    return await db.getSoftwares()
  })

  ipcMain.handle('db:createMaintenance', async (_, data) => {
    return await db.createMaintenance(data)
  })

  ipcMain.handle('db:addMaintenanceDetail', async (_, data) => {
    return await db.addMaintenanceDetail(data)
  })

  ipcMain.handle('db:finishMaintenance', async (_, id) => {
    return await db.finishMaintenance(id)
  })

  ipcMain.handle('db:getHealth', async () => {
    return await db.getHealthStatus()
  })

  ipcMain.handle('db:getLowStock', async () => {
    return await db.getLowStock()
  })

  ipcMain.handle('db:getMaintenanceTrend', async () => {
    return await db.getMaintenanceTrend()
  })

  ipcMain.handle('db:getMostReplacedComponents', async () => {
    return await db.getMostReplacedComponents()
  })

  ipcMain.handle('db:getDashboardSummary', async () => {
    return await db.getDashboardSummary()
  })

  ipcMain.handle('db:getLiveActivity', async () => {
    return await db.getLiveActivity()
  })
  ipcMain.handle('db:getPeminjam', async () => {
    return await db.getPeminjam()
  })

  ipcMain.handle('db:addPeminjam', async (_, data) => {
    return await db.addPeminjam(data)
  })

  ipcMain.handle('db:createPeminjaman', async (_, data) => {
    return await db.createPeminjaman(data)
  })

  ipcMain.handle('db:addDetailPeminjaman', async (_, data) => {
    return await db.addDetailPeminjaman(data)
  })

  ipcMain.handle('db:getPeminjaman', async () => {
    return await db.getPeminjaman()
  })

  ipcMain.handle('db:getPeminjamanDetail', async (_, id) => {
    return await db.getPeminjamanDetail(id)
  })

  ipcMain.handle('db:returnItem', async (_, detailId) => {
    return await db.returnItem(detailId)
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()
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
