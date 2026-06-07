import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  register: (data) => ipcRenderer.invoke('db:register', data),

  login: (credentials) => ipcRenderer.invoke('db:login', credentials),

  getPCs: (labId) => ipcRenderer.invoke('db:getPCs', labId),

  addPC: (data) => ipcRenderer.invoke('db:addPC', data),

  getComponents: () => ipcRenderer.invoke('db:getComponents'),

  addComponent: (data) => ipcRenderer.invoke('db:addComponent', data),

  getSoftwares: () => ipcRenderer.invoke('db:getSoftwares'),

  createMaintenance: (data) => ipcRenderer.invoke('db:createMaintenance', data),

  addMaintenanceDetail: (data) => ipcRenderer.invoke('db:addMaintenanceDetail', data),

  finishMaintenance: (id) => ipcRenderer.invoke('db:finishMaintenance', id),

  getHealth: () => ipcRenderer.invoke('db:getHealth'),

  getLowStock: () => ipcRenderer.invoke('db:getLowStock'),

  getMaintenanceTrend: () => ipcRenderer.invoke('db:getMaintenanceTrend'),

  getDashboardSummary: () => ipcRenderer.invoke('db:getDashboardSummary'),

  getLiveActivity: () => ipcRenderer.invoke('db:getLiveActivity'),
  getPeminjam: () => ipcRenderer.invoke('db:getPeminjam'),
  addPeminjam: (data) => ipcRenderer.invoke('db:addPeminjam', data),

  createPeminjaman: (data) => ipcRenderer.invoke('db:createPeminjaman', data),

  addDetailPeminjaman: (data) => ipcRenderer.invoke('db:addDetailPeminjaman', data),

  getPeminjaman: () => ipcRenderer.invoke('db:getPeminjaman'),
  getPeminjamanDetail: (id) => ipcRenderer.invoke('db:getPeminjamanDetail', id),
  returnItem: (detailId) => ipcRenderer.invoke('db:returnItem', detailId)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
