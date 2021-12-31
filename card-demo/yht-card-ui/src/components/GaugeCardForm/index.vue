<template>
  <el-row>
    <el-form-item label="数据接口" :label-width="labelWidth">
      <el-select v-model="form.difId" placeholder="请选择" @change="changeInterface" filterable>
        <el-option v-for="item in numberApi" :label="item.name" :value="item.id" :key="item.id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="接口参数" :label-width="labelWidth">
      <el-col :span="12">
        <el-input v-model="form.param" placeholder="请输入接口参数"></el-input>
      </el-col>
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
    <el-form-item label="圆心位置" :label-width="labelWidth">
      <el-col :span="12">
        <el-input v-model="options.option.series[0].center[0]" placeholder="支持数字、百分比">
          <template slot="prepend">左右位置</template>
        </el-input>
      </el-col>
      <el-col :span="12">
        <el-input v-model="options.option.series[0].center[1]" placeholder="支持数字、百分比">
          <template slot="prepend">上下位置</template>
        </el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="圆环半径" :label-width="labelWidth">
      <el-col :span="12">
        <el-input v-model="options.option.series[0].radius" placeholder="支持数字、百分比"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="角度" :label-width="labelWidth">
      <el-col :span="12">
        <el-input v-model.number="options.option.series[0].startAngle" placeholder="请输入起始角">
          <template slot="prepend">起始角</template>
        </el-input>
      </el-col>
      <el-col :span="12">
        <el-input v-model.number="options.option.series[0].endAngle" placeholder="请输入结束角">
          <template slot="prepend">结束角</template>
        </el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="数值范围" :label-width="labelWidth">
      <el-col :span="12">
        <el-input v-model.number="options.option.series[0].min" placeholder="请输入最小值">
          <template slot="prepend">最小值</template>
        </el-input>
      </el-col>
      <el-col :span="12">
        <el-input v-model.number="options.option.series[0].max" placeholder="请输入最大值">
          <template slot="prepend">最大值</template>
        </el-input>
      </el-col>
    </el-form-item>
    <el-divider content-position="left">标题</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.title.show"></el-switch>
    </el-form-item>
    <div v-show="options.option.title.show">
      <el-form-item label="内容" :label-width="labelWidth">
        <el-input v-model="options.option.title.text" placeholder="请输入标题内容"></el-input>
      </el-form-item>
      <el-form-item label="位置" :label-width="labelWidth">
        <el-col :span="12">
          <el-input v-model="options.option.title.left" placeholder="请输入左边距">
            <template slot="prepend">左边距</template>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input v-model="options.option.title.right" placeholder="请输入右边距">
            <template slot="prepend">右边距</template>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input v-model="options.option.title.top" placeholder="请输入上边距">
            <template slot="prepend">上边距</template>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input v-model="options.option.title.bottom" placeholder="请输入下边距">
            <template slot="prepend">下边距</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="颜色" :label-width="labelWidth">
        <el-color-picker v-model="options.option.title.textStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
      </el-form-item>
      <el-form-item label="字号" :label-width="labelWidth">
        <el-input-number v-model="options.option.title.textStyle.fontSize" :min="1" :max="100"></el-input-number>
      </el-form-item>
      <el-form-item label="加粗" :label-width="labelWidth">
        <el-switch
            v-model="options.option.title.textStyle.fontWeight"
            active-value="bold"
            inactive-value="normal"
        >
        </el-switch>
      </el-form-item>
    </div>
    <el-divider content-position="left">轴线</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.series[0].axisLine.show"></el-switch>
    </el-form-item>
    <div v-show="options.option.series[0].axisLine.show">
      <el-form-item label="颜色" :label-width="labelWidth">
        <el-color-picker v-model="options.option.series[0].axisLine.lineStyle.color[0][1]" :predefine="predefineColors" show-alpha></el-color-picker>
      </el-form-item>
      <el-form-item label="宽度" :label-width="labelWidth">
        <el-input-number v-model="options.option.series[0].axisLine.lineStyle.width" :min="1" :max="100"></el-input-number>
      </el-form-item>
    </div>
    <el-divider content-position="left">进度条</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.series[0].progress.show"></el-switch>
    </el-form-item>
    <div v-show="options.option.series[0].progress.show">
      <el-form-item label="颜色" :label-width="labelWidth">
        <el-color-picker v-model="options.option.series[0].progress.itemStyle.color" :predefine="predefineColors" show-alpha></el-color-picker>
      </el-form-item>
    </div>
    <el-divider content-position="left">分割线</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.series[0].splitLine.show"></el-switch>
    </el-form-item>
    <el-divider content-position="left">刻度线</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.series[0].axisTick.show"></el-switch>
    </el-form-item>
    <el-divider content-position="left">刻度标记</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.series[0].axisLabel.show"></el-switch>
    </el-form-item>
    <el-divider content-position="left">指针</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.series[0].pointer.show"></el-switch>
    </el-form-item>
    <el-divider content-position="left">数值</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.series[0].detail.show"></el-switch>
    </el-form-item>
    <div v-show="options.option.series[0].detail.show">
      <el-form-item label="位置" :label-width="labelWidth">
        <el-col :span="12">
          <el-input v-model.number="options.option.series[0].detail.offsetCenter[0]" placeholder="请输入横向">
            <template slot="prepend">横向</template>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input v-model.number="options.option.series[0].detail.offsetCenter[1]" placeholder="请输入纵向">
            <template slot="prepend">纵向</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="颜色" :label-width="labelWidth">
        <el-color-picker v-model="options.option.series[0].detail.color" :predefine="predefineColors" show-alpha></el-color-picker>
      </el-form-item>
      <el-form-item label="字号" :label-width="labelWidth">
        <el-input-number v-model="options.option.series[0].detail.fontSize" :min="1" :max="100"></el-input-number>
      </el-form-item>
      <el-form-item label="加粗" :label-width="labelWidth">
        <el-switch
            v-model="options.option.series[0].detail.fontWeight"
            active-value="bold"
            inactive-value="normal"
        >
        </el-switch>
      </el-form-item>
    </div>
  </el-row>
</template>

<script>
export default {
  name: "PieCardForm",
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
          color: [],
          title: {
            show: false,
            textStyle: {
              color: '#fff',
              fontWeight: 'lighter',
              fontSize: 14
            }
          },
          tooltip: {
            show: false,
            trigger: 'item'
          },
          series: [
            {
              name: '',
              type: 'gauge',
              center: ['50%', '50%'],
              radius: '75%',
              startAngle: 90,
              endAngle: -270,
              min: 0,
              max: 100,
              progress: {
                show: true,
                overlap: false,
                roundCap: true,
                clip: false,
                itemStyle: {
                  borderWidth: 0,
                  borderColor: '#464646'
                }
              },
              axisLine: {
                show: true,
                roundCap: true,
                lineStyle: {
                  color: [[1, '#E6EBF8']],
                  width: 10
                }
              },
              splitLine: {
                show: true,
                distance: 0,
                length: 10,
                lineStyle: {}
              },
              axisTick: {
                show: true,
                lineStyle: {}
              },
              axisLabel: {
                show: true,
                distance: 20
              },
              pointer: {
                show: true,
                itemStyle: {}
              },
              detail: {
                show: true,
                formatter: '{value}',
                offsetCenter: [0, 0],
                fontSize: 12
              },
              itemStyle: {
                borderCap: 'round'
              },
              data: [
                {
                  value: 50
                }
              ]
            }
          ]
        }
      }
    }
  },
  computed: {
    numberApi () {
      return this.$store.getters.numberApi;
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
      const api = this.numberApi.find(item => item.id === id);
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
    }
  },
  created() {
    if (!this.form.options) {
      this.updateOptions();
    } else {
      try {
        // this.updateOptions();
        this.options = JSON.parse(this.form.options);
        this.options.option.series[0].itemStyle = {
          borderCap: 'round'
        }
        this.options.option.series[0].axisLine.roundCap = true;
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
