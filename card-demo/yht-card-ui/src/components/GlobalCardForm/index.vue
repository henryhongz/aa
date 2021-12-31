<template>
  <el-row>
    <el-form-item label="内容边距" :label-width="labelWidth">
      <el-col :span="12">
        <el-input v-model="form.style.content.padding" placeholder="请输入卡片内容边距"/>
      </el-col>
    </el-form-item>
  </el-row>
</template>

<script>
export default {
  name: "GlobalCardForm",
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
      cityList: [
        {
          code: '330212',
          city: '鄞州区'
        }
      ]
    }
  },
  watch: {
    value: {
      handler: function () {
        this.form = this.value
      },
      immediate: true
    },
  }
}
</script>

<style scoped>

</style>
