<template>
  <el-row>
    <el-form-item label="说明" :label-width="labelWidth">
      <span class="no-warp"><span class="code">%yyyy%</span> 四位年份 </span>
      <span class="no-warp"><span class="code">%yy%</span> 末二位年份 </span>
      <span class="no-warp"><span class="code">%MM%</span> 月份 </span>
      <span class="no-warp"><span class="code">%dd%</span> 日期 </span>
      <span class="no-warp"><span class="code">%e%</span> 星期(数字) </span>
      <span class="no-warp"><span class="code">%E%</span> 星期(中文) </span>
      <span class="no-warp"><span class="code">%HH%</span> 小时(24小时制) </span>
      <span class="no-warp"><span class="code">%hh%</span> 小时(12小时制) </span>
      <span class="no-warp"><span class="code">%mm%</span> 分 </span>
      <span class="no-warp"><span class="code">%ss%</span> 秒 </span>
    </el-form-item>
    <el-form-item label="内容" :label-width="labelWidth">
      <rich-editor v-model="form.options"/>
    </el-form-item>
  </el-row>
</template>

<script>
import RichEditor from '@/components/RichEditor';
export default {
  name: "DatetimeCardForm",
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
      form: {}
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
