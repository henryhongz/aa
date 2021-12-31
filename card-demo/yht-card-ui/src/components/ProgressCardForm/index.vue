<template>
  <el-row>
    <el-row>
      <el-form-item label="数据接口" :label-width="labelWidth">
        <el-select v-model="form.difId" placeholder="请选择" filterable>
          <el-option v-for="item in chartApi" :label="item.name" :value="item.id" :key="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="接口参数" :label-width="labelWidth">
        <el-col :span="12">
          <el-input v-model="form.param" placeholder="请输入接口参数"></el-input>
        </el-col>
      </el-form-item>
      <el-divider content-position="left">总计</el-divider>
      <el-form-item label="显示" :label-width="labelWidth">
        <el-switch v-model="options.total._show"></el-switch>
      </el-form-item>
      <div v-show="options.total._show">
        <el-form-item label="颜色" :label-width="labelWidth">
          <el-color-picker v-model="options.total.color" :predefine="predefineColors" show-alpha></el-color-picker>
        </el-form-item>
        <el-form-item label="名称" :label-width="labelWidth">
          <el-col :span="12">
            <el-input placeholder="请输入名称" v-model="options.total._name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="单位" :label-width="labelWidth">
          <el-col :span="12">
            <el-input placeholder="请输入单位" v-model="options.total._unit"></el-input>
          </el-col>
        </el-form-item>
      </div>
      <el-divider content-position="left">名称</el-divider>
      <el-form-item label="颜色" :label-width="labelWidth">
        <el-color-picker v-model="options.name.color" :predefine="predefineColors" show-alpha></el-color-picker>
      </el-form-item>
      <el-form-item label="字号" :label-width="labelWidth">
        <el-input-number :value="parseInt(options.name.fontSize)" :min="12" :max="100" @change="changeFontSize('name', $event)"></el-input-number>
      </el-form-item>
      <el-form-item label="加粗" :label-width="labelWidth">
        <el-switch
            v-model="options.name.fontWeight"
            active-value="bold"
            inactive-value="normal"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="浮动" :label-width="labelWidth">
        <el-select v-model="options.name.float" placeholder="请选择">
          <el-option label="左浮动" value="left"/>
          <el-option label="右浮动" value="right"/>
          <el-option label="不浮动" value="none"/>
        </el-select>
      </el-form-item>
      <el-form-item label="对齐方式" :label-width="labelWidth">
        <el-select v-model="options.name.textAlign" placeholder="请选择">
          <el-option label="居左" value="left"/>
          <el-option label="居中" value="center"/>
          <el-option label="居右" value="right"/>
        </el-select>
      </el-form-item>
      <el-form-item label="宽高" :label-width="labelWidth">
        <el-col :span="12">
          <el-input placeholder="请输入宽度" v-model="options.name.width">
            <template slot="prepend">宽度</template>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input placeholder="请输入高度" v-model="options.name.height">
            <template slot="prepend">高度</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="行高" :label-width="labelWidth">
        <el-col :span="12">
          <el-input placeholder="请输入行高" v-model="options.name.lineHeight"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="背景" :label-width="labelWidth">
        <el-select v-model="options.name._backgroundType" placeholder="请选择">
          <el-option label="颜色" value="color" />
          <el-option label="图片" value="image" />
        </el-select>
      </el-form-item>
      <el-form-item label="背景颜色" v-if="options.name._backgroundType === 'color'" :label-width="labelWidth">
        <el-col :span="2">
          <el-color-picker
              v-model="options.name.background"
              show-alpha
              :predefine="predefineColors"
          ></el-color-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="背景图片" v-if="options.name._backgroundType === 'image'" :label-width="labelWidth">
        <el-col :span="6">
          <el-upload
              class="avatar-uploader"
              ref="imgUpload"
              accept="image/*"
              name="files"
              :action="`${baseURL}/home/uploadFile`"
              :show-file-list="false"
              :on-success="handleNameSuccess"
              :before-upload="beforeAvatarUpload"
          >
            <img v-if="options.name._imageUrl" :src="options.name._imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
      </el-form-item>
      <el-divider content-position="left">数值</el-divider>
      <el-form-item label="单位" :label-width="labelWidth">
        <el-col :span="12">
          <el-input placeholder="请输入单位" v-model="options.value._unit"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="颜色" :label-width="labelWidth">
        <el-color-picker v-model="options.value.color" :predefine="predefineColors" show-alpha></el-color-picker>
      </el-form-item>
      <el-form-item label="字号" :label-width="labelWidth">
        <el-input-number :value="parseInt(options.value.fontSize)" :min="12" :max="100" @change="changeFontSize('value', $event)"></el-input-number>
      </el-form-item>
      <el-form-item label="加粗" :label-width="labelWidth">
        <el-switch
            v-model="options.value.fontWeight"
            active-value="bold"
            inactive-value="normal"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="浮动" :label-width="labelWidth">
        <el-select v-model="options.value.float" placeholder="请选择">
          <el-option label="左浮动" value="left"/>
          <el-option label="右浮动" value="right"/>
          <el-option label="不浮动" value="none"/>
        </el-select>
      </el-form-item>
      <el-form-item label="对齐方式" :label-width="labelWidth">
        <el-select v-model="options.value.textAlign" placeholder="请选择">
          <el-option label="居左" value="left"/>
          <el-option label="居中" value="center"/>
          <el-option label="居右" value="right"/>
        </el-select>
      </el-form-item>
      <el-form-item label="宽高" :label-width="labelWidth">
        <el-col :span="12">
          <el-input placeholder="请输入宽度" v-model="options.value.width">
            <template slot="prepend">宽度</template>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input placeholder="请输入高度" v-model="options.value.height">
            <template slot="prepend">高度</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="行高" :label-width="labelWidth">
        <el-col :span="12">
          <el-input placeholder="请输入行高" v-model="options.value.lineHeight"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="背景" :label-width="labelWidth">
        <el-select v-model="options.value._backgroundType" placeholder="请选择">
          <el-option label="颜色" value="color" />
          <el-option label="图片" value="image" />
        </el-select>
      </el-form-item>
      <el-form-item label="背景颜色" v-if="options.value._backgroundType === 'color'" :label-width="labelWidth">
        <el-color-picker
            v-model="options.value.background"
            show-alpha
            :predefine="predefineColors"
        ></el-color-picker>
      </el-form-item>
      <el-form-item label="背景图片" v-if="options.value._backgroundType === 'image'" :label-width="labelWidth">
        <el-upload
            class="avatar-uploader"
            ref="imgUpload"
            accept="image/*"
            name="files"
            :action="`${baseURL}/home/uploadFile`"
            :show-file-list="false"
            :on-success="handleValueSuccess"
            :before-upload="beforeAvatarUpload"
        >
          <img v-if="options.value._imageUrl" :src="options.value._imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-divider content-position="left">进度条</el-divider>
      <el-form-item label="宽度" :label-width="labelWidth">
        <el-col :span="12">
          <el-input placeholder="默认" v-model="options.progress.height"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="圆角" :label-width="labelWidth">
        <el-col :span="12">
          <el-input placeholder="请输入圆角大小" v-model="options.progress.borderRadius"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="颜色组" :label-width="labelWidth">
        <el-row v-for="(item, index) in options.progress._colorStops" :key="index">
          <el-col :span="4">
            <el-color-picker
                v-model="item.color"
                show-alpha
                :predefine="predefineColors"
                @change="updateProgressColor"
            ></el-color-picker>
          </el-col>
          <el-col :span="12" :offset="2">
            <el-input placeholder="请输入位置" v-model="item.stop" @change="updateProgressColor">
              <template slot="prepend">位置</template>
            </el-input>
          </el-col>
          <el-col :span="4" :offset="2">
            <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="removeColorStop(index)"
                v-show="options.progress._colorStops.length > 1"
            ></el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-button icon="el-icon-plus" circle @click="addColorStop"></el-button>
        </el-row>
      </el-form-item>
    </el-row>
  </el-row>
</template>

<script>
export default {
  name: "ProgressCardForm",
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
      predefineColors: ['rgba(0, 0, 0, 0)', 'rgba(70, 71, 76, 0.8)', '#ffcf2c', '#c16801', '#cf9654', '#db6429', '#0edbbb'],
      options: {
        total: {},
        name: {
          color: '#000',
          fontSize: '16px'
        },
        value: {
          color: '#000',
          fontSize: '16px'
        },
        progress: {
          _colorStops: [{
            color: '#f5b174',
            stop: 0
          }],
          background: '#f5b174'
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
    baseURL () {
      return process.env.VUE_APP_API_BASE_URL;
    },
    imgBaseURL () {
      return process.env.VUE_APP_IMG_BASE_URL
    },
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
    updateOptions (str) {
      if (str) this.form.options = str;
      else this.form.options = JSON.stringify(this.options);
    },
    changeFontSize (key, value) {
      this.options[key].fontSize = value + 'px';
    },
    /**
     * 图片上传前
     * 类型检查
     * @param file
     * @returns {boolean}
     */
    beforeAvatarUpload(file) {
      if (!file.type.match(/^image\/.+$/)) {
        this.$message.error('只能上传图片格式文件！');
        return false;
      }
      // 最大限制10MB
      if (file.size / 1024 / 1024 >= 10) {
        this.$message.error('图片最大限制为10MB！');
        return false;
      }
    },
    /**
     * 上传成功后
     */
    // eslint-disable-next-line no-unused-vars
    handleNameSuccess(res, file) {
      this.options.name.background = `0 0 / 100% 100% no-repeat url(${this.imgBaseURL}${ res.url.split("/").map(item => encodeURIComponent(item)).join('/') })`;
      this.options.name._imageUrl = `${this.imgBaseURL}${ res.url.split("/").map(item => encodeURIComponent(item)).join('/') }`;
    },
    /**
     * 上传成功后
     */
    // eslint-disable-next-line no-unused-vars
    handleValueSuccess(res, file) {
      this.options.value.background = `0 0 / 100% 100% no-repeat url(${this.imgBaseURL}${ res.url.split("/").map(item => encodeURIComponent(item)).join('/') })`;
      this.options.value._imageUrl = `${this.imgBaseURL}${ res.url.split("/").map(item => encodeURIComponent(item)).join('/') }`;
    },
    // 添加进度条背景颜色项
    addColorStop () {
      this.options.progress._colorStops.push({
        color: '#0ff',
        stop: 0
      })
    },
    // 移除进度条背景颜色项
    removeColorStop (index) {
      this.options.progress._colorStops.splice(index, 1);
    },
    // 生成进度条背景颜色
    updateProgressColor () {
      console.log(111)
      const style = this.options.progress;
      if (style._colorStops.length === 1) {
        style.background = style._colorStops[0].color;
      } else {
        const str = style._colorStops.map(item => item.color + ' ' + item.stop).join(', ')
        style.background = `repeating-linear-gradient(90deg, ${ str })`
      }
    }
  },
  created () {
    try {
      this.options = JSON.parse(this.form.options);
    } catch (e) {
      console.log(e)
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
