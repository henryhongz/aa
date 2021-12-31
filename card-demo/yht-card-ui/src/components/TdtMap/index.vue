<template>
  <div class="map">
    <div id="earthContainer"></div>
  </div>
</template>

<script>
import Vue from 'vue'
import Xt from 'xt-earth/Earth'
import { getPositionsCenter, adjustHeight, calRectangle, adjustView } from '@/utils/util'
import { mapActions, mapState } from 'vuex'
import { getCityGeo } from '@/api/map'
const labelImg = require('@/assets/image/label.png')
const label2Img = require('@/assets/image/label2.png')
const poiImg = require('@/assets/image/poi.png')
const poi2Img = require('@/assets/image/poi2.png')
const poiA = require('@/assets/image/poiA.png')
const poiB = require('@/assets/image/poiB.png')
const poiC = require('@/assets/image/poiC.png')
const poiD = require('@/assets/image/poiD.png')
const poiE = require('@/assets/image/poiE.png')
const gradientColor = require('@/assets/image/gradientColor.png')
const gradientColor2 = require('@/assets/image/gradientColor2.png')
const shadow = require('@/assets/image/shadow.png')
const parkList = require('@/../public/json/parkList.json')
const homePaths = ['home', 'bigScreen']
const parkPaths = ['park', 'bigScreenPark']
const enterprisePaths = ['enterprise', 'bigScreenEnterprise']

let earth = null // earth对象
let realSceneModelTileset = null // 倾斜
let group = [] // guid(园区id), poi、billboard、label、polygon、dynamicWall
let enterpriseGroup = [] // guid（企业id）、poi、billboard、label、scoreLabel、polyline、polygon
let clickEvent = null // 单击事件
let doubleClickEvent = null // 双击事件
let hoverEvent = null // 悬停事件
let stopTimeHandler = null // 静置句柄
let timeoutHandlerList = [] // 消息句柄数组
let loopTimeoutHandler = null // 循环句柄
let mousemoveListener // 鼠标移动事件
let mouseclickListener // 鼠标点击事件
let wheelListener // 鼠标滚轮事件
let contextmenuListener // 鼠标右键事件
let auxclickListener // 鼠标非主按钮(例如,鼠标中键)事件
let keydownListener // 键盘按下事件
let selectedEnterprises = [] // 悬停企业

export default {
  name: 'Map',
  data () {
    return {
      flyAroundFlag: false,
      curIndex: 0,
      parkList: parkList,
      boundary: [],
      initPosition: []
    }
  },
  computed: {
    ...mapState({
      // parkList: state => state.home.parkList,
      scaleValue: (state) => state.map.scaleValue,
      // enterpriseList: state => state.park.enterpriseList,
      cruiseFlag: state => state.map.circleFlag,
      cityCode: state => state.map.cityCode,
      flyParkId: state => state.park.flyParkId,
      backHomeId: state => state.home.backHomeId,
      backParkId: state => state.park.backParkId,
      roamingFlag: state => state.park.roamingFlag,
      layerButton: state => state.park.layerButton,
    }),
    path () {
      return this.$route.name
    },
    parkId () {
      return this.$route.query.parkId
    },
    enterpriseId () {
      return this.$route.query.enterpriseId
    },
    scale () {
      return this.bigScreen ? this.scaleValue * 2 : 1 / this.scaleValue / 2
    },
    bigScreen () {
      return window.defaultSettings.paths.indexOf(this.path) !== -1
    }
  },
  watch: {
    // enterpriseList: {
    //   async handler (val) {
    //     if (val.length > 0 && homePaths.indexOf(this.path) === -1) {
    //       if (!earth) return
    //       try { // 判断是否加载倾斜
    //         realSceneModelTileset.position
    //         await this.loadEnterpriseList(val, true)
    //       } catch (e) {
    //         await this.loadEnterpriseList(val, false)
    //       }
    //       this.changeShow()
    //       this.enterpriseId && this.flyToEnterprise()
    //     }
    //   },
    //   immediate: true
    // },
    cruiseFlag (val) {
      if (!this.parkId) {
        if (val) {
          this.loop()
        } else {
          this.resetPark()
          earth.flyManager.quit()
          this.flyAroundFlag = false
        }
      } else if (!this.enterpriseId || this.parkId) { // 区块页面、首页页面和区块id
        this.SetRoamingFlag(false).then(() => {
          if (val) {
            this.parkLoop()
          } else {
            earth.flyManager.quit()
            this.flyAroundFlag = false
          }
        })
      } else if (this.enterpriseId) { // 企业页面、区块页面和企业id
        if (val) {
          this.enterpriseLoop()
        } else {
          earth.flyManager.quit()
          this.flyAroundFlag = false
        }
      }
    },
    backHomeId (val) {
      val && this.removeEnterpriseGroup()
    },
    backParkId (val) {
      val && this.flyToPark()
    },
    flyParkId: {
      handler (val) {
        val && this.changeShow()
      },
      immediate: true
    },
    roamingFlag: {
      handler () {
        this.changeShow()
      },
      immediate: true
    },
    parkId () {
      this.changeShow()
      this.flyToPark()
    },
    enterpriseId () {
      this.flyToEnterprise()
    },
    layerButton (val) {
      if (val) {
        enterpriseGroup.forEach(e => {
          const score = e.score
          switch (score) {
            case 'A':
              return this.changeColor(e, poiA, '#44F89E')
            case 'B':
              return this.changeColor(e, poiB, '#44F8F2')
            case 'C':
              return this.changeColor(e, poiC, '#FFE223')
            case 'D':
              return this.changeColor(e, poiD, '#FF9B29')
            case 'E':
              return this.changeColor(e, poiE, '#FF6031')
            default:
              break
          }
        })
      } else {
        this.changeShow()
      }
    }
  },
  mounted () {
    getCityGeo(this.cityCode).then(res => {
      const data = JSON.parse(res.msg)
      this.boundary = data
      // 以第一块区域为中心
      // @todo 换个更好的方式
      this.initPosition = this.bigScreen ? window.defaultSettings.position2 : window.defaultSettings.position;
      if (this.boundary.features instanceof Array && this.boundary.features.length) {
        this.initPosition[0] = this.boundary.features[0].properties.center[0];
        this.initPosition[1] = this.boundary.features[0].properties.center[1];
      }
    }).then(() => {
      this.initEarth()
      this.startCruise()
      this.loadBoundary()
      this.loadParkList().then(() => {
        this.parkId && this.flyToPark()
        this.changeShow()
        this.startLoop()
      })
      this.interactionEvent()
    // this.initModels()
    })
  },
  beforeDestroy () {
    this.removeGroup()
    this.removeEnterpriseGroup()
    earth.interaction.unbind(Xt.Enum.InteractionEvent.CLICK, clickEvent)
    earth.interaction.unbind(Xt.Enum.InteractionEvent.DOUBLE_CLICK, doubleClickEvent)
    earth.interaction.unbind(Xt.Enum.InteractionEvent.HOVER, hoverEvent)
    clickEvent = null
    doubleClickEvent = null
    hoverEvent = null
    window.removeEventListener('mousemove', mousemoveListener)
    window.removeEventListener('click', mouseclickListener)
    window.removeEventListener('wheel', wheelListener)
    window.removeEventListener('contextmenu', contextmenuListener)
    window.removeEventListener('auxclick', auxclickListener)
    window.removeEventListener('keydown', keydownListener)
  },
  methods: {
    ...mapActions('home', ['SetFlyParkId', 'GetHome', 'SetFullScreenFlag']),
    ...mapActions('park', ['SetRoamingFlag']),
    // 初始化地球
    initEarth () {
      const position = this.initPosition;
      earth = new Xt.Earth('earthContainer', {
        terrain: 'http://47.94.231.113:10086/terrain',
        destination: position,
        orientation: [0, -35, 0],
        globeColor: '#112A55',
        backgroundColor: '#1C1C1C',
        operationMode: Xt.Enum.OperationMode.NORMAL,
        sceneMode: Xt.Enum.SceneMode.SCENE3D,
        groundSkyBox: [
          '/skybox/right.jpg',
          '/skybox/left.jpg',
          '/skybox/front.jpg',
          '/skybox/back.jpg',
          '/skybox/up.jpg',
          '/skybox/down.jpg'
        ]
      })
      Vue.prototype.earth = earth

      // 飞行到具体位置（带角度）
      earth._viewer.camera.setView({
        destination: Xt.Cesium.Cartesian3.fromDegrees(position[0], position[1], 0),
        orientation: {
          heading: 0,
          pitch: Xt.Cesium.Math.toRadians(-35),
          roll: 0
        }
      })
      earth._viewer.camera.moveBackward(position[2])

      // 天地图影像-墨卡托
      const images = [
        {
          type: Xt.Enum.EarthType.IMAGERY_LAYER, // 影像
          obj: {
            imagery: {
              type: Xt.Enum.ImageryType.WEB_MAP_TILE_SERVICE,
              url:
                // 'http://t3.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=7e9ac31b78a7e7c63226e1b14108ac95'
              // 'http://localhost:9876/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=c1985e7a55ddd4924aca7a8d8e53e6e3'
              'http://47.118.53.118:9999/df_data/image/get?imgUrl=' + encodeURIComponent('https://t3.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=c1985e7a55ddd4924aca7a8d8e53e6e3')
              // minimumLevel: 0,
              // maximumLevel: 10
            }
          }
        }
      ]
      const imageLayers = new Xt.Group({
        id: 'image',
        type: Xt.Enum.TreeType.GROUP,
        children: images
      })
      earth.sceneTree.add(imageLayers)

      if (window.defaultSettings.imageUrl) {
        const customImageLayer = new Xt.ImageryLayer({
          imagery: {
            type: Xt.Enum.ImageryType.URL_TEMPLATE,
            url: window.defaultSettings.imageUrl
          }
        })
        imageLayers.add(customImageLayer)
        // earth.camera.changed.addEventListener(r => {
        //   if (r.destination && r.destination[2] > 18000) {
        //     customImageLayer.show = true
        //   } else {
        //     customImageLayer.show = false
        //   }
        // })
      }

      // 添加雾
      const fog = new Xt.Fog({
        color: 'rgba(255,255,255,0.2)',
        near: 10,
        far: 2000
      })
      earth.getScene().globe.depthTestAgainstTerrain = true
      earth.getScene().globe.maximumScreenSpaceError = window.defaultSettings.maximumScreenSpaceError
      earth.weather.add(fog)
      realSceneModelTileset = new Xt.RealSceneModelTileset({
        // position: [121.4664860152, 29.3792122004, -36.59522],
        url: window.defaultSettings.url,
        altitude: -20,
        definition: window.defaultSettings.tileset.maximumScreenSpaceError || 16
      })
      realSceneModelTileset.value.skipLevelOfDetail = true
      realSceneModelTileset.value.preferLeaves = true
      realSceneModelTileset.value.maximumMemoryUsage = window.defaultSettings.tileset.maximumMemoryUsage || 1024
      realSceneModelTileset.value.dynamicScreenSpaceError = window.defaultSettings.tileset.dynamicScreenSpaceError || 32
      realSceneModelTileset.value.skipLevels = window.defaultSettings.tileset.skipLevels || 1

      earth.sceneTree.add(realSceneModelTileset)
      mousemoveListener = window.addEventListener('mousemove', this.startCruise)
      mouseclickListener = window.addEventListener('click', this.startCruise)
      wheelListener = window.addEventListener('wheel', this.startCruise)
      contextmenuListener = window.addEventListener('contextmenu', this.startCruise)
      auxclickListener = window.addEventListener('auxclick', this.startCruise)
      keydownListener = window.addEventListener('keydown', this.startCruise)
    },
    // 静置巡航
    startCruise () {
      if (this.cruiseFlag) return
      if (!this.parkId) {
        this.startDepthTest()
        earth.flyManager.quit()
        clearTimeout(stopTimeHandler)
        clearTimeout(loopTimeoutHandler)
        timeoutHandlerList.forEach(e => {
          clearTimeout(e)
        })
        timeoutHandlerList = []
        this.flyAroundFlag = false
        this.resetPark()
        this.startLoop()
      } else if (((parkPaths.indexOf(this.path) !== -1) && !this.enterpriseId) || this.parkId) {
        this.startDepthTest()
        !this.roamingFlag && earth.flyManager.quit()
        clearTimeout(stopTimeHandler)
        clearTimeout(loopTimeoutHandler)
        this.flyAroundFlag = false
        !this.roamingFlag && this.startParkLoop()
      } else if ((enterprisePaths.indexOf(this.path) !== -1) || (parkPaths.indexOf(this.path) !== -1 && this.enterpriseId)) {
        this.startDepthTest()
        earth.flyManager.quit()
        clearTimeout(stopTimeHandler)
        clearTimeout(loopTimeoutHandler)
        this.flyAroundFlag = false
        this.startEnterpriseLoop()
      }
    },
    // 开始园区循环
    startParkLoop () {
      stopTimeHandler = setTimeout(() => {
        this.parkLoop()
      }, window.defaultSettings.stopTime)
    },
    // 园区循环
    parkLoop () {
      if (!this.flyAroundFlag) {
        this.finishDepthTest()
        this.flyAroundFlag = true
        const park = group.find(e => {
          return e.guid === Number(this.parkId)
        })
        if (!park) return
        const p = getPositionsCenter(adjustView(park.polygon.positions))
        const adjust = adjustHeight(this.bigScreen, Number(this.parkId))
        earth.flyManager.flyAround({
          destination: [p[0], p[1], 0],
          orientation: [0, -30, 0],
          distance: adjust,
          speed: 360 / (window.defaultSettings.interval / 1000),
          time: window.defaultSettings.interval
        })
        loopTimeoutHandler = setTimeout(() => {
          this.flyAroundFlag = false
          this.parkLoop()
        }, window.defaultSettings.interval)
      }
    },
    // 开始企业循环
    startEnterpriseLoop () {
      stopTimeHandler = setTimeout(() => {
        this.enterpriseLoop()
      }, window.defaultSettings.stopTime)
    },
    // 企业循环
    enterpriseLoop () {
      if (!this.flyAroundFlag) {
        this.finishDepthTest()
        this.flyAroundFlag = true
        const enterprise = enterpriseGroup.find(e => {
          return Number(e.guid) === Number(this.enterpriseId)
        })
        if (!enterprise) return
        const r = calRectangle(enterprise.polygon.positions)
        const diffX = r[2] - r[0]
        const diffY = r[3] - r[1]
        const diff = diffX > diffY ? diffX : diffY
        earth.flyManager.flyAround({
          destination: enterprise.poi.position,
          orientation: [0, -30, 0],
          distance: diff * 280000,
          speed: 360 / (window.defaultSettings.interval / 1000),
          time: window.defaultSettings.interval
        })
        loopTimeoutHandler = setTimeout(() => {
          this.flyAroundFlag = false
          this.enterpriseLoop()
        }, window.defaultSettings.interval)
      }
    },
    // 开始首页循环
    startLoop () {
      stopTimeHandler = setTimeout(() => {
        this.loop()
      }, window.defaultSettings.stopTime)
    },
    // 首页循环
    loop () {
      if (!this.flyAroundFlag) {
        this.finishDepthTest()
        const time = window.defaultSettings.interval - window.defaultSettings.duration
        earth.flyManager.flyAround({
          destination: [this.initPosition[0], this.initPosition, 0],
          orientation: [0, -35, 0],
          distance: this.initPosition[2],
          speed: 360 / (window.defaultSettings.interval / 1000),
          time: window.defaultSettings.interval
        })
        this.flyAroundFlag = true
        const copyGroup = []
        // 变更顺序，以上一个区块为起点
        for (let i = this.curIndex; i < group.length; i++) {
          copyGroup.push(group[i])
        }
        for (let i = 0; i < this.curIndex; i++) {
          copyGroup.push(group[i])
        }
        copyGroup.forEach((e, j) => {
          const timeoutHandler = setTimeout(() => {
            this.curIndex = e.index
            e.poi.image = poi2Img
            e.billboard.image = label2Img
            e.polygon.fillColor = window.defaultSettings.selected
            e.dynamicWall.image = gradientColor2
            e.dynamicWall.color = window.defaultSettings.selected
            const center = getPositionsCenter(adjustView(e.polygon.positions))
            const adjust = adjustHeight(this.bigScreen, e.guid)

            const position = Xt.Cesium.Cartesian3.fromDegrees(center[0], center[1], 0)
            const newCamera = new Xt.Cesium.Camera(earth.getScene())
            newCamera.setView({
                destination: position,
                orientation: {
                    heading: 0,
                    pitch: Xt.Cesium.Math.toRadians(-30),
                    roll: 0
                }
            })
            newCamera.moveBackward(adjust)
            earth._viewer.camera.flyTo({
              destination: newCamera.position,
              orientation: {
                heading: newCamera.heading,
                pitch: newCamera.pitch,
                roll: newCamera.roll
              },
              maximumHeight: 10000,
              duration: window.defaultSettings.duration / 1000,
              complete: () => {
                earth.flyManager.flyAround({
                  destination: [center[0], center[1], 0],
                  orientation: [0, -30, 0],
                  distance: adjust,
                  speed: 360 / (time / 1000),
                  time: time
                })
                loopTimeoutHandler = setTimeout(() => {
                  e.poi.image = poiImg
                  e.billboard.image = labelImg
                  e.polygon.fillColor = window.defaultSettings.unSelected
                  e.dynamicWall.image = gradientColor
                  e.dynamicWall.color = window.defaultSettings.unSelected
                  if (group.length === (j + 1)) {
                    this.flyAroundFlag = false
                    this.curIndex = 0
                    this.loop()
                  }
                }, time)
              }
            })
          }, window.defaultSettings.interval * (j + 1))
          timeoutHandlerList.push(timeoutHandler)
        })
      }
    },
    // 加载边界线
    async loadBoundary () {
      // const geometry = boundary.features[0].geometry
      const holes = []
      this.boundary.features.forEach((f, i) => {
        const geometry = f.geometry
        let coordinates = []

        geometry.coordinates.forEach(e => {
          coordinates = [].concat(...e)
          draw(coordinates)
        })

        function draw (coordinates) {
          // 获取边界高程
          const positions = coordinates.map(e => Xt.Cesium.Cartographic.fromDegrees(e[0], e[1]));
          Xt.Cesium.sampleTerrain(earth._viewer.terrainProvider, 11, positions).then(updatedPositions => {
             const coordinate1 = []
             const coordinate2 = []
             const coordinate3 = []
             const length = updatedPositions.length
             for (let i = 0; i < length; i++) {
               const updatedPosition = updatedPositions[i]
               // 高度获取不到的暂定为0
               updatedPosition.height = updatedPosition.height || 0
               const longitude = updatedPosition.longitude * 180 / Math.PI
               const latitude = updatedPosition.latitude * 180 / Math.PI
               coordinate1.push([longitude, latitude, updatedPosition.height])
               coordinate2.push([longitude, latitude, updatedPosition.height + 100])
               coordinate3.push([longitude, latitude, updatedPosition.height + 200])
             }
             const addBoundaryLine = (coordinate, color, alpha) => {
               earth._viewer.entities.add({
                 polyline: {
                   positions: Xt.Cesium.Cartesian3.fromDegreesArrayHeights(coordinate.flat(Infinity)),
                   width: 10,
                   clampToGround: false,
                   material: Xt.Cesium.Color.fromCssColorString(color).withAlpha(alpha)
                 }
               })
             }
             // 三层地图边界线
             addBoundaryLine(coordinate1, '#1C6A80', 0.6)
             addBoundaryLine(coordinate2, '#15B7D7', 0.8)
             addBoundaryLine(coordinate3, '#A0F4FF', 1)
             // 蒙版
             // earth._viewer.entities.add({
             //   polygon: {
             //     hierarchy: Xt.Cesium.Cartesian3.fromDegreesArrayHeights(coordinate1.flat(Infinity)),
             //     material: Xt.Cesium.Color.fromCssColorString('#68F1FA').withAlpha(0.3),
             //     clampToGround: false,
             //     distanceDisplayCondition: new Xt.Cesium.DistanceDisplayCondition(50000, Number.MAX_VALUE)
             //   }
             // })

             holes.push({
               positions: Xt.Cesium.Cartesian3.fromDegreesArrayHeights(coordinate1.flat(Infinity))
             })
             if (true && i === this.boundary.features.length - 1) {
               // 阴影
               earth._viewer.entities.add({
                 rectangle: {
                   coordinates: Xt.Cesium.Rectangle.fromDegrees(121.12121840616044, 29.047601719333016, 121.85653647072182, 29.55485399321542),
                   material: new Xt.Cesium.ImageMaterialProperty({
                     image: shadow,
                     color: Xt.Cesium.Color.fromCssColorString('#333'),
                     transparent: false
                   })
                 }
               })
               // 面
               earth._viewer.entities.add({
                 polygon: {
                   hierarchy: {
                     positions: Xt.Cesium.Cartesian3.fromDegreesArray([140, 0, 70, 0, 70, 60, 140, 60]),
                     holes: holes
                   },
                   material: Xt.Cesium.Color.fromCssColorString('#000').withAlpha(0.75)
                 }
               })
             }
           })
        }
      })
    },
    // 加载园区列表
    async loadParkList () {
      // await this.GetHome()
      let index = 0
      const scalePoi = this.scale * window.defaultSettings.scalePoi
      // 获取中心点
      const heightList = []
      const map = new Map()
      this.parkList.forEach(e => {
        const positionCenter = getPositionsCenter(e.polygon)
        map.set(e.id, heightList.length)
        heightList.push(Xt.Cesium.Cartographic.fromDegrees(positionCenter[0], positionCenter[1]))
      })
      const updatedPositions = await Xt.Cesium.sampleTerrainMostDetailed(earth._viewer.terrainProvider, heightList)
      for await (const e of this.parkList) {
        const guid = e.id
        const key = map.get(e.id)
        const position = [updatedPositions[key].longitude * 180 / Math.PI, updatedPositions[key].latitude * 180 / Math.PI, Number(updatedPositions[key].height.toFixed(3))]
        // 标记点
        const poi = new Xt.Billboard({
          position: position,
          image: poiImg,
          width: 42 * scalePoi,
          height: 52 * scalePoi,
          id: guid,
          verticalOrigin: Xt.Enum.VerticalOrigin.BOTTOM
        })
        earth.sceneTree.add(poi)
        // label背景图片
        const billboard = new Xt.Billboard({
          position: position,
          image: labelImg,
          pixelOffset: [0, -60 * scalePoi],
          width: e.name.length * 40 * scalePoi,
          height: 40 * scalePoi,
          verticalOrigin: Xt.Enum.VerticalOrigin.BOTTOM,
          id: guid,
          opacity: 1
        })
        earth.sceneTree.add(billboard)
        const labelScale = 10 * scalePoi
        // label文字
        const label = new Xt.Label({
          id: guid,
          position: position,
          text: e.name,
          font: `${labelScale}px Microsoft YaHei`,
          fillColor: 'rgb(255,255,0)',
          pixelOffset: this.bigScreen ? [0, -80 * scalePoi] : [0, -82 * scalePoi],
          scale: labelScale < 12 ? labelScale / 12 : 1,
          outline: true,
          outlineWidth: 1.0,
          eyeOffset: [0, 0, -10]
          // scaleByDistance: [1.5e2, 3.0, 1.5e6, 0.5]
        })
        earth.sceneTree.add(label)
        const polygon = new Xt.Polygon({
          positions: e.polygon,
          fillColor: window.defaultSettings.unSelected,
          outline: false,
          opacity: 0.4,
          clampToGround: true,
          showByDistance: [100000, Number.MAX_VALUE],
          id: guid
        })
        earth.sceneTree.add(polygon)
        const p = []
        e.polygon.forEach(e => {
          p.push(Xt.Cesium.Cartographic.fromDegrees(e[0], e[1], e[2]))
        })
        let updatedPositions2 = await Xt.Cesium.sampleTerrain(earth._viewer.terrainProvider, 9, p)
        const minimumHeights = new Array(updatedPositions2.length).fill(0)
        const maximumHeights = new Array(updatedPositions2.length).fill(50)
        updatedPositions2 = updatedPositions2.map(e => {
          return [(e.longitude * 180 / Math.PI), (e.latitude * 180 / Math.PI), e.height]
        })
        const dynamicWall = new Xt.DynamicWall({
          positions: updatedPositions2,
          minimumHeights: minimumHeights,
          maximumHeights: maximumHeights,
          color: window.defaultSettings.unSelected,
          animate: true,
          duration: 2000,
          delay: 0,
          image: gradientColor,
          opacity: 1,
          orientation: Xt.Enum.Orientation.UP,
          show: true,
          showByDistance: [0, Number.MAX_VALUE],
          id: guid
        })
        earth.sceneTree.add(dynamicWall)
        const obj = {
          guid: guid,
          index: index++,
          poi: poi, // poi
          billboard: billboard, // 标签的框
          label: label, // 标签
          polygon: polygon, // 面
          dynamicWall: dynamicWall
        }
        group.push(obj)
      }
    },
    // 加载企业列表, flag判断是否加载倾斜，是用模型加载高程，否用地形加载高程
    // async loadEnterpriseList (val, flag) {
    //   const scalePoi = this.scale * window.defaultSettings.scalePoi
    //   if (val && enterpriseGroup.length === 0) {
    //     // 获取中心点
    //     const heightList = []
    //     const map = new Map()
    //     val.forEach(e => {
    //       if (e.polygon.length === 0) return
    //       const polyCenter = getPositionsCenter(e.polygon)
    //       map.set(e.id, heightList.length)
    //       flag ? (heightList.push(Xt.Cesium.Cartesian3.fromDegrees(polyCenter[0], polyCenter[1]))) : (heightList.push(Xt.Cesium.Cartographic.fromDegrees(polyCenter[0], polyCenter[1])))
    //     })
    //     let modelList
    //     flag ? (modelList = await earth._viewer.scene.clampToHeightMostDetailed(heightList)) : (modelList = await Xt.Cesium.sampleTerrainMostDetailed(earth._viewer.terrainProvider, heightList))
    //     val.forEach((e) => {
    //       if (e.polygon.length === 0) return
    //       const key = map.get(e.id)
    //       let position
    //       flag ? (position = Xt.Math.cartesianToDegrees(modelList[key])) : (position = [modelList[key].longitude * 180 / Math.PI, modelList[key].latitude * 180 / Math.PI, Number(modelList[key].height.toFixed(3))])
    //       const enterpriseId = e.id
    //       const poi = new Xt.Billboard({
    //         id: enterpriseId,
    //         position: position,
    //         image: poiImg,
    //         width: 42 * scalePoi,
    //         height: 52 * scalePoi,
    //         showByDistance: [0, 30000],
    //         verticalOrigin: Xt.Enum.VerticalOrigin.BOTTOM,
    //         properties: {
    //           name: e.name,
    //           parkId: e.parkId
    //         }
    //       })
    //       earth.sceneTree.add(poi)
    //       const billboard = new Xt.Billboard({
    //         id: enterpriseId,
    //         position: position,
    //         image: labelImg,
    //         pixelOffset: [0, -53 * scalePoi],
    //         width: e.name.length * 44 * scalePoi,
    //         height: 50 * scalePoi,
    //         show: false,
    //         verticalOrigin: Xt.Enum.VerticalOrigin.BOTTOM,
    //         properties: {
    //           name: e.name,
    //           parkId: e.parkId
    //         }
    //       })
    //       earth.sceneTree.add(billboard)
    //       const labelScale = 12 * scalePoi
    //       const label = new Xt.Label({
    //         id: enterpriseId,
    //         position: position,
    //         text: e.name,
    //         font: `${labelScale}px Microsoft YaHei`,
    //         fillColor: 'rgb(255,255,255)',
    //         pixelOffset: this.bigScreen ? [0, -84 * scalePoi] : [0, -82 * scalePoi],
    //         scale: labelScale < 12 ? labelScale / 12 : 1,
    //         outline: false,
    //         eyeOffset: [0, 0, 10],
    //         show: false,
    //         properties: {
    //           name: e.name,
    //           parkId: e.parkId
    //         }
    //       })
    //       earth.sceneTree.add(label)
    //       const scoreLabel = new Xt.Label({
    //         id: enterpriseId,
    //         position: position,
    //         showBackground: true,
    //         backgroundColor: '#002b4180',
    //         backgroundPadding: [7, 5],
    //         image: labelImg,
    //         text: e.score,
    //         font: `${labelScale}px Microsoft YaHei`,
    //         fillColor: 'rgb(255,255,255)',
    //         pixelOffset: this.bigScreen ? [0, -84 * scalePoi * 1.5] : [0, -88 * scalePoi * 1.5],
    //         scale: labelScale < 12 ? labelScale / 12 : 1,
    //         outline: false,
    //         eyeOffset: [0, 0, 10],
    //         show: false,
    //         properties: {
    //           name: e.name,
    //           parkId: e.parkId
    //         }
    //       })
    //       earth.sceneTree.add(scoreLabel)
    //       const polyline = new Xt.Polyline({
    //         id: enterpriseId,
    //         positions: e.polygon,
    //         width: 5,
    //         clampToGround: true,
    //         color: window.defaultSettings.unSelected,
    //         properties: {
    //           name: e.name,
    //           parkId: e.parkId
    //         }
    //       })
    //       earth.sceneTree.add(polyline)
    //       const polygon = new Xt.Polygon({
    //         id: enterpriseId,
    //         positions: e.polygon,
    //         fillColor: window.defaultSettings.unSelected,
    //         outline: false,
    //         opacity: 0.4,
    //         clampToGround: true,
    //         showByDistance: [0, 30000],
    //         properties: {
    //           name: e.name,
    //           parkId: e.parkId
    //         }
    //       })
    //       earth.sceneTree.add(polygon)
    //       enterpriseGroup.push({
    //         guid: enterpriseId,
    //         score: e.score,
    //         poi: poi,
    //         billboard: billboard,
    //         label: label,
    //         scoreLabel: scoreLabel,
    //         polyline: polyline,
    //         polygon: polygon
    //       })
    //     })
    //   }
    // },
    // 地图交互事件
    interactionEvent () {
      clickEvent = earth.interaction.bind(Xt.Enum.InteractionEvent.CLICK, (r) => {
        if (r.object) {
          if (window.defaultSettings.mode && window.defaultSettings.mode.indexOf(r.object.id) === -1) {
            return
          }
          // if (this.path === 'home') { // 首页
            this.$router.push({ query: { parkId: r.object.id } })
            group.forEach(e => {
              if (e.guid === r.object.id) {
                this.resetPark()
                e.poi.image = poi2Img
                e.billboard.image = label2Img
                e.polygon.fillColor = window.defaultSettings.selected
                e.dynamicWall.image = gradientColor2
                e.dynamicWall.color = window.defaultSettings.selected
              }
            })
          // } else if (this.path === 'bigScreen') { // 大屏首页
          //   this.$router.push({ query: { parkId: r.object.id } })
          //   group.forEach(e => {
          //     if (e.guid === r.object.id) {
          //       this.resetPark()
          //       e.poi.image = poi2Img
          //       e.billboard.image = label2Img
          //       e.polygon.fillColor = window.defaultSettings.selected
          //       e.dynamicWall.image = gradientColor2
          //       e.dynamicWall.color = window.defaultSettings.selected
          //     }
          //   })
          // } else if (this.path === 'park') { // 园区
          //   if (r.object.type === 'dynamic_wall') return
          //   this.SetFlyParkId(r.object.id)
          //   this.$router.push({ query: { parkId: r.object.properties.parkId, enterpriseId: r.object.id } })
          // } else if (this.path === 'bigScreenPark') { // 大屏园区
          //   if (r.object.type === 'dynamic_wall') return
          //   this.SetFlyParkId(r.object.id)
          //   this.$router.push({ query: { parkId: r.object.properties.parkId, enterpriseId: r.object.id } })
          // }
        }
      }, {})
      doubleClickEvent = earth.interaction.bind(Xt.Enum.InteractionEvent.DOUBLE_CLICK, (r) => {
        if (r.object) {
          if (window.defaultSettings.mode && window.defaultSettings.mode.indexOf(r.object.id) === -1) {
            return
          }
          this.flyToPark()
          // if (this.path === 'home') { // 首页
          //   this.SetFullScreenFlag(true)
          //   // this.$router.push({ path: '/park', query: { parkId: r.object.id } }).then(() => {
          //   //   this.changeShow()
          //   // })
          //   this.flyToPark()
          // } else if (this.path === 'bigScreen') { // 大屏首页
          //   // this.$router.push({ path: '/bigScreenPark', query: { parkId: r.object.id } }).then(() => {
          //   //   this.changeShow()
          //   // })
          //   this.flyToPark()
          // } else if (this.path === 'park') { // 园区
          //   if (r.object.type === 'dynamic_wall') return
          //   this.SetFullScreenFlag(true)
          //   // this.$router.push({ path: '/enterprise', query: { parkId: r.object.properties.parkId, enterpriseId: r.object.id } })
          //   this.flyToEnterprise()
          // } else if (this.path === 'bigScreenPark') { // 大屏园区
          //   if (r.object.type === 'dynamic_wall') return
          //   // this.$router.push({ path: '/bigScreenEnterprise', query: { parkId: r.object.properties.parkId, enterpriseId: r.object.id } })
          //   this.flyToEnterprise()
          // }
        }
      }, {})
      hoverEvent = earth.interaction.bind(Xt.Enum.InteractionEvent.HOVER, (r) => {
        if (r.object && parkPaths.indexOf(this.path) !== -1) {
          if (parkPaths.indexOf(this.path) !== -1) { // 园区、大屏园区
            enterpriseGroup.forEach(e => {
              if (r.object.id === e.guid) {
                if (selectedEnterprises.length > 0 && selectedEnterprises[0].guid !== e.guid) {
                  selectedEnterprises.forEach(s => {
                    s.billboard.show = false
                    s.label.show = false
                    this.layerButton && (s.scoreLabel.show = false)
                  })
                  selectedEnterprises = []
                }
                e.billboard.show = true
                e.label.show = true
                this.layerButton && (e.scoreLabel.show = true)
                selectedEnterprises.push(e)
              }
            })
          }
        } else {
          if (parkPaths.indexOf(this.path) !== -1) { // 园区、大屏园区
            selectedEnterprises.forEach(s => {
              s.billboard.show = false
              s.label.show = false
              this.layerButton && (s.scoreLabel.show = false)
            })
          }
          selectedEnterprises = []
        }
      })
    },
    // 飞向园区
    flyToPark () {
      group.forEach(e => {
        if (e.guid === Number(this.parkId)) {
          const p = getPositionsCenter(adjustView(e.polygon.positions))
          const adjust = adjustHeight(this.bigScreen, Number(this.parkId))
          const position = Xt.Cesium.Cartesian3.fromDegrees(p[0], p[1], 0)
          const newCamera = new Xt.Cesium.Camera(earth.getScene())
          newCamera.setView({
            destination: position,
            orientation: {
              heading: Xt.Cesium.Math.toRadians(100),
              pitch: Xt.Cesium.Math.toRadians(-30),
              roll: 0
            }
          })
          newCamera.moveBackward(adjust)
          earth._viewer.scene.camera.flyTo({
            destination: newCamera.position,
            orientation: {
              heading: newCamera.heading,
              pitch: newCamera.pitch,
              roll: newCamera.roll
            }
          })
        }
      })
    },
    // 飞往企业
    async flyToEnterprise () {
      await this.SetRoamingFlag(false)
      enterpriseGroup.forEach(e => {
        if (Number(e.polygon.id) === Number(this.enterpriseId)) {
          const p = e.poi.position
          const r = calRectangle(e.polygon.positions)
          const diffX = r[2] - r[0]
          const diffY = r[3] - r[1]
          const diff = diffX > diffY ? diffX : diffY
          const position = Xt.Cesium.Cartesian3.fromDegrees(p[0], p[1], p[2])
          const newCamera = new Xt.Cesium.Camera(earth.getScene())
          newCamera.setView({
            destination: position,
            orientation: {
              heading: 0,
              pitch: Xt.Cesium.Math.toRadians(-30),
              roll: 0
            }
          })
          newCamera.moveBackward(diff * 280000)
          earth._viewer.scene.camera.flyTo({
            destination: newCamera.position,
            orientation: {
              heading: newCamera.heading,
              pitch: newCamera.pitch,
              roll: newCamera.roll
            }
          })
        }
      })
    },
    // 重置园区
    resetPark () {
      group.forEach(e => {
        e.poi.image = poiImg
        // e.poi.show = true
        e.billboard.image = labelImg
        // e.billboard.show = true
        // e.label.show = true
        e.polygon.fillColor = window.defaultSettings.unSelected
        // e.polygon.show = true
        e.dynamicWall.image = gradientColor
        e.dynamicWall.color = window.defaultSettings.unSelected
        // e.dynamicWall.show = true
      })
      // this.hideLabels()
    },
    // 改变园区、企业显示\隐藏
    changeShow () {
      if (!earth) return
      if (homePaths.indexOf(this.path) !== -1) { // 首页\大屏首页
        group.forEach(e => {
          e.poi.image = poiImg
          e.poi.show = true
          e.billboard.image = labelImg
          e.billboard.show = true
          e.label.show = true
          e.polygon.fillColor = window.defaultSettings.unSelected
          e.polygon.show = true
          e.dynamicWall.image = gradientColor
          e.dynamicWall.color = window.defaultSettings.unSelected
          e.dynamicWall.show = true
        })
        enterpriseGroup.forEach(e => {
          e.poi.image = poiImg
          e.poi.show = false
          e.billboard.image = labelImg
          e.billboard.show = false
          e.label.show = false
          e.scoreLabel.image = labelImg
          e.scoreLabel.show = false
          e.polyline.color = window.defaultSettings.unSelected
          e.polyline.show = false
          e.polygon.fillColor = window.defaultSettings.unSelected
          e.polygon.show = false
        })
      } else if (parkPaths.indexOf(this.path) !== -1) { // 园区\大屏园区
        enterpriseGroup.forEach(e => {
          if (e.polygon.properties.parkId === Number(this.parkId) && e.guid === this.enterpriseId) {
            e.poi.image = poi2Img
            e.billboard.image = label2Img
            e.scoreLabel.image = label2Img
            e.polygon.fillColor = window.defaultSettings.selected
            e.poi.show = true
            e.billboard.show = false
            e.label.show = false
            e.scoreLabel.show = false
            e.polyline.color = window.defaultSettings.selected
            e.polyline.show = true
            e.polygon.show = false
          } else if (e.polygon.properties.parkId === Number(this.parkId)) {
            e.poi.image = poiImg
            e.billboard.image = labelImg
            e.scoreLabel.image = labelImg
            e.polygon.fillColor = window.defaultSettings.unSelected
            e.poi.show = true
            e.billboard.show = false
            e.label.show = false
            e.scoreLabel.show = false
            e.polyline.color = window.defaultSettings.unSelected
            e.polyline.show = true
            e.polygon.show = false
          } else {
            e.poi.show = false
            e.billboard.show = false
            e.label.show = false
            e.scoreLabel.show = false
            e.polyline.show = false
            e.polygon.show = false
          }
        })
        group.forEach(e => {
          e.poi.show = false
          e.billboard.show = false
          e.label.show = false
          e.polygon.show = false
          if (e.guid === Number(this.parkId)) {
            e.dynamicWall.image = gradientColor2
            e.dynamicWall.color = window.defaultSettings.selected
            e.dynamicWall.show = true
          } else {
            e.dynamicWall.show = false
          }
        })
      } else if (enterprisePaths.indexOf(this.path) !== -1) { // 企业\大屏企业
        group.forEach(e => {
          e.poi.show = false
          e.billboard.show = false
          e.label.show = false
          e.polygon.show = false
          if (e.guid === Number(this.parkId)) {
            e.dynamicWall.image = gradientColor2
            e.dynamicWall.color = window.defaultSettings.selected
            e.dynamicWall.show = true
          } else {
            e.dynamicWall.show = false
          }
        })
        enterpriseGroup.forEach(e => {
          if (Number(e.guid) === Number(this.enterpriseId)) {
            e.poi.image = poi2Img
            e.billboard.image = label2Img
            e.scoreLabel.image = label2Img
            e.polygon.fillColor = window.defaultSettings.selected
            e.poi.show = true
            e.billboard.show = true
            e.label.show = true
            e.scoreLabel.show = false
            e.polyline.color = window.defaultSettings.selected
            e.polyline.show = true
            e.polygon.show = false
          } else {
            e.poi.image = poiImg
            e.billboard.image = labelImg
            e.scoreLabel.image = labelImg
            e.polygon.fillColor = window.defaultSettings.unSelected
            e.poi.show = false
            e.billboard.show = false
            e.label.show = false
            e.scoreLabel.show = false
            e.polyline.color = window.defaultSettings.unSelected
            e.polyline.show = false
            e.polygon.show = false
          }
        })
      }
    },
    // 改变颜色
    changeColor (item, image, color) {
      item.poi.image = image
      item.polygon.show = true
      item.polygon.fillColor = color
    },
    // 移除园区
    removeGroup () {
      group.forEach(e => {
        earth.sceneTree.remove(e.poi)
        earth.sceneTree.remove(e.billboard)
        earth.sceneTree.remove(e.label)
        earth.sceneTree.remove(e.polygon)
        earth.sceneTree.remove(e.dynamicWall)
      })
      group = []
    },
    // 移除企业
    removeEnterpriseGroup () {
      enterpriseGroup.forEach(e => {
        earth.sceneTree.remove(e.poi)
        earth.sceneTree.remove(e.billboard)
        earth.sceneTree.remove(e.label)
        earth.sceneTree.remove(e.scoreLabel)
        earth.sceneTree.remove(e.polyline)
        earth.sceneTree.remove(e.polygon)
      })
      enterpriseGroup = []
    },
    // 开启深度检测
    startDepthTest () {
      group.forEach(e => {
        e.poi.value.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY
        e.billboard.value.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY
        // e.label.value.label.disableDepthTestDistance = Number.POSITIVE_INFINITY
      })
      enterpriseGroup.forEach(e => {
        e.poi.value.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY
        e.billboard.value.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY
        // e.label.value.label.disableDepthTestDistance = Number.POSITIVE_INFINITY
        // e.scoreLabel.value.label.disableDepthTestDistance = Number.POSITIVE_INFINITY
      })
    },
    // 关闭深度检测
    finishDepthTest () {
      group.forEach(e => {
        e.poi.value.billboard.disableDepthTestDistance = undefined
        e.billboard.value.billboard.disableDepthTestDistance = undefined
        // e.label.value.label.disableDepthTestDistance = undefined
      })
      enterpriseGroup.forEach(e => {
        e.poi.value.billboard.disableDepthTestDistance = undefined
        e.billboard.value.billboard.disableDepthTestDistance = undefined
        // e.label.value.label.disableDepthTestDistance = undefined
        // e.scoreLabel.value.label.disableDepthTestDistance = undefined
      })
    },
    /**
     * 导入 gltf 模型
     * @param path 模型路径
     * @param x 经度
     * @param y 纬度
     * @param scale 缩放大小 默认：1
     * @param rotate 旋转角度 默认：0
     */
    importGltf (path, x, y, scale = 1, rotate = 0) {
      const Cesium = Xt.Cesium
      // const scene = earth._viewer.scene
      const center = Cesium.Cartesian3.fromDegrees(x, y)
      const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center)
      // const model = scene.primitives.add(Cesium.Model.fromGltf({
      //   // 模型文件路径
      //   url: path,
      //   modelMatrix: modelMatrix,
      //   // 调整模型在地图中的大小
      //   scale: scale
      // }))
      // var m = model.modelMatrix
      // // RotateX为旋转角度，转为弧度再参与运算
      // var m1 = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotate))
      // // 矩阵计算
      // Cesium.Matrix4.multiplyByMatrix3(m, m1, m)
      // // 赋值
      // model.modelMatrix = m
      const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(rotate), 0, 0)
      const orientation = Cesium.Transforms.headingPitchRollQuaternion(center, hpr)
      // 插入模型
      const entity = earth._viewer.entities.add({
        position: center,
        orientation: orientation,
        model: {
          uri: path,
          modelMatrix: modelMatrix,
          scale: scale
        }
      })
      return entity
    },
    /**
     * 克隆 entity 模型
     * @param entity 被克隆对象
     * @param x 经度
     * @param y 纬度
     * @param scale 缩放大小 默认：1
     * @param rotate 旋转角度 默认：0
     */
    cloneEntity (entity, x, y, scale, rotate = 0) {
      const Cesium = Xt.Cesium
      const center = Cesium.Cartesian3.fromDegrees(x, y)
      const entityModel = entity.model

      const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(rotate), 0, 0)
      const orientation = Cesium.Transforms.headingPitchRollQuaternion(center, hpr)
      earth._viewer.entities.add({
        position: center,
        orientation: orientation,
        model: entityModel
      })
    },
    /**
     * 添加贴地图片
     * @param path 图片路径
     * @param x 左上角经度
     * @param y 左上角纬度
     * @param width 右下角经度
     * @param height 右下角纬度
     */
    addImage (path, x1, y1, x2, y2) {
      const Cesium = Xt.Cesium
      const viewer = earth._viewer

      viewer.entities.add({
        // position: Cesium.Cartesian3.fromDegrees(x, y),
        // ellipse: {
        //   material: path,
        //   // 圆形覆盖范围
        //   // 宽
        //   semiMajorAxis: width,
        //   // 高
        //   semiMinorAxis: height
        //   // material: Cesium.Color.BLUE.withAlpha(0.5)
        // }
        rectangle: {
          // 设置rectangle的四个坐标范围
          coordinates: Cesium.Rectangle.fromDegrees(x1, y1, x2, y2),

          // 设置图片为材质
          material: path,

          // 图片显示样式类型，有地形，模型或者两者，此效果可以达到贴图是沿
          // 地图弧面的
          classificationType: Cesium.ClassificationType.TERRAIN

        }
      })
    },
    /**
     * 初始化 3d 模型
     */
    initModels () {
      // 小区1 从南到北
      const xiaoqu1Position = [
        [121.56822, 29.83032, 0.0007, -87],
        [121.56852, 29.83070, 0.0007, -87],
        [121.56882, 29.83108, 0.0007, -87],
        [121.56912, 29.83144, 0.0007, -87]
      ]
      const xiaoqu1entity = this.importGltf('/3d/小区1.gltf', ...xiaoqu1Position[0])
      xiaoqu1Position.slice(1).forEach(item => {
        this.cloneEntity(xiaoqu1entity, ...item)
      })
      // 小区2
      const xiaoqu2Position = [
        // 第一排四个
        [121.56892, 29.82862, 0.0007, -90],
        [121.56962, 29.82857, 0.0007, -86],
        [121.57062, 29.82847, 0.0007, -80],
        [121.57172, 29.82816, 0.0007, -74],
        // 第二排五个
        [121.56922, 29.82802, 0.0007, -78],
        [121.57062, 29.82792, 0.0007, -60],
        [121.57140, 29.82785, 0.0007, -66],
        [121.57002, 29.82772, 0.0007, -66],
        [121.57115, 29.82747, 0.0007, -60],
        // 第三排五个
        [121.56910, 29.82762, 0.0007, -78],
        [121.56955, 29.82747, 0.0007, -70],
        [121.57020, 29.82693, 0.0007, -50],
        [121.57135, 29.82697, 0.0007, -72],
        [121.57115, 29.82655, 0.0007, -72],
        // 第四排
        [121.56922, 29.82682, 0.0007, -85],
        [121.56968, 29.82646, 0.0007, -85],
        [121.57035, 29.82636, 0.0007, -53],
        [121.57110, 29.82610, 0.0007, -72],
        // 最后两个
        [121.57030, 29.82587, 0.0007, -53],
        [121.57085, 29.82577, 0.0007, -87],
        // 左边纵向
        [121.56710, 29.82855, 0.0007, -180],
        // 一排两个
        [121.56780, 29.82860, 0.0007, -90],
        [121.56810, 29.82860, 0.0007, -90],
        // 二排一个
        [121.56810, 29.82815, 0.0007, -90],
        // 三排三个
        [121.56752, 29.82790, 0.0007, -55],
        [121.56780, 29.82773, 0.0007, -55],
        [121.56810, 29.82775, 0.0007, -90]
      ]
      const xiaoqu2entity = this.importGltf('/3d/小区2.gltf', ...xiaoqu2Position[0])
      xiaoqu2Position.slice(1).forEach(item => {
        this.cloneEntity(xiaoqu2entity, ...item)
      })
      // this.addImage('/image/forest.png', 121.56710, 29.82577, 121.57172, 29.82862)
    },
    /**
     * 通过经纬度获取当前屏幕坐标
     * @param position 经纬度坐标数组
     * @returns { Cesium.Cartesian3 } 当前屏幕坐标
     */
    getScreenPosition (position) {
      const scene = earth._viewer.scene
      return scene.cartesianToCanvasCoordinates(Xt.Cesium.Cartesian3.fromDegrees(...position))
    },
    /**
     * 隐藏重叠标签
     */
    hideLabels () {
      const doHideLabels = () => {
        // 重置显隐标记
        group.forEach(item => {
          item.show = true
        })
        for (let i = 0; i < group.length; i++) {
          const high = group[i]
          for (let j = i + 1; j < group.length; j++) {
            const low = group[j]
            // 不在屏幕内的，直接隐藏
            if (!this.getScreenPosition(high.poi._position)) {
              high.show = false
            }
            if (!this.getScreenPosition(low.poi._position)) {
              low.show = false
            }
            // 已经被隐藏的，跳过
            if (!low.show || !high.show) {
              continue
            }
            // 横向距离和纵向距离都太小的，需要被隐藏
            if (Math.abs(this.getScreenPosition(high.poi._position).x - this.getScreenPosition(low.poi._position).x) < (high.billboard._width / 2 + low.billboard._width / 2) * 0.8 &&
              Math.abs(this.getScreenPosition(high.poi._position).y - this.getScreenPosition(low.poi._position).y) < (high.billboard._height / 2 + low.billboard._height / 2) * 0.8) {
              low.show = false
            }
          }
        }
        // 根据显隐标志设置真实显隐状态
        group.forEach(item => {
          // for (const key in item) {
          //   if (typeof item[key] === 'object') {
          //     item[key].show = item.show
          //   }
          // }
          item.label.show = item.show
          item.billboard.show = item.show
          item.poi.show = item.show
        })
      }
      // 防抖处理：延时0.3s执行
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(doHideLabels, 300)
    }
  }
}
</script>

<style lang="less" scoped>
.map {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  transform-origin: top left;
  z-index: 1;
  #earthContainer {
    width: 100%;
    height: 100%;
    position: fixed;
  }
  .bigScreen {
    width: 66.7% !important;
    left: 16.7%;
  }
}
</style>
