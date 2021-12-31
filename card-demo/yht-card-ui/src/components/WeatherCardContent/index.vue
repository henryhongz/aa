<template>
  <div v-html="content"></div>
</template>

<script>
export default {
  name: "WeatherCardContent",
  props: {
    params: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      // 省份
      province: null,
      // 城市
      city: null,
      // 天气
      weather: null,
      // 天气图标
      weatherIcon: null,
      // 温度
      temperature: null,
      // 风向
      windDirection: null,
      // 风力等级
      windPower: null,
      // 空气湿度
      humidity: null,
      // 渲染内容
      content: ''
    }
  },
  watch: {
    params: {
      handler: function () {
        this.update()
      },
      immediate: true
    }
  },
  methods: {
    update () {
      const AMap = window.AMap;
      new Promise((resolve, reject) => {
        AMap.plugin('AMap.CitySearch', function () {
          var citySearch = new AMap.CitySearch()
          citySearch.getLocalCity(function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              // 查询成功，result即为当前所在城市信息
              resolve(result)
            } else {
              reject(result)
            }
          })
        })
      }).then(res => {
        AMap.plugin('AMap.Weather', () => {
          const weather = new AMap.Weather()
          weather.getLive(res.adcode, (err, data) => {
            err && console.log(err)
            // 省份
            this.province = data.province;
            // 城市
            this.city = data.city;
            // 天气
            this.weather = data.weather;
            // 温度
            this.temperature = data.temperature;
            // 风向
            this.windDirection = data.windDirection;
            // 风力等级
            this.windPower = data.windPower;
            // 空气湿度
            this.humidity = data.humidity;
            // 天气图标
            if (this.weather.indexOf('多云') !== -1) {
              this.weatherIcon = require('@/assets/weather/cloudy.png');
            } else if (this.weather.indexOf('雷') !== -1) {
              this.weatherIcon = require('@/assets/weather/thunder.png');
            } else if (this.weather.indexOf('大雨') !== -1) {
              this.weatherIcon = require('@/assets/weather/big-rainy.png');
            } else if (this.weather.indexOf('晴') !== -1) {
              this.weatherIcon = require('@/assets/weather/sunny.png');
            } else if (this.weather.indexOf('阴') !== -1) {
              this.weatherIcon = require('@/assets/weather/overcast.png');
            } else if (this.weather.indexOf('雨') !== -1) {
              this.weatherIcon = require('@/assets/weather/rainy.png');
            } else if (this.weather.indexOf('雾') !== -1) {
              this.weatherIcon = require('@/assets/weather/fog.png');
            } else if (this.weather.indexOf('霾') !== -1) {
              this.weatherIcon = require('@/assets/weather/haze.png');
            } else if (this.weather.indexOf('雪') !== -1) {
              this.weatherIcon = require('@/assets/weather/snowy.png');
            } else if (this.weather.indexOf('风') !== -1) {
              this.weatherIcon = require('@/assets/weather/windy.png');
            }
            this.content = `<p><img src="${this.weatherIcon}">${this.weather}</p>`
            if (this.params.options) {
              this.content = this.params.options
                  .replaceAll('%i%', `<img src="${this.weatherIcon}">`)
                  .replaceAll('%p%', this.province)
                  .replaceAll('%c%', this.city)
                  .replaceAll('%w%', this.weather)
                  .replaceAll('%t%', this.temperature)
                  .replaceAll('%wd%', this.windDirection)
                  .replaceAll('%wp%', this.windPower)
                  .replaceAll('%h%', this.humidity)
            }
          })
        })
      }).catch(e => {
        console.error(e);
        this.content = '获取定位信息失败！';
      })
    }
  }
}
</script>

<style scoped>

</style>
