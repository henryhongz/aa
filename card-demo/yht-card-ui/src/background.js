'use strict'

import { app, protocol, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { autoUpdater } from 'electron-updater'

const uploadUrl = 'http://121.43.40.223/yht-card/'
const isDevelopment = process.env.NODE_ENV !== 'production'
// Scheme must be registered before the app is ready

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true, stream: true } }
])
let win
async function createWindow () {
  // 隐藏顶部菜单栏,会导致无法全屏，不好
  // Menu.setApplicationMenu(null)
  // Create the browser window.
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    autoHideMenuBar: true, // 隐藏顶部菜单栏,这个好
    webPreferences: {
      // eslint-disable-next-line no-path-concat
      // preload: __dirname + '/preload.js',

      // Required for Spectron testing
      enableRemoteModule: true, // !!process.env.IS_TEST,

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true, // process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: false // process.env.ELECTRON_NODE_INTEGRATION
    }
  })
  win.maximize() // 初始最大化

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  // 退出前确认
  win.on('close', (e) => {
    // console.log('[close]')
    e.preventDefault()	// 阻止默认行为，一定要有
    sendEvent('exit')
  })

  // 确认退出
  ipcMain.on('doExit', () => {
    win = null
    app.exit()
  })

  // 尝试更新
  updateHandle()
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendEvent (channel, options) {
  if (win === null) return
  win.webContents.send(channel, options)
}

// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle () {
  autoUpdater.setFeedURL(uploadUrl)

  // eslint-disable-next-line handle-callback-err
  autoUpdater.on('error', (error) => {
    // console.log('[error]', error)
    sendEvent('error', error)
  })
  autoUpdater.on('checking-for-update', function () {
    // console.log('[checking-for-update]')
    sendEvent('checkingForUpdate')
  })
  autoUpdater.on('update-available', function (info) {
    // console.log('[update-available]', info)
    sendEvent('updateAvailable', info)
  })
  autoUpdater.on('update-not-available', function (info) {
    // console.log('[update-not-available]', info)
    sendEvent('updateNotAvailable', info)
  })

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    // console.log('[download-progress]', progressObj)
    sendEvent('downloadProgress', progressObj)
  })
  // 下载完成
  // eslint-disable-next-line no-unused-vars
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    // console.log('[update-downloaded]')
    sendEvent('updateDownloaded')

    // sendEvent('isUpdateNow')
  })

  // 执行更新
  ipcMain.on('doInstall', () => {
    // 安装新版本
    autoUpdater.quitAndInstall()
  })
  // 检查更新
  ipcMain.on('checkForUpdate', () => {
    // 执行自动更新检查
    autoUpdater.checkForUpdates()
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      // console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  // 打开控制台快捷键
  globalShortcut.register('CommandOrControl+Alt+Shift+d', function () {
    win.webContents.openDevTools()
  })
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
