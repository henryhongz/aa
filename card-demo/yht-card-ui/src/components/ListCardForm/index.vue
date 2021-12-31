<template>
  <el-row>
    <el-form-item label="数据接口" :label-width="labelWidth">
      <el-select v-model="form.difId" placeholder="请选择" @change="getApiInfo" filterable >
        <el-option v-for="item in apiList" :label="item.name" :value="item.id" :key="item.id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="接口参数" :label-width="labelWidth">
      <el-col :span="12">
        <el-input v-model="form.param" placeholder="请输入接口参数"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="占位符" :label-width="labelWidth">
      <span class="no-warp" v-for="item in apiInfo" :key="item.key" :title="'数据示例：' + item.content">
        {{ item.key }}: <span class="code">%{{ item.key }}%</span>
      </span>
    </el-form-item>
    <el-form-item label="内容模板" :label-width="labelWidth">
      <rich-editor v-model="form.options" :height="100"></rich-editor>
    </el-form-item>
    <el-form-item label="注意：" :label-width="labelWidth" style="color: red;">
      必须使用表格作为模板，表头作为列表头部（如果有），表格内容作为列表内容
    </el-form-item>
  </el-row>
</template>

<script>
import request from "@/libs/remoteRequest";
import RichEditor from "@/components/RichEditor";
export default {
  name: "ListCardForm",
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
      apiInfo: [],
      loading: false
    }
  },
  computed: {
    apiList () {
      return this.$store.getters.listApi;
    }
  },
  watch: {
    value: {
      handler: function () {
        this.form = this.value
      },
      immediate: true
    },
    titleTpl () {
      this.updateOptions();
    },
    contentTpl () {
      this.updateOptions();
    }
  },
  methods: {
    getApiInfo (id, unrefresh) {
      const api = this.apiList.find(item => item.id === id);
      if (!api) return;
      this.form.dataInterface = api.dtInterface;
      this.loading = true;
      request({
        url: api.dtInterface,
        method: 'get'
      }).then(res => {
        this.apiInfo = [];
        if (!(res.data instanceof Array) || !res.data[0]) return;
        for (const key in res.data[0]) {
          this.apiInfo.push({
            key: key,
            value: res.data[0][key]
          })
        }
      }).finally(() => {
        if (!unrefresh) this.checkList = [];
        this.loading = false;
      })
    },
  },
  created () {
    if (this.form.difId) this.getApiInfo(this.form.difId);
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
