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
    <el-form-item label="名称接口" :label-width="labelWidth">
      <el-col :span="12">
        <el-input v-model="options.option.series[0].name" placeholder="请输入名称接口"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="数值接口" :label-width="labelWidth">
      <el-col :span="12">
        <el-input v-model="options.option.series[0].data" placeholder="请输入数值接口"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="显示总数" :label-width="labelWidth">
      <el-col :span="12">
        <el-switch v-model="options.option.series[0]._showTotal"></el-switch>
      </el-col>
    </el-form-item>
    <el-form-item label="总数名称" :label-width="labelWidth" v-show="options.option.series[0]._showTotal">
      <el-col :span="12">
        <el-input v-model="options.option.series[0]._totalName" placeholder="总数名称"></el-input>
      </el-col>
    </el-form-item>
    <el-divider content-position="left">图形</el-divider>
    <el-form-item label="圆心位置" :label-width="labelWidth">
      <el-col :span="12">
        <el-input v-model="options.option.polar.center[0]" placeholder="支持数字、百分比">
          <template slot="prepend">X</template>
        </el-input>
      </el-col>
      <el-col :span="12">
        <el-input v-model="options.option.polar.center[1]" placeholder="支持数字、百分比">
          <template slot="prepend">Y</template>
        </el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="圆环半径" :label-width="labelWidth">
      <el-col :span="12">
        <el-input v-model="options.option.polar.radius[0]" placeholder="支持数字、百分比">
          <template slot="prepend">内半径</template>
        </el-input>
      </el-col>
      <el-col :span="12">
        <el-input v-model="options.option.polar.radius[1]" placeholder="支持数字、百分比">
          <template slot="prepend">外半径</template>
        </el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="柱体宽度" :label-width="labelWidth">
      <el-col :span="12">
        <el-input-number v-model="options.option.series[0].barWidth" :min="0" ></el-input-number>
      </el-col>
    </el-form-item>
    <el-form-item label="柱体圆角" :label-width="labelWidth">
      <el-switch v-model="options.option.series[0].roundCap"></el-switch>
    </el-form-item>
    <el-form-item label="颜色列表" :label-width="labelWidth">
      <span v-for="i in options.option.color.length" :key="i" style="margin-right: 10px;">
        <el-color-picker v-model="options.option.color[i-1]" :predefine="predefineColors" show-alpha style="vertical-align: middle"></el-color-picker>
        <el-link :underline="false" @click="handleDeleteColor(i-1)">删除</el-link>
      </span>
      <el-button
          @click="handleAddColor"
          title="添加颜色"
          icon="el-icon-plus"
          circle
      ></el-button>
    </el-form-item>
    <el-form-item label="填充颜色" :label-width="labelWidth">
      <el-select v-model="options.option.series[0].itemStyle._colorType" placeholder="请选择" @change="changeColorType">
        <el-option label="纯色" value="pure"/>
        <el-option label="线性渐变" value="linear"/>
        <el-option label="径向渐变" value="radial"/>
      </el-select>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-if="options.option.series[0].itemStyle._colorType === 'pure'">
      <el-color-picker v-model="options.option.series[0].itemStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-else-if="options.option.series[0].itemStyle._colorType">
      <el-color-picker v-model="options.option.series[0].itemStyle.color.colorStops[0].color" :predefine="predefineColors" show-alpha></el-color-picker>
      <el-color-picker v-model="options.option.series[0].itemStyle.color.colorStops[1].color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
    <el-form-item label="图表边距" :label-width="labelWidth">
      <el-col :span="12">
        <el-input v-model="options.option.grid.left" placeholder="支持数字、百分比">
          <template slot="prepend">左边距</template>
        </el-input>
      </el-col>
      <el-col :span="12">
        <el-input v-model="options.option.grid.right" placeholder="支持数字、百分比">
          <template slot="prepend">右边距</template>
        </el-input>
      </el-col>
      <el-col :span="12">
        <el-input v-model="options.option.grid.top" placeholder="支持数字、百分比">
          <template slot="prepend">上边距</template>
        </el-input>
      </el-col>
      <el-col :span="12">
        <el-input v-model="options.option.grid.bottom" placeholder="支持数字、百分比">
          <template slot="prepend">下边距</template>
        </el-input>
      </el-col>
    </el-form-item>
    <el-divider content-position="left">标题</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.title.show"></el-switch>
    </el-form-item>
    <el-row v-show="options.option.title.show">
      <el-form-item label="内容" :label-width="labelWidth">
        <el-col :span="12">
          <el-input v-model="options.option.title.text" placeholder="请输入内容"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="颜色" :label-width="labelWidth">
        <el-color-picker v-model="options.option.title.textStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
      </el-form-item>
      <el-form-item label="字号" :label-width="labelWidth">
        <el-input-number v-model="options.option.title.textStyle.fontSize" :min="1" :max="100"></el-input-number>
      </el-form-item>
      <el-form-item label="水平对齐" :label-width="labelWidth">
        <el-select v-model="options.option.title.textAlign" placeholder="请选择" @change="changeColorType">
          <el-option label="自动" value="auto"/>
          <el-option label="左对齐" value="left"/>
          <el-option label="居中对齐" value="center"/>
          <el-option label="右对齐" value="right"/>
        </el-select>
      </el-form-item>
      <el-form-item label="垂直对齐" :label-width="labelWidth">
        <el-select v-model="options.option.title.verticalAlign" placeholder="请选择" @change="changeColorType">
          <el-option label="自动" value="auto"/>
          <el-option label="顶部对齐" value="top"/>
          <el-option label="居中对齐" value="middle"/>
          <el-option label="底部对齐" value="bottom"/>
        </el-select>
      </el-form-item>
      <el-form-item label="位置" :label-width="labelWidth">
        <el-col :span="12">
          <el-input v-model="options.option.title.left" placeholder="支持数字、百分比">
            <template slot="prepend">左边距</template>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input v-model="options.option.title.right" placeholder="支持数字、百分比">
            <template slot="prepend">右边距</template>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input v-model="options.option.title.top" placeholder="支持数字、百分比">
            <template slot="prepend">上边距</template>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input v-model="options.option.title.bottom" placeholder="支持数字、百分比">
            <template slot="prepend">下边距</template>
          </el-input>
        </el-col>
      </el-form-item>
    </el-row>
    <el-divider content-position="left">图例</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.legend.show"></el-switch>
    </el-form-item>
    <el-row v-show="options.option.legend.show">
      <el-form-item label="图标形状" :label-width="labelWidth">
        <el-select v-model="options.option.legend.icon" placeholder="默认形状">
          <el-option label="圆形" value="circle" />
          <el-option label="矩形" value="rect" />
          <el-option label="圆角矩形" value="roundRect" />
          <el-option label="三角形" value="triangle" />
          <el-option label="菱形" value="diamond" />
          <el-option label="箭头形" value="arrow" />
          <el-option label="无" value="none" />
        </el-select>
      </el-form-item>
      <el-form-item label="图标大小" :label-width="labelWidth">
        <el-col :span="12">
          <el-input v-model.number="options.option.legend.itemWidth" placeholder="请输入宽度">
            <template slot="prepend">宽度</template>
            <template slot="append">px</template>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input v-model.number="options.option.legend.itemHeight" placeholder="请输入高度">
            <template slot="prepend">高度</template>
            <template slot="append">px</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="文字颜色" :label-width="labelWidth">
        <el-color-picker v-model="options.option.legend.textStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
      </el-form-item>
      <el-form-item label="文字大小" :label-width="labelWidth">
        <el-input-number v-model="options.option.legend.textStyle.fontSize" :min="1" :max="100"></el-input-number>
      </el-form-item>
      <el-form-item label="文字边距" :label-width="labelWidth">
        <el-input-number v-model="options.option.legend.textStyle.padding" :min="1" :max="100"></el-input-number>
      </el-form-item>
      <el-form-item label="显示数值" :label-width="labelWidth">
        <el-switch v-model="options.option.legend._showValue"></el-switch>
      </el-form-item>
      <el-form-item label="数值颜色" :label-width="labelWidth">
        <el-color-picker v-model="options.option.legend.textStyle.rich.value.color" :predefine="predefineColors" show-alpha></el-color-picker>
      </el-form-item>
      <el-form-item label="数值字号" :label-width="labelWidth">
        <el-input-number v-model="options.option.legend.textStyle.rich.value.fontSize" :min="1" :max="100"></el-input-number>
      </el-form-item>
      <el-form-item label="数值单位" :label-width="labelWidth">
        <el-col :span="12">
          <el-input v-model="options.option.legend._unit" placeholder="请输入单位，不填则不显示"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="单位颜色" :label-width="labelWidth">
        <el-color-picker v-model="options.option.legend.textStyle.rich.unit.color" :predefine="predefineColors" show-alpha></el-color-picker>
      </el-form-item>
      <el-form-item label="单位字号" :label-width="labelWidth">
        <el-input-number v-model="options.option.legend.textStyle.rich.unit.fontSize" :min="1" :max="100"></el-input-number>
      </el-form-item>
      <el-form-item label="方向" :label-width="labelWidth">
        <el-select v-model="options.option.legend.orient" placeholder="默认方向">
          <el-option label="水平" value="horizontal"></el-option>
          <el-option label="垂直" value="vertical"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="位置" :label-width="labelWidth">
        <el-col :span="12">
          <el-input v-model="options.option.legend.left" placeholder="支持数字、百分比">
            <template slot="prepend">左右位置</template>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input v-model="options.option.legend.top" placeholder="支持数字、百分比">
            <template slot="prepend">上下位置</template>
          </el-input>
        </el-col>
      </el-form-item>
    </el-row>
    <el-divider>角度轴</el-divider>
    <el-divider content-position="left">坐标轴</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.angleAxis.axisLine.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.angleAxis.axisLine.show">
      <el-color-picker v-model="options.option.angleAxis.axisLine.lineStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">坐标轴刻度</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.angleAxis.axisTick.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.angleAxis.axisTick.show">
      <el-color-picker v-model="options.option.angleAxis.axisTick.lineStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">坐标轴文本</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.angleAxis.axisLabel.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.angleAxis.axisLabel.show">
      <el-color-picker v-model="options.option.angleAxis.axisLabel.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">坐标轴分割线</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.angleAxis.splitLine.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.angleAxis.splitLine.show">
      <el-color-picker v-model="options.option.angleAxis.splitLine.lineStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">坐标轴分割区域</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.angleAxis.splitArea.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.angleAxis.splitArea.show">
      <el-color-picker v-model="options.option.angleAxis.splitArea.areaStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider>径向轴</el-divider>
    <el-divider content-position="left">坐标轴</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.radiusAxis.axisLine.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.radiusAxis.axisLine.show">
      <el-color-picker v-model="options.option.radiusAxis.axisLine.lineStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">坐标轴刻度</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.radiusAxis.axisTick.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.radiusAxis.axisTick.show">
      <el-color-picker v-model="options.option.radiusAxis.axisTick.lineStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">坐标轴文本</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.radiusAxis.axisLabel.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.radiusAxis.axisLabel.show">
      <el-color-picker v-model="options.option.radiusAxis.axisLabel.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">坐标轴分割线</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.radiusAxis.splitLine.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.radiusAxis.splitLine.show">
      <el-color-picker v-model="options.option.radiusAxis.splitLine.lineStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">坐标轴分割区域</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.radiusAxis.splitArea.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.radiusAxis.splitArea.show">
      <el-color-picker v-model="options.option.radiusAxis.splitArea.areaStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
  </el-row>
</template>

<script>
export default {
  name: "CircleBarCardForm",
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
      predefineColors: ['rgba(0, 0, 0, 0)', 'rgba(70, 71, 76, 0.8)', '#ffcf2c', '#c16801', '#cf9654', '#db6429', '#0edbbb'],
      options: {
        option: {
          title: {
            show: false,
            textStyle: {
              color: '#fff',
              fontWeight: 'lighter',
              fontSize: 14
            }
          },
          color: ['#ffae66'],
          grid: {
            left: '10%',
            right: '10%',
            top: '10%',
            bottom: '10%'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} {c}'
          },
          legend: {
            show: false,
            itemWidth: 25,
            itemHeight: 14,
            orient: 'vertical',
            top: '5%',
            left: 'center',
            textStyle: {
              color: '#333',
              fontSize: 12,
              padding: 0,
              rich: {
                value: {},
                unit: {}
              }
            }
          },
          polar: {
            radius: [30, '100%'],
            center: ['50%', '50%']
          },
          angleAxis: {
            startAngle: 90,
            axisLine: {
              show: false,
              lineStyle: {}
            },
            axisTick: {
              show: false,
              lineStyle: {}
            },
            axisLabel: {
              show: false,
              color: '#626260'
            },
            splitLine: {
              show: false,
              lineStyle: {}
            },
            splitArea: {
              show: false,
              areaStyle: {}
            }
          },
          radiusAxis: {
            type: 'category',
            axisLine: {
              show: false,
              lineStyle: {}
            },
            axisTick: {
              show: false,
              lineStyle: {}
            },
            axisLabel: {
              show: false,
              color: '#626260'
            },
            splitLine: {
              show: false,
              lineStyle: {}
            },
            splitArea: {
              show: false,
              areaStyle: {}
            }
          },
          series: [
            {
              name: 'name',
              type: 'bar',
              roundCap: true,
              itemStyle: {
              },
              data: 'value',
              coordinateSystem: 'polar',
              borderWidth: 8
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
    handleAddColor () {
      this.options.option.color.push('#ff0');
    },
    handleDeleteColor (index) {
      this.options.option.color.splice(index, 1);
    },
    changeColorType (type) {
      const style = this.options.option.series[0].itemStyle;
      let oldColor = ['#ff0', '#0ff'];
      if (typeof style.color === 'string') oldColor = [style.color, style.color];
      else if (style.color) oldColor = [style.color.colorStops[0].color, style.color.colorStops[1].color]
      switch (type) {
        case 'pure':
          style.color = oldColor[0];
          break;
        case 'linear':
          // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
          style.color = {
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
          // 径向渐变，前三个参数分别是圆心 x, y 和半径，取值同线性渐变
          style.color = {
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
