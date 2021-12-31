<template>
  <div class="need-update">
    <div>{{ tips }}</div>
    <div>
      <div>当前进度:{{ progress.transferred | bit }}/{{ progress.total | bit }} {{ progress.percent | toFloat2 }}%</div>
      <div>
        当前速度:{{ progress.bytesPerSecond | bit }}/s
        剩余时间: {{ (progress.total - progress.transferred) / (progress.bytesPerSecond) | second }}</div>
    </div>
<!--    <div>-->
<!--      更新太慢？<router-link to="/">后台下载</router-link>-->
<!--    </div>-->
  </div>
</template>

<script>
import config from '@/../package.json'
let ipcRenderer = null
try {
  ipcRenderer = window.require('electron').ipcRenderer
} catch (e) { e }
const message = {
  error: '检查更新出错',
  checking: '正在检查更新……',
  updateAva: '检测到新版本',
  updateNotAva: '当前就是最新版本',
  downloading: '正在下载',
  downloaded: '下载完成'
}
function toFloat2 (val) {
  if (typeof val !== 'number') return '0.00'
  return `${parseInt(val)}.${parseInt(val % 1 * 100).toString().padStart(2, '0') || '00'}`
}
export default {
  name: 'Update',
  data () {
    return {
      tips: ''
    }
  },
  computed: {
    progress: function () {
      return this.$store.state.update.progress
    },
    status: function () {
      return this.$store.state.update.status
    },
    updateInfo: function () {
      return this.$store.state.update.updateInfo
    }
  },
  watch: {
    status: {
      handler: function (status) {
        switch (status) {
          case -1:
            this.tips = message.error
            break
          case 0:
            this.tips = message.updateNotAva
            break
          case 1:
            this.tips = message.checking
            break
          case 2:
            this.tips = `${ message.updateAva }: v${ config.version } => v${ this.updateInfo.version }`
            break
          case 3:
            this.tips = `${ message.downloading }: v${ config.version } => v${ this.updateInfo.version }`
            break
          case 4:
            this.tips = `v${ this.updateInfo.version } ${ message.downloaded }`
            this.$confirm('更新文件下载完成，是否立即更新？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.install()
            }).catch(() => {})
        }
      },
      immediate: true
    }
  },
  filters: {
    toFloat2: toFloat2,
    bit (val) {
      if (typeof val !== 'number') return val
      else if (val < 1024) return parseInt(val * 100) / 100 + ' b'
      else if (val / 1024 < 1024) return parseInt(val / 1024 * 100) / 100 + ' Kb'
      else if (val / 1024 / 1024 < 1024) return parseInt(val / 1024 / 1024 * 100) / 100 + ' Mb'
      return toFloat2(val / 1024 / 1024 / 1024) + ' Gb'
    },
    second (val) {
      if (typeof val !== 'number' || isNaN(val)) return '计算中...'
      val = parseInt(val)
      const second = val % 60
      const remain = (val - second) / 60
      const minute = remain % 60
      const hour = (remain - minute) / 60
      return `${ hour.toString().padStart(2, '0') } 小时 ${ minute.toString().padStart(2, '0') } 分 ${ second.toString().padStart(2, '0') } 秒`
    }
  },
  methods: {
    /**
     * 比较版本号
     * @param v1 版本号1
     * @param v2 版本号2
     * @returns {number} 0：等于，正数：大于，负数：小于，绝对值：第几位开始不同
     */
    compareVersion (v1, v2) {
      const sp1 = v1.split('.').map(item => parseInt(item))
      const sp2 = v2.split('.').map(item => parseInt(item))
      // 标准版本号有四位，不足的补0
      while (sp1.length < 4) sp1.push(0)
      while (sp2.length < 4) sp2.push(0)
      for (let i = 0; i < 4; i++) {
        if (sp1[i] < sp2[i]) return -(i + 1)
        else if (sp1[i] > sp2[i]) return (i + 1)
      }
      return 0
    },
    install () {
      if (!ipcRenderer) return
      ipcRenderer.send('doInstall')
    }
  }
}
</script>

<style scoped>
.need-update {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 200px;
  text-align: center;
}
</style>
