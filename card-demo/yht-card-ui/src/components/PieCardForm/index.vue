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
    <el-form-item label="形状" :label-width="labelWidth">
      <el-select :value="chartType" placeholder="请选择形状" @change="changeShape">
        <el-option label="饼状" value="pie" />
        <el-option label="环状" value="ring" />
      </el-select>
    </el-form-item>
    <el-form-item label="圆环大小" :label-width="labelWidth" v-if="chartType === 'pie'">
      <el-col :span="12">
        <el-input v-model="options.option.series[0].radius" placeholder="支持数字、百分比">
          <template slot="prepend">半径</template>
        </el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="圆环大小" :label-width="labelWidth" v-else-if="chartType === 'ring'">
      <el-col :span="12">
        <el-input v-model="options.option.series[0].radius[0]" placeholder="支持数字、百分比">
          <template slot="prepend">内半径</template>
        </el-input>
      </el-col>
      <el-col :span="12">
        <el-input v-model="options.option.series[0].radius[1]" placeholder="支持数字、百分比">
          <template slot="prepend">外半径</template>
        </el-input>
      </el-col>
    </el-form-item>
    <el-divider content-position="left">图例</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.legend.show"></el-switch>
    </el-form-item>
    <el-row v-show="options.option.legend.show">
      <el-form-item label="显示数值" :label-width="labelWidth">
        <el-switch v-model="options.option.legend._showValue"></el-switch>
      </el-form-item>
      <el-form-item label="数值单位" :label-width="labelWidth" v-show="options.option.legend._showValue">
        <el-col :span="12">
          <el-input v-model.number="options.option.legend._dataUnit" placeholder="请输入单位"></el-input>
        </el-col>
      </el-form-item>
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
    <el-divider content-position="left">数据标签</el-divider>
    <el-form-item label="显示" :label-width="labelWidth">
      <el-switch v-model="options.option.series[0].label.show"></el-switch>
    </el-form-item>
    <el-row v-show="options.option.series[0].label.show">
      <el-form-item label="显示总数" :label-width="labelWidth">
        <el-switch v-model="options.option.series[0].label._showTotal"></el-switch>
      </el-form-item>
      <el-form-item label="名称" :label-width="labelWidth">
        <el-input v-model="options.option.series[0].label._totalName" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="位置" :label-width="labelWidth">
        <el-select v-model="options.option.series[0].label.position" placeholder="默认方向">
          <el-option label="中心" value="center"></el-option>
          <el-option label="外部" value="outside"></el-option>
          <el-option label="内部" value="inside"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="引导线" :label-width="labelWidth">
        <el-switch v-model="options.option.series[0].labelLine.show"></el-switch>
      </el-form-item>
      <el-form-item label="文字颜色" :label-width="labelWidth">
        <el-color-picker v-model="options.option.series[0].label.color" :predefine="predefineColors" show-alpha></el-color-picker>
      </el-form-item>
      <el-form-item label="文字大小" :label-width="labelWidth">
        <el-input-number v-model="options.option.series[0].label.fontSize" :min="1" :max="100"></el-input-number>
      </el-form-item>
      <el-form-item label="文字粗细" :label-width="labelWidth">
        <el-select v-model="options.option.series[0].label.fontWeight" placeholder="默认">
          <el-option label="正常" value="normal"></el-option>
          <el-option label="粗" value="bolder"></el-option>
          <el-option label="细" value="lighter"></el-option>
        </el-select>
      </el-form-item>
    </el-row>
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
          tooltip: {
            trigger: 'item'
          },
          legend: {
            show: true,
            itemWidth: 25,
            itemHeight: 14,
            orient: 'vertical',
            top: 'center',
            left: '70%',
            textStyle: {
              color: '#333',
              fontSize: 12,
              padding: 0
            },
            _showValue: true,
            _dataUnit: ''
          },
          series: [
            {
              name: '',
              type: 'pie',
              center: ['30%', '50%'],
              radius: ['40%', '60%'],
              avoidLabelOverlap: false,
              label: {
                _showTotal: true,
                show: true,
                position: 'center',
                formatter: '{b} {c}',
                color: '#000',
                fontSize: 12,
                fontWeight: 'normal'
              },
              // emphasis: {
              //   label: {
              //     show: true,
              //     fontSize: '40',
              //     fontWeight: 'bold'
              //   }
              // },
              labelLine: {
                show: false
              },
              data: []
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
    },
    chartType () {
      return typeof this.options.option.series[0].radius === 'string' ? 'pie' : 'ring';
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
    // 修改图表形状
    changeShape (shape) {
      switch (shape) {
        case 'pie':
          this.options.option.series[0].radius = '60%';
          break;
        case 'ring':
          this.options.option.series[0].radius = ['40%', '70%'];
      }
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
