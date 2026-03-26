import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

/**
 * Jembatan komunikasi antara React (Renderer) dan Node.js (Main)
 * Kita mengekspos objek 'api' ke dalam 'window' di browser
 */
const api = {
  login: (credentials) => ipcRenderer.invoke('db:login', credentials),
  getPCs: (labId) => ipcRenderer.invoke('db:getPCs', labId),
  reportDamage: (data) => ipcRenderer.invoke('db:reportDamage', data),
  getRekap: () => ipcRenderer.invoke('db:getRekap'),
  getHealth: () => ipcRenderer.invoke('db:getHealth')
}

contextBridge.exposeInMainWorld('api', api)
