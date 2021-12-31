/*
 * @Description:
 * @Author: cxy
 * @Date: 2021-07-13 14:04:50
 * @LastEditors: cxy
 * @LastEditTime: 2021-07-13 21:32:56
 */
window.defaultSettings = {
  title: '7号梦工场数字园区综合管理平台',
  version: '1.0.0',
  hash: 'f521c4c434320f79b90dc2ec56c4edd7',
  mode: null, // 允许打开的园区列表：[pid1, pid2, ...],假值代表所有园区
  selected: '#FFB400', // 选中颜色
  unSelected: '#4DAFFB', // 未选中颜色
  position: [121.632569, 29.566069, 160000], // 初始位置
  position2: [121.632569, 29.696069, 460000], // 曲面屏初始位置(原始：[121.48608, 28.595073, 52000])
  viewportWidth: 1920, // 宽
  viewportHeight: 1080, // 高
  landscapeWidth: 6336, // 大屏宽
  landscapeHeight: 1296, // 大屏高
  paths: ['bigScreen', 'bigScreenPark', 'bigScreenEnterprise'], // 大屏路径
  stopTime: 30000, // 静置时间（毫秒）
  interval: 60000, // 巡航间隔时间（毫秒）
  duration: 3000, // 巡航飞行时间（毫秒）
  url: 'http://xtspace.tpddns.cn:8081/jyds/tileset.json', // 倾斜url
  isMock: false, // 是否mock
  imageUrl: '', // 影像地址
  tileset: {
    maximumMemoryUsage: 4096,
    dynamicScreenSpaceError: true,
    skipLevels: 6,
    maximumScreenSpaceError: 10
  },
  followedX: 300, // 漫游x轴高度
  followedZ: 300, // 漫游z轴高度
  multiplier: 0.1, // 漫游速度
  maximumScreenSpaceError: 4, // 最大屏幕空间错误
  loadingTime: {
    home: 2000, // 首页
    park: 2000, // 区块
    enterprise: 2000, // 企业
    firstTime: 6000, // 刷新页面首次加载
    bigScreen: 4000, // 大屏
    bigScreenPark: 2000, // 大屏区块
    bigScreenEnterprise: 500 // 大屏企业
  }, // 加载时间（毫秒）
  scalePoi: 1, // 缩小倍数
}
