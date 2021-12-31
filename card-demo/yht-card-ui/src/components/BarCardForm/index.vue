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
    <el-form-item label="是否横向" :label-width="labelWidth">
      <el-switch v-model="options.direction" active-value="horizontal" inactive-value="vertical" @change="handleChangeDirection"></el-switch>
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
    <el-form-item label="名称接口" :label-width="labelWidth">
      <el-col :span="12">
        <el-input v-model="options.option.xAxis.data" placeholder="请输入名称接口"></el-input>
      </el-col>
    </el-form-item>
    <div v-for="(item, i) in options.option.series" :key="i">
      <el-divider>系列{{ (options.option.series.length > 1 ? (i + 1) : '') }}</el-divider>
      <el-form-item
          label="数值接口"
          :label-width="labelWidth"
      >
        <el-col :span="12">
          <el-input v-model="item.data" placeholder="请输入数值接口"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="系列名" :label-width="labelWidth">
        <el-col :span="12">
          <el-input v-model="item.name" placeholder="请输入名称"></el-input>
        </el-col>
      </el-form-item>
      <el-divider content-position="left">图形</el-divider>
      <el-form-item label="图形" :label-width="labelWidth">
        <el-select v-model="item._type" placeholder="请选择" @change="changeShapeType($event, i)">
          <el-option label="正常" value="normal"/>
          <el-option label="斑马纹" value="zebra"/>
          <el-option label="山峰形" value="hill"/>
        </el-select>
      </el-form-item>
      <el-form-item label="间隔宽度" :label-width="labelWidth" v-show="item.type === 'pictorialBar'">
        <el-col :span="12">
          <el-input v-model="item.symbolSize[1]" placeholder="支持数字、百分比">
            <template slot="prepend">实部</template>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input v-model="item.symbolMargin" placeholder="支持数字、百分比">
            <template slot="prepend">虚部</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="柱体宽度" :label-width="labelWidth">
        <el-col :span="12">
          <el-input v-model="item.barWidth" placeholder="支持数字、百分比"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="柱体圆角" :label-width="labelWidth">
        <el-col :span="12">
          <el-input-number v-model="item.itemStyle.borderRadius" :min="0" ></el-input-number>
        </el-col>
      </el-form-item>
      <el-form-item label="填充颜色" :label-width="labelWidth">
        <el-select v-model="item.itemStyle._colorType" placeholder="请选择" @change="changeColorType($event, i)">
          <el-option label="纯色" value="pure"/>
          <el-option label="线性渐变" value="linear"/>
          <el-option label="径向渐变" value="radial"/>
        </el-select>
      </el-form-item>
      <el-form-item label="颜色" :label-width="labelWidth" v-if="item.itemStyle._colorType === 'pure'">
        <el-color-picker v-model="item.itemStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
      </el-form-item>
      <el-form-item label="颜色" :label-width="labelWidth" v-else-if="options.option.series[0].itemStyle._colorType">
        <el-color-picker v-model="item.itemStyle.color.colorStops[0].color" :predefine="predefineColors" show-alpha></el-color-picker>
        <el-color-picker v-model="item.itemStyle.color.colorStops[1].color" :predefine="predefineColors" show-alpha></el-color-picker>
      </el-form-item>
    </div>
    <el-divider content-position="left">标题/单位</el-divider>
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
      <el-form-item label="加粗" :label-width="labelWidth">
        <el-switch v-model="options.option.title.textStyle.fontWeight" active-value="bold" inactive-value="normal"></el-switch>
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
    <el-divider>X轴</el-divider>
    <el-divider content-position="left">坐标轴</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.xAxis.axisLine.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.xAxis.axisLine.show">
      <el-color-picker v-model="options.option.xAxis.axisLine.lineStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">坐标轴刻度</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.xAxis.axisTick.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.xAxis.axisTick.show">
      <el-color-picker v-model="options.option.xAxis.axisTick.lineStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">坐标轴文本</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.xAxis.axisLabel.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.xAxis.axisLabel.show">
      <el-color-picker v-model="options.option.xAxis.axisLabel.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">坐标轴分割线</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.xAxis.splitLine.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.xAxis.splitLine.show">
      <el-color-picker v-model="options.option.xAxis.splitLine.lineStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">坐标轴分割区域</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.xAxis.splitArea.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.xAxis.splitArea.show">
      <el-color-picker v-model="options.option.xAxis.splitArea.areaStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider>Y轴</el-divider>
    <el-divider content-position="left">坐标轴</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.yAxis.axisLine.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.xAxis.axisLine.show">
      <el-color-picker v-model="options.option.yAxis.axisLine.lineStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">坐标轴刻度</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.yAxis.axisTick.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.xAxis.axisTick.show">
      <el-color-picker v-model="options.option.yAxis.axisTick.lineStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">坐标轴文本</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.yAxis.axisLabel.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.xAxis.axisLabel.show">
      <el-color-picker v-model="options.option.yAxis.axisLabel.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">坐标轴分割线</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.yAxis.splitLine.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.xAxis.splitLine.show">
      <el-color-picker v-model="options.option.yAxis.splitLine.lineStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
    <el-divider content-position="left">坐标轴分割区域</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.yAxis.splitArea.show"></el-switch>
    </el-form-item>
    <el-form-item label="颜色" :label-width="labelWidth" v-show="options.option.xAxis.splitArea.show">
      <el-color-picker v-model="options.option.yAxis.splitArea.areaStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
    </el-form-item>
  </el-row>
</template>

<script>
import request from "@/libs/remoteRequest";

export default {
  name: "BarCardForm",
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
      apiInfo: null,
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
            trigger: 'item'
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
              padding: 0
            }
          },
          xAxis: {
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
              show: true,
              color: '#626260'
            },
            splitLine: {
              show: false,
              lineStyle: {}
            },
            splitArea: {
              show: false,
              areaStyle: {}
            },
            data: 'name'
          },
          yAxis: {
            type: 'value',
            axisLine: {
              show: false,
              lineStyle: {}
            },
            axisTick: {
              show: false,
              lineStyle: {}
            },
            axisLabel: {
              show: true,
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
              name: '',
              // type: 'pictorialBar',
              type: 'bar',
              itemStyle: {
              },
              data: 'value',

              // 以下用于绘制斑马纹
              symbolRepeat: "fixed",
              symbolMargin: 2,
              symbol: "rect",
              symbolClip: true,
              symbolSize: ['100%', 2],
              symbolPosition: "start",
              symbolOffset: [1, 1],
              width: 2,
              z: 0,
              zlevel: 1
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
      let apiPath;
      if (!id) {
        apiPath = this.form.dataInterface;
      } else {
        const api = this.chartApi.find(item => item.id === id);
        apiPath = this.form.dataInterface = api.dtInterface;
      }
      request(apiPath).then(res => {
        const series = this.options.option.series;
        if (res.data instanceof Array && res.data.length) {
          let count = Object.keys(res.data[0]).length - series.length - 1;
          // 多退少补
          while (count > 0) {
            this.options.option.series.push(JSON.parse(JSON.stringify(series[0])));
            count--;
          }
          while (count < 0) {
            this.options.option.series.pop();
            count++;
          }
        }
      })
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
    changeColorType (type, index) {
      const style = this.options.option.series[index].itemStyle;
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
    },
    changeShapeType (type, i) {
      const option = this.options.option;
      switch (type) {
        case 'normal':
          option.series[i].type = 'bar';
          break;
        case 'zebra':
          option.series[i] = {
            ...option.series[i],
            type: 'pictorialBar',
            symbolRepeat: "fixed",
            symbolMargin: 2,
            symbol: "rect",
            symbolClip: true,
            symbolSize: ['100%', 2],
            symbolPosition: "start",
            symbolOffset: [1, 1],
            width: 2,
            z: 0,
            zlevel: 1
          }
          break;
        case 'hill':
          option.series[i] = {
            ...option.series[i],
            type: 'pictorialBar',
            barCategoryGap: '-130%',
            symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
            symbolSize: ['100%','100%'],
            symbolClip: false,
            symbolMargin: 0,
            symbolRepeat: false
          }
      }
    },
    // 修改图形方向
    handleChangeDirection (direction) {
      if ((direction === 'vertical' && this.options.option.xAxis.type !== 'category') ||
          (direction === 'horizontal' && this.options.option.yAxis.type !== 'category')) {
        this.options.option = { ...this.options.option, xAxis: this.options.option.yAxis, yAxis: this.options.option.xAxis }
      }
    }
  },
  created() {
    if (!this.form.options) {
      this.updateOptions();
    } else {
      try {
        this.options = JSON.parse(this.form.options);
        this.changeInterface();
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
