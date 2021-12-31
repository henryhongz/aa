<template>
  <el-row>
    <el-form-item label="数据类型" :label-width="labelWidth">
      <el-select v-model="form.dataType" placeholder="请选择" @change="clearDifId">
        <el-option label="静态数据" value="static"/>
        <el-option label="动态数据" value="dynamic"/>
        <el-option label="数据对象" value="object"/>
      </el-select>
    </el-form-item>
    <el-row v-show="form.dataType === 'static'">
      <el-divider>链接</el-divider>
      <el-form-item label="链接到" :label-width="labelWidth">
        <el-select v-model="form.link" placeholder="无" clearable>
          <el-option
              v-for="item in pageList"
              :key="item.id"
              :label="item.title"
              :value="`/${projectId}/${item.id}`">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="激活内容" :label-width="labelWidth" v-show="form.link">
        <rich-editor v-model="form.style._activeContent"></rich-editor>
      </el-form-item>
    </el-row>
    <el-row v-show="form.dataType === 'dynamic'">
      <el-form-item label="数据接口" :label-width="labelWidth">
        <el-select v-model="form.difId" placeholder="请选择" @change="changeApi('numberApi', $event)" filterable>
          <el-option v-for="item in numberApi" :label="item.name" :value="item.id" :key="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="接口参数" :label-width="labelWidth">
        <el-col :span="12">
          <el-input v-model="form.param" placeholder="请输入接口参数"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="说明" :label-width="labelWidth">
        数据占位符: <span class="code">%d%</span>
      </el-form-item>
    </el-row>
    <el-row v-show="form.dataType === 'object'">
      <el-form-item label="数据接口" :label-width="labelWidth">
        <el-select v-model="form.difId" placeholder="请选择" @change="getApiInfo" filterable >
          <el-option v-for="item in objectApi" :label="item.name" :value="item.id" :key="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="接口参数" :label-width="labelWidth">
        <el-col :span="12">
          <el-input v-model="form.param" placeholder="请输入接口参数"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="说明" :label-width="labelWidth">
        <span v-if="!apiInfo.length">请选择接口</span>
        <span class="no-warp" v-for="item in apiInfo" :key="item.key" :title="'数据示例：' + item.content">
          {{ item.key }}: <span class="code">%{{ item.key }}%</span>
        </span>
      </el-form-item>
    </el-row>
    <el-form-item label="内容" :label-width="labelWidth">
      <rich-editor v-model="form.options"/>
    </el-form-item>
  </el-row>
</template>

<script>
import RichEditor from '@/components/RichEditor';
import request from "../../libs/remoteRequest";
export default {
  name: "TextCardForm",
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
      apiInfo: []
    }
  },
  computed: {
    projectId () {
      return this.$route.params.projectId;
    },
    pageList () {
      return this.$store.getters.getProject(this.projectId).pageList;
    },
    numberApi () {
      return this.$store.getters.numberApi;
    },
    objectApi () {
      return this.$store.getters.objectApi;
    }
  },
  watch: {
    value: {
      handler: function () {
        this.form = this.value
      },
      immediate: true
    }
  },
  methods: {
    clearDifId () {
      delete this.form.difId
    },
    getApiInfo (id) {
      this.changeApi('objectApi', id);
      const api = this.objectApi.find(item => item.id === id);
      if (!api) return;
      request({
        url: api.dtInterface,
        methods: 'get'
      }).then(res => {
        this.apiInfo = [];
        for (const key in res.data) {
          this.apiInfo.push({
            key: key,
            content: res.data[key]
          })
        }
      })
    },
    changeApi (type, apiId) {
      const api = this[type].find(item => item.id === apiId);
      api && (this.form.dataInterface = api.dtInterface);
    }
  },
  created () {
    if (this.form.dataType === 'object') {
      this.getApiInfo(this.form.difId);
    }
    this.form.dataType = this.form.dataType || 'static';
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
