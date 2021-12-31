/*
 * @Description: u
 * @Author: cxy
 * @Date: 2021-07-13 17:59:46
 * @LastEditors: cxy
 * @LastEditTime: 2021-07-13 22:07:55
 */
import axios from 'axios'
import Xt from 'xt-earth/Earth'

const Util = {
    ajax: axios.create({
        baseURL: 'https://park.ala-cloud.cn/'
    })
}

Util.ajax.interceptors.response.use(res => {
    return res.data
})

export function deepCopy (value) {
  return JSON.parse(JSON.stringify(value))
}

function padding (s, len) {
  len = len - (s + '').length
  for (var i = 0; i < len; i++) { s = '0' + s }
  return s
}

export function formatTime (date, pattern) {
  if (!date) { return '' }
  date = typeof date === 'string' ? new Date(date) : date

  pattern = pattern || 'yyyy-MM-dd hh:mm:ss'
  return pattern.replace(/([yMdhsm])(\1*)/g, function ($0) {
    switch ($0.charAt(0)) {
      case 'y': return padding(date.getFullYear(), $0.length)
      case 'M': return padding(date.getMonth() + 1, $0.length)
      case 'd': return padding(date.getDate(), $0.length)
      case 'w': return date.getDay() + 1
      case 'h': return padding(date.getHours(), $0.length)
      case 'm': return padding(date.getMinutes(), $0.length)
      case 's': return padding(date.getSeconds(), $0.length)
    }
  })
}

// 获取中心点
export function getPositionsCenter (positions) {
  const p = []
  for (let i = 0; i < positions.length; i++) {
    const e = positions[i]
    p.push(Xt.Cesium.Cartesian3.fromDegrees(e[0], e[1], e[2]))
  }
  let polyCenter = Xt.Cesium.BoundingSphere.fromPoints(p).center
  polyCenter = Xt.Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter)
  return Xt.Math.cartesianToDegrees(polyCenter)
}

// 随机生成guid
export function getGuid () {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}

/**
 * 图表计算尺寸
 * @param {*} container 父容器
 * @param {*} charts 子图标
 * @param {*} number 宽度分割数
 */
export function chartsSize (container, charts, number) {
  function getStyle (el) {
    if (window.getComputedStyle) {
      return window.getComputedStyle(el, null)
    } else {
      return el.currentStyle
    }
  }
  let wi = getStyle(container, 'width').width
  wi = wi.split('px')
  wi = wi[0] / number + 'px'
  const hi = getStyle(container, 'height').height
  charts.style.width = wi
  charts.style.height = hi
}

// 计算距离
export function disTance (positions) {
  let distance = 0
  for (let i = 0; i < positions.length - 1; i++) {
      const point1cartographic = Xt.Cesium.Cartographic.fromDegrees(positions[i][0], positions[i][1], positions[i][2])
      const point2cartographic = Xt.Cesium.Cartographic.fromDegrees(positions[i + 1][0], positions[i + 1][1], positions[i + 1][2])
      const geodesic = new Xt.Cesium.EllipsoidGeodesic()
      geodesic.setEndPoints(point1cartographic, point2cartographic)
      let s = geodesic.surfaceDistance
      s = Math.abs(point2cartographic.height - point1cartographic.height)
      distance = distance + s
  }
  return distance
}

// 根据距离展示百分比
export function perByDistance (res) {
  if (res > 10000) {
    return 80
  } else if (res <= 10000 && res > 5000) {
    return 60
  } else if (res <= 5000 && res > 2000) {
    return 40
  } else if (res <= 2000 && res > 1000) {
    return 20
  } else if (res <= 1000) {
    return 0
  }
}

// 防抖
export function debounce (fn, wait) {
  var timeout = null
  return function () {
    if (timeout !== null) clearTimeout(timeout)
    timeout = setTimeout(fn, wait)
  }
}

// 节流函数
export function throttle (fn, delay) {
  let timeout = null
  return function () {
    const args = arguments
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        fn.apply(this, args)
      }, delay)
    }
  }
}

// 计算矩形
export function calRectangle (positions) {
  let maxX = Number.MIN_VALUE
  let minX = Number.MAX_VALUE
  let maxY = Number.MIN_VALUE
  let minY = Number.MAX_VALUE
  positions.forEach(e => {
    const x = Number(e[0])
    const y = Number(e[1])
    x > maxX && (maxX = x)
    x < minX && (minX = x)
    y > maxY && (maxY = y)
    y < minY && (minY = y)
  })
  return [minX, minY, maxX, maxY]
}

export function adjustPosition (parkId) {
  switch (parkId) {
    case 100:
      return [0.145, 9000] // [0.096, 5700]
    case 101:
      return [0.088, 5500] // [0.057, 3400]
    case 102:
      return [0.063, 4000] // [0.041, 2500]
    case 103:
      return [0.028, 1800] // [0.0185, 1150]
    case 104:
      return [0.082, 5000] // [0.056, 3250]
    case 105:
      return [0.044, 2900] // [0.028, 1800]
    case 106:
      return [0.042, 2800] // [0.025, 1700]
    default:
      return [0, 0]
  }
}

// 飞行高度
export function adjustHeight (bigScreen, parkId) {
  if (bigScreen) {
    switch (parkId) {
      case 100:
        return 20000 // 22500
      case 101:
        return 12000 // 14000
      case 102:
        return 8000 // 10000
      case 103:
        return 4000 // 5000
      case 104:
        return 12500 // 13000
      case 105:
        return 6000 // 5000
      case 106:
        return 6000 // 5000
      case 107:
        return 14000
      default:
        return 500
    }
  } else {
    switch (parkId) {
      case 100:
        return 14000
      case 101:
        return 9000
      case 102:
        return 6500
      case 103:
        return 3000
      case 104:
        return 9000
      case 105:
        return 4000
      case 106:
        return 4000
      case 107:
        return 10000
      default:
        return 500
    }
  }
}

// 计算两点之间的距离
export function getDistance (satrt, end) {
  const satrtCart = Xt.Cesium.Cartographic.fromDegrees(satrt[0], satrt[1])
  const endCart = Xt.Cesium.Cartographic.fromDegrees(end[0], end[1])
  const geodesic = new Xt.Cesium.EllipsoidGeodesic()
  geodesic.setEndPoints(satrtCart, endCart)
  return geodesic.surfaceDistance
}

// 下载文件
export function download (url, filename) {
  return fetch(url).then(res =>
    res.blob().then(blob => {
      const a = document.createElement('a')
      const url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(url)
    })
  )
}

// blob下载
export function blobDownload (blob, filename) {
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = function (e) {
    const a = document.createElement('a')
    a.download = filename
    a.href = e.target.result
    a.click()
  }
}

// 调整视角定位
export function adjustView (position) {
  const ps = position.map(item => {
    const p = [...item]
    p[0] += 0.0002
    p[1] += 0.0001
    return p
  })
  return ps
}
