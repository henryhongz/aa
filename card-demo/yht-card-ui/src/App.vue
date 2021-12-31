<template>
  <div id="app">
    <router-view/>
    <router-link to="/update">
      <div class='update-progress' :class="{ hide: !showUpdate }" v-if="progressShow">
        <div :class='showUpdate ? "drawer-hide" : "drawer-show"' :title="showUpdate ? '收起' : '展开'" @click="hideUpdateProgress"></div>
        下载进度 <el-progress :percentage="toFloat1(progress.percent)" :format="formatProgress"></el-progress>
      </div>
    </router-link>
  </div>
</template>

<script>
let ipcRenderer = null
import {MessageBox} from 'element-ui';

function errorExit (msg) {
  MessageBox.alert(msg, '错误', {
    confirmButtonText: '确定',
    type: 'error',
  }).finally(() => {
    ipcRenderer.send('doExit');
  });
}
try {
  ipcRenderer = window.require('electron').ipcRenderer
  // const remote = window.require('electron').remote
  // const path = window.require('path')
// 获取配置文件
//   const userDataPath = remote.app.getPath('userData')
//   const configPath = path.join(userDataPath, 'config.json')
} catch (e) { e }
export default {
  name: 'App',
  data () {
    return {
      showUpdate: true
    }
  },
  components: {
  },
  computed: {
    path () {
      return this.$route.path
    },
    updateStatus: function () {
      return this.$store.state.update.status
    },
    progress: function () {
      return this.$store.state.update.progress
    },
    progressShow: function () {
      return [2, 3, 4].indexOf(this.updateStatus) !== -1 && this.$route.path !== '/update'
    }
  },
  watch: {
    path () {
      localStorage.setItem('lastPath', this.path)
    }
  },
  methods: {
    prepareUpdate () {
      if (!ipcRenderer) return
      // 检查中、可更新、下载中、下载完成不重复检查
      if (this.updateStatus && [1, 2, 3, 4].indexOf(this.updateStatus) !== -1) return
      ipcRenderer.send('checkForUpdate')
      // eslint-disable-next-line no-unused-vars
      ipcRenderer.on('error', (event, text) => {
        this.$store.commit('update/SET_STATUS', -1)
      })
      // eslint-disable-next-line no-unused-vars
      ipcRenderer.on('checkingForUpdate', (event, text) => {
        this.$store.commit('update/SET_STATUS', 1)
      })
      ipcRenderer.on('updateAvailable', (event, info) => {
        this.$store.commit('update/SET_STATUS', 2)
        this.$store.commit('update/SET_UPDATE_INFO', info)
        this.$router.push('/update')
      })
      // eslint-disable-next-line no-unused-vars
      ipcRenderer.on('updateNotAvailable', (event, info) => {
        this.$store.commit('update/SET_STATUS', 0)
        this.$store.commit('update/SET_UPDATE_INFO', null)
      })
      ipcRenderer.on('downloadProgress', (event, progressObj) => {
        this.$store.commit('update/SET_STATUS', 3)
        this.$store.commit('update/SET_PROGRESS', progressObj)
      })
      // eslint-disable-next-line no-unused-vars
      ipcRenderer.on('updateDownloaded', (event) => {
        this.$store.commit('update/SET_STATUS', 4)
        if (!this.progress.percent || this.progress.percent === '--') {
          this.$store.commit('update/SET_PROGRESS', {
            percent: 100,
            total: 0,
            transferred: 0,
            delta: 0,
            bytesPerSecond: 0
          })
        }
      })
      ipcRenderer.on('exit', () => {
        if ([2, 3].indexOf(this.updateStatus) !== -1) {
          this.$confirm('更新文件还在下载，是否确定退出？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            ipcRenderer.send('doExit')
          }).catch(() => {
          })
        } else {
          ipcRenderer.send('doExit')
        }
      })
    },
    toFloat1 (val) {
      if (typeof val !== 'number') return '0.0'
      return `${parseInt(val)}.${parseInt(val % 1 * 10) || '0'}`
    },
    formatProgress (percentage) {
      return parseInt(percentage) === 100 ? '已完成' : `${percentage}%`
    },
    hideUpdateProgress (e) {
      e.preventDefault()
      this.showUpdate = !this.showUpdate
    },
    limit () {
      // console.log(window.require, this.$route.query.mode)
      if (window.require && process.env.VUE_APP_LIMIT !== 'false') {
        // 桌面版限制项
        const fs = window.require('fs')
        fs.readFile('./config.json', 'utf-8', (err, data) => {
          if (err) {
            errorExit('读取不到配置文件');
          } else {
            try {
              const config = JSON.parse(data);
              if (!config.projectLimit) errorExit('读取配置文件出错');
              localStorage.setItem('projectLimit', config.projectLimit);
            } catch (e) {
              errorExit('读取配置文件出错');
            }
          }
        })
      } else if (this.$route.query.mode ==='fullscreen') {
        // web版
        localStorage.setItem('projectLimit', this.$route.params.projectId);
      } else {
        return;
      }
      this.$store.commit('changeFullscreenFlag', true);
      this.$store.commit('changeReadOnlyFlag', true);
    }
  },
  created () {
    this.limit();
    // 准备更新
    this.prepareUpdate()
    // 初始化 vuex 数据
    this.$store.dispatch('getCompanyAttributes');
    this.$store.dispatch('getApiList');
    this.$store.dispatch('updateCards').then(() => {
      return this.$store.dispatch('updateProjects');
    }).then(projects => {
      if (!projects || !projects.length) return;
      const limit = localStorage.getItem('projectLimit');
      if (limit) {
        // 桌面版限制
        const project = projects.find(item => item.id === +limit);
        let homePage = null;
        if (project.pageList.length) {
          homePage = project.pageList.find(item => item.isIndex === 1) || project.pageList[0];
          this.$router.push(`/${limit}/${homePage.id}`).catch(() => {});
        }
      } else {
        const lastPath = localStorage.getItem('lastPath');
        if (lastPath && this.$router.path === '/') this.$router.push(lastPath).catch(() => {})
        // else this.$router.push(`/${projects[0].id}`).catch(() => {})
      }
    });
  }
}
</script>

<style lang="less">
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.el-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-width: 1px;
  border-style: solid;
  border-color: #EBEEF5;
  box-sizing: border-box;
  .el-card__header {
    padding: 10px;
    height: 45px;
    font-weight: bold;
    border-bottom: none;
  }
  .el-card__body {
    border-top: 1px solid #EBEEF5;
    padding: 10px;
    flex: 1;
    overflow: hidden;
    .el-textarea .el-textarea__inner {
      max-height: 100%;
    }
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //text-align: center;
  color: #2c3e50;
  overflow: hidden;

  height: 100%;
  display: flex;
  .router-view {
    flex: 1;
    overflow: auto;
  }
}

// 图片上传框
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px !important;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
p {
  margin: 0;
}
.el-divider__text.is-left {
  color: #53a8ff;
}
// 下载进度
.update-progress {
  position: fixed;
  width: 300px;
  right: 16px;
  bottom: 16px;
  color: #000;
  padding: 14px 10px 14px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  box-sizing: border-box;
  border: 1px solid #ebeef5;
  background-color: #fff;
  transition: all 0.5s;
  .drawer-hide,
  .drawer-show {
    position: absolute;
    top: 0;
    bottom: 0;
    left: -1px;
    width: 8px;
    background: #ccc;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    &:before {
      content: '';
      position: absolute;
      //border: 6px solid transparent;
      width: 3px;
      height: 50%;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      background: #eee;
    }
  }
  //.drawer-hide:before {
  //  border-left-color: gray;
  //  left: 0;
  //}
  //.drawer-show:before {
  //  border-right-color: gray;
  //  left: -6px;
  //}
}
.update-progress.hide {
  transform: translateX(calc(100% + 8px));
}
//::-webkit-scrollbar {
//  width: 8px;
//}
//// 自定义chrome滚动条
//// 滚动条滑槽样式
//::-webkit-scrollbar-track {
//  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
//  border-radius: 8px;
//}
//// 滚动条样式
//::-webkit-scrollbar-thumb {
//  border-radius: 8px;
//  background: #ddd;
//  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
//}
//::-webkit-scrollbar-thumb:hover{
//  background: #ccc;
//}
//::-webkit-scrollbar-thumb:active{
//  background: #999;
//}
////// 浏览器失焦的样式
////::-webkit-scrollbar-thumb:window-inactive {
////  background: rgba(255,0,0,0.4);
////}
</style>
