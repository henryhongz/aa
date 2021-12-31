<template>
  <el-row>
    <el-form-item label="说明" :label-width="labelWidth">
      <span class="no-warp"><span class="code">%i%</span> 天气图标 </span>
      <span class="no-warp"><span class="code">%p%</span> 省份 </span>
      <span class="no-warp"><span class="code">%c%</span> 城市 </span>
      <span class="no-warp"><span class="code">%w%</span> 天气文字 </span>
      <span class="no-warp"><span class="code">%t%</span> 温度 </span>
      <span class="no-warp"><span class="code">%wd%</span> 风向 </span>
      <span class="no-warp"><span class="code">%wp%</span> 风力等级 </span>
      <span class="no-warp"><span class="code">%h%</span> 湿度 </span>
    </el-form-item>
    <el-form-item label="内容" :label-width="labelWidth">
      <rich-editor v-model="form.options"/>
    </el-form-item>
  </el-row>
</template>

<script>
import RichEditor from '@/components/RichEditor';
export default {
  name: "WeatherCardForm",
  components: {
    RichEditor
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
      weatherList: []
    }
  },
  watch: {
    value: {
      handler: function () {
        this.form = this.value
      },
      immediate: true
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
