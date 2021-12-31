<template>
  <el-row>
    <el-form-item label="按钮类型" :label-width="labelWidth" prop="dataType">
      <el-select v-model="form.dataType" placeholder="请选择" @change="clearDifId">
        <el-option label="巡航按钮" value="circle"/>
        <el-option label="企业搜索按钮" value="search"/>
      </el-select>
    </el-form-item>
    <el-form-item label="企业页面" :label-width="labelWidth" v-if="form.dataType === 'search'" prop="companyPage">
      <el-select v-model="options.companyPage" placeholder="请选择" @change="clearDifId">
        <el-option v-for="item in pageList" :label="item.title" :value="item.id" :key="item.id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="按钮内容" :label-width="labelWidth">
      <rich-editor v-model="options.normal"/>
    </el-form-item>
    <el-form-item label="激活内容" :label-width="labelWidth">
      <rich-editor v-model="options.active"/>
    </el-form-item>
  </el-row>
</template>

<script>
import RichEditor from '@/components/RichEditor';

export default {
  name: "ButtonCardForm",
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
      options: {
        normal: '',
        active: ''
      },
      apiInfo: []
    }
  },
  computed: {
    projectId () {
      return this.$route.params.projectId;
    },
    optionsString () {
      return JSON.stringify(this.options);
    },
    pageList () {
      return this.$store.getters.getProject(this.projectId).pageList;
    },
  },
  watch: {
    value: {
      handler: function () {
        this.form = this.value
      },
      immediate: true
    },
    optionsString (val) {
      this.form.options = val;
    }
  },
  methods: {
    clearDifId () {
      delete this.form.difId
    },
  },
  created () {
    this.options = JSON.parse(this.form.options)
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
