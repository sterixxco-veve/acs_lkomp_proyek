import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  register: (data) => ipcRenderer.invoke('db:register', data),

  login: (credentials) => ipcRenderer.invoke('db:login', credentials),

  getLabs: () => ipcRenderer.invoke('db:getLabs'),

  getPCs: (labId) => ipcRenderer.invoke('db:getPCs', labId),

  addPC: (data) => ipcRenderer.invoke('db:addPC', data),

  updatePC: (data) => ipcRenderer.invoke('db:updatePC', data),

  updatePcStatusOnly: (pcId, status) =>
    ipcRenderer.invoke('db:updatePcStatusOnly', { pcId, status }),

  deletePC: (data) => ipcRenderer.invoke('db:deletePC', id),

  getPcInstalledSoftware: (pcId) => ipcRenderer.invoke('db:getPcInstalledSoftware', pcId),

  updatePcSoftware: (data) => ipcRenderer.invoke('db:updatePcSoftware', data),

  getComponents: () => ipcRenderer.invoke('db:getComponents'),

  addComponent: (data) => ipcRenderer.invoke('db:addComponent', data),

  updateComponent: (data) => ipcRenderer.invoke('db:updateComponent', data),

  deleteComponent: (id) => ipcRenderer.invoke('db:deleteComponent', id),

  getSoftware: (labId) => ipcRenderer.invoke('db:getSoftware', labId),

  addSoftware: (data) => ipcRenderer.invoke('db:addSoftware', data),

  updateSoftware: (data) => ipcRenderer.invoke('db:updateSoftware', data),

  deleteSoftware: (id) => ipcRenderer.invoke('db:deleteSoftware', id),

  createMaintenance: (data) => ipcRenderer.invoke('db:createMaintenance', data),

  addMaintenanceDetail: (data) => ipcRenderer.invoke('db:addMaintenanceDetail', data),

  finishMaintenance: (id) => ipcRenderer.invoke('db:finishMaintenance', id),

  getHealth: () => ipcRenderer.invoke('db:getHealth'),

  getLowStock: () => ipcRenderer.invoke('db:getLowStock'),

  getMaintenanceTrend: () => ipcRenderer.invoke('db:getMaintenanceTrend'),

  getMostReplacedComponents: () => ipcRenderer.invoke('db:getMostReplacedComponents'),

  getReliabilityLog: () => ipcRenderer.invoke('db:getReliabilityLog'),

  getDashboardSummary: (labId) => ipcRenderer.invoke('db:getDashboardSummary', labId),

  getLiveActivity: () => ipcRenderer.invoke('db:getLiveActivity'),
  getPeminjam: () => ipcRenderer.invoke('db:getPeminjam'),
  addPeminjam: (data) => ipcRenderer.invoke('db:addPeminjam', data),
  updatePeminjam: (data) => ipcRenderer.invoke('db:updatePeminjam', data),

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
