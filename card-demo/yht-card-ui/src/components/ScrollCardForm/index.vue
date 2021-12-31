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
    <el-form-item label="隐藏标题" :label-width="labelWidth">
      <el-switch
          v-model="style._titleDisplay"
          inactive-value="block"
          active-value="none"
          @change="updateOptions"
      >
      </el-switch>
    </el-form-item>
    <el-form-item label="字体颜色" :label-width="labelWidth">
      <el-color-picker v-model="style.color" show-alpha @change="updateOptions"></el-color-picker>
    </el-form-item>
    <el-form-item label="字体大小" :label-width="labelWidth">
      <el-input-number v-model="style._fontSize" :min="12" :max="100" @change="handleChangeFontsize"></el-input-number>
    </el-form-item>
    <el-form-item label="背景颜色" :label-width="labelWidth">
      <el-color-picker v-model="style.background" show-alpha @change="updateOptions"></el-color-picker>
    </el-form-item>
    <el-form-item label="总行高" :label-width="labelWidth">
      <el-input-number v-model="lineHeight" @change="updateOptions" :min="1" :step="0.01"></el-input-number>
    </el-form-item>
    <el-form-item label="背景行高" :label-width="labelWidth">
      <el-input-number v-model="style.lineHeight" @change="updateOptions" :min="1" :step="0.01"></el-input-number>
    </el-form-item>
    <el-form-item label="对齐方式" :label-width="labelWidth">
      <el-select v-model="style.textAlign" placeholder="请选择" @change="updateOptions">
        <el-option label="左对齐" value="left"/>
        <el-option label="居中对齐" value="center"/>
        <el-option label="右对齐" value="right"/>
      </el-select>
    </el-form-item>
    <el-form-item label="显示条数" :label-width="labelWidth">
      <el-input-number v-model="maxLine" @change="updateOptions" :min="1"></el-input-number>
    </el-form-item>
    <el-form-item label="数据字段" :label-width="labelWidth">
      <div v-show="!form.difId">请选择数据接口</div>
      <el-checkbox-group v-model="checkList" v-loading="loading">
        <el-row v-for="item in apiKeys" :key="item.key">
          <el-checkbox :label="item.key">
            <span :title="'示例数据：' + item.content">{{ item.key }}</span>
          </el-checkbox>
          <el-row v-show="checkList.indexOf(item.key) !== -1">
            <el-input v-model="item.title" placeholder="请输入字段标题" size="medium" @change="updateOptions">
              <template slot="prepend">标题</template>
            </el-input>
            <el-input v-model="item.width" placeholder="请输入占据宽度" size="medium" @change="updateOptions">
              <template slot="prepend">宽度</template>
            </el-input>
          </el-row>
        </el-row>
      </el-checkbox-group>
    </el-form-item>
  </el-row>
</template>

<script>
import request from "../../libs/remoteRequest";
export default {
  name: "ScrollCardForm",
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
      apiKeys: [],
      checkList: [],
      style: {},
      maxLine: 5,
      lineHeight: 2,
      loading: false
    }
  },
  computed: {
    apiList () {
      return this.$store.getters.listApi
    }
  },
  watch: {
    value: {
      handler: function () {
        this.form = this.value
      },
      immediate: true
    },
    checkList () {
      this.updateOptions();
    }
  },
  methods: {
    getApiInfo (id, unrefresh) {
      const api = this.apiList.find(item => item.id === id);
      if (!api) return;
      this.form.dataInterface = api.dtInterface;
      this.loading = true;
      return new Promise(resolve => {
        request({
          url: api.dtInterface,
          method: 'get'
        }).then(res => {
          if (res.data instanceof Array && res.data.length) {
            this.apiKeys = [];
            for (const key in res.data[0]) {
              this.apiKeys.push({
                key: key,
                content: res.data[0][key],
                title: '',
                width: ''
              })
            }
          } else {
            this.apiKeys = [];
          }
          resolve()
        }).finally(() => {
          if (!unrefresh) this.checkList = [];
          this.loading = false;
        })
      })
    },
    updateOptions () {
      const columns = [];
      this.checkList.forEach(key => {
        columns.push(this.apiKeys.find(item => item.key === key));
      })
      this.form.options = JSON.stringify({
        columns: columns,
        maxLine: this.maxLine,
        lineHeight: this.lineHeight,
        style: this.style
      });
    },
    handleChangeFontsize () {
      this.style.fontSize = this.style._fontSize + 'px';
      this.updateOptions();
    }
  },
  created () {
    if (this.form.difId) {
      this.getApiInfo(this.form.difId, true).then(() => {
        try {
          const options = JSON.parse(this.form.options);
          this.maxLine = options.maxLine;
          this.lineHeight = options.lineHeight;
          this.style = options.style;
          options.columns.forEach(item => {
            this.checkList.push(item.key);
            const column = this.apiKeys.find(elem => elem.key === item.key) || {};
            column.title = item.title || '';
            column.width = item.width || '';
          })
        } catch (e) { e }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
