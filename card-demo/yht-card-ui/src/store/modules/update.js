const update = {
  namespaced: true,

  state: {
    // 是否需要检查更新
    needCheck: true,
    // 更新信息
    updateInfo: false,
    // 状态标志: 错误:-1, 不可更新:0, 检查中:1, 可更新:2, 下载中:3, 下载完成:4
    status: 0,
    // 下载进度
    progress: {
      percent: '--',
      total: '--',
      transferred: '--',
      delta: '--',
      bytesPerSecond: '--'
    }
  },

  mutations: {
    SET_NEED_CHECK: (state, boolean) => {
      state.needCheck = boolean
    },
    SET_UPDATE_INFO: (state, info) => {
      state.updateInfo = info
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_PROGRESS: (state, progress) => {
      state.progress = progress
    }
  },

  actions: {
  }
}

export default update
