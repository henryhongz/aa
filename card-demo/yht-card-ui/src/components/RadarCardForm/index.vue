<template>
  <el-row>
    <el-form-item label="数据接口" :label-width="labelWidth">
      <el-select v-model="form.difId" placeholder="请选择" @change="changeInterface" filterable>
        <el-option v-for="item in chartApi" :label="item.name" :value="item.id" :key="item.id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="接口参数" :label-width="labelWidth">
      <el-col :span="12">
        <el-input v-model="form.param" placeholder="请输入接口参数"></el-input>
      </el-col>
    </el-form-item>
    <el-divider content-position="left">图例</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.label.show"></el-switch>
    </el-form-item>
    <el-row v-show="options.label.show">
      <el-form-item label="图标形状" :label-width="labelWidth">
        <el-select v-model="options.label.icon.borderRadius" placeholder="请选择">
          <el-option label="方形" value="0" />
          <el-option label="圆形" value="50%" />
        </el-select>
      </el-form-item>
      <el-form-item label="图标颜色" :label-width="labelWidth">
        <el-color-picker v-model="options.label.icon.background" show-alpha></el-color-picker>
      </el-form-item>
      <el-form-item label="文字颜色" :label-width="labelWidth">
        <el-color-picker v-model="options.label.name.color" show-alpha></el-color-picker>
      </el-form-item>
      <el-form-item label="数值颜色" :label-width="labelWidth">
        <el-color-picker v-model="options.label.value.color" show-alpha></el-color-picker>
      </el-form-item>
    </el-row>
    <el-divider content-position="left">坐标轴标签</el-divider>
    <el-form-item label="图形距离" :label-width="labelWidth">
      <el-input-number v-model.number="options.option.radar.nameGap" label="默认"></el-input-number>
    </el-form-item>
    <el-divider content-position="left">坐标轴线</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.radar.axisLine.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-if="options.option.radar.axisLine.show">
      <el-color-picker v-model="options.option.radar.axisLine.lineStyle.color" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">坐标轴分割线</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.radar.splitLine.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-if="options.option.radar.splitLine.show">
      <el-color-picker
          v-model="options.option.radar.splitLine.lineStyle.color"
          show-alpha
      ></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">坐标轴指示器</el-divider>
    <el-form-item label="文字颜色" :label-width="labelWidth">
      <el-color-picker v-model="options.option.radar.name.color" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">坐标轴分割区域</el-divider>
    <el-form-item label="颜色" :label-width="labelWidth">
      <el-color-picker
          v-for="i in options.option.radar.splitArea.areaStyle.color.length"
          v-model="options.option.radar.splitArea.areaStyle.color[i - 1]"
          :key="i"
          show-alpha
      ></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">折线拐点</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.series[0].itemStyle.opacity" :active-value="1" :inactive-value="0"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.series[0].itemStyle.opacity">
      <el-color-picker v-model="options.option.series[0].itemStyle.color" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">线条样式</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.series[0].lineStyle.opacity" :active-value="1" inactive-value="0"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.series[0].lineStyle.opacity">
      <el-color-picker v-model="options.option.series[0].lineStyle.color" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">填充样式</el-divider>
    <el-form-item label="颜色类型" :label-width="labelWidth">
      <el-select v-model="options.option.series[0].areaStyle._colorType" placeholder="请选择" @change="changeAreaStyleColorType">
        <el-option label="纯色" value="pure" />
        <el-option label="线性渐变" value="linear" />
        <el-option label="径向渐变" value="radial" />
      </el-select>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth">
      <el-color-picker
          v-if="options.option.series[0].areaStyle._colorType === 'pure'"
          v-model="options.option.series[0].areaStyle.color"
          show-alpha
      ></el-color-picker>
      <template v-else>
        <el-color-picker
            v-model="options.option.series[0].areaStyle.color.colorStops[0].color"
            show-alpha
        ></el-color-picker>
        <el-color-picker
            v-model="options.option.series[0].areaStyle.color.colorStops[1].color"
            show-alpha
        ></el-color-picker>
      </template>
    </el-form-item>
  </el-row>
</template>

<script>
export default {
  name: "RadarCardForm",
  components: {
  },
  props: {
    value: {
      type: Object,
      require: true
    },
    labelWidth: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      form: {},
      apiInfo: [],
      options: {
        label: {
          show: true,
          content: '',
          icon: {
            color: '#FFA500'
          },
          name: {
            color: '#fff'
          },
          value: {
            color: '#FFA500'
          }
        },
        option: {
          title: {
            text: ''
          },
          radar: {
            // shape: 'circle',
            indicator: [],
            name: {
              color: '#fff'
            },
            nameGap: 15,
            axisLine: {
              show: false,
              lineStyle: {
                color: '#333'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#333'
              }
            },
            splitArea: {
              areaStyle: {
                color: ['rgba(255, 255, 255, .8)', 'rgba(255, 255, 255, .65)', 'rgba(255, 255, 255, .5)', 'rgba(255, 255, 255, .35)', 'rgba(255, 255, 255, .2)']
              }
            }
          },
          series: [
            {
              name: '',
              type: 'radar',
              itemStyle: {
                opacity: 0
              },
              lineStyle: {
                opacity: 0
              },
              areaStyle: {
                _colorType: 'linear', // pure: 纯色 linear:线性渐变 radial:径向渐变
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#b39d87' // 0% 处的颜色
                  }, {
                    offset: 1, color: '#3eb595' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              },
              data: [
                {
                  value: [],
                  name: ''
                }
              ]
            }
          ]
        }
      }
    }
  },
  computed: {
    chartApi () {
      return this.$store.getters.chartApi;
    },
    optionString () {
      return JSON.stringify(this.options)
    }
  },
  watch: {
    value: {
      handler: function () {
        this.form = this.value
      },
      immediate: true
    },
    optionString: function (val) {
      this.updateOptions(val);
    }
  },
  methods: {
    changeInterface (id) {
      const api = this.chartApi.find(item => item.id === id);
      this.form.dataInterface = api.dtInterface;
    },
    updateOptions (str) {
      if (str) this.form.options = str;
      else this.form.options = JSON.stringify(this.options);
    },
    changeAreaStyleColorType (type) {
      const areaStyle = this.options.option.series[0].areaStyle;
      let oldColor = [];
      if (typeof areaStyle.color === 'string') {
        oldColor = [areaStyle.color, areaStyle.color]
      } else {
        oldColor = [areaStyle.color.colorStops[0].color, areaStyle.color.colorStops[1].color]
      }
      switch (type) {
        case 'pure':
          areaStyle.color = oldColor[0];
          break;
        case 'linear':
          areaStyle.color = {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: oldColor[0] // 0% 处的颜色
            }, {
              offset: 1, color: oldColor[1] // 100% 处的颜色
            }],
            global: false // 缺省为 false
          };
          break;
        case 'radial':
          areaStyle.color = {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [{
              offset: 0, color: oldColor[0] // 0% 处的颜色
            }, {
              offset: 1, color: oldColor[1] // 100% 处的颜色
            }],
            global: false // 缺省为 false
          };
          break;
      }
    }
  },
  created() {
    if (!this.form.options) {
      this.updateOptions();
    } else {
      try {
        this.options = JSON.parse(this.form.options);
      } catch (e) { e }
    }
  }
}
</script>

<style lang="less" scoped>
.code {
  background: #2c3e50;
  color: #fff;
}
.no-warp {
  white-space: nowrap;
  display: inline-block;
  margin-right: 10px;
}
</style>
