<template>
  <el-drawer
      title="修改"
      :before-close="handleClose"
      :visible.sync="show"
      direction="rtl"
      custom-class="demo-drawer"
      :show-close="false"
      ref="drawer"
  >
    <div class="demo-drawer__content" v-if="JSON.stringify(form) !== '{}'">
      <el-form :model="form" :rules="rules" ref="form">
<!--        <el-divider>卡片</el-divider>-->
        <!--卡片标签-->
        <el-form-item label="标签" class="tags" :label-width="formLabelWidth">
          <el-tag
              :key="tag"
              v-for="tag in form.tag"
              closable
              :disable-transitions="false"
              @close="removeCardTag(tag)">
            {{ tag }}
          </el-tag>
          <el-input
              class="input-new-tag"
              v-if="cardTag.add"
              v-model="cardTag.name"
              ref="tagInput"
              size="small"
              @keyup.enter.native="submitAddCardTag()"
              @blur="submitAddCardTag()"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="addCardTag()">+ 添加标签</el-button>
        </el-form-item>
        <el-form-item label="背景" :label-width="formLabelWidth">
          <el-select v-model="form.style.total._backgroundType" placeholder="请选择" @change="handleBackgroundTypeChange">
            <el-option label="颜色" value="color"></el-option>
            <el-option label="图片" value="image"></el-option>
            <el-option label="无" value="none"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
            label="背景颜色"
            :label-width="formLabelWidth"
            v-if="form.style"
            v-show="form.style.total._backgroundType === 'color'"
        >
          <el-col :span="2">
            <el-color-picker
                v-model="form.style.total.background"
                show-alpha
                :predefine="predefineColors">
            </el-color-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="背景图片" :label-width="formLabelWidth" v-show="form.style.total._backgroundType === 'image'">
          <el-col :span="6">
            <el-upload
                class="avatar-uploader"
                ref="imgUpload"
                accept="image/*"
                name="files"
                :action="`${baseURL}/home/uploadFile`"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
            >
              <img v-if="form.style.total._imageUrl" :src="form.style.total._imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位宽" :label-width="formLabelWidth">
              <el-input-number v-model="form.w" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位高" :label-width="formLabelWidth">
              <el-input-number v-model="form.h" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="边框" :label-width="formLabelWidth">
          <el-col :span="8">
            <el-input-number v-model="form.style.total.borderwidth" @change="handleChangeBorderWidth" :min="0" :max="10"></el-input-number>
          </el-col>
          <el-col :offset="2" :span="2">
            <el-color-picker
                v-model="form.style.total.borderColor"
                show-alpha
                :predefine="predefineColors">
            </el-color-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="分割线" :label-width="formLabelWidth">
          <el-col :span="8">
            <el-input-number v-model="form.style.splitLineWidth" @change="handleChangeSplitLine" :min="0" :max="10"></el-input-number>
          </el-col>
          <el-col :offset="2" :span="2">
            <el-color-picker
                v-model="form.style.splitLineColor"
                @change="handleChangeSplitLine"
                show-alpha
                :predefine="predefineColors">
            </el-color-picker>
          </el-col>
        </el-form-item>
        <el-divider>标题</el-divider>
        <el-form-item label="显示标题" :label-width="formLabelWidth">
          <el-col :span="2">
            <el-switch v-model="form.style.showTitle"></el-switch>
          </el-col>
        </el-form-item>
        <el-form-item label="标题" :label-width="formLabelWidth" v-show="form.style.showTitle">
          <rich-editor v-model="form.title" :height="100"></rich-editor>
        </el-form-item>
        <el-divider>内容</el-divider>
<!--        <el-form-item label="卡片类型" :label-width="formLabelWidth">-->
<!--          <el-select v-model="form.type" placeholder="请选择" @change="handleCardTypeChange">-->
<!--            <el-option-->
<!--                v-for="item in cardTypes"-->
<!--                :key="item.value"-->
<!--                :label="item.label"-->
<!--                :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <global-card-form v-model="form" label-width="80px"></global-card-form>
        <!--文本卡片-->
        <template v-if="['text', 'datetime', 'weather', 'scroll', 'progress', 'radar', 'pie', 'line', 'bar', 'circle-bar', 'gauge', 'button', 'list'].indexOf(form.type) !== -1">
          <component :is="form.type + '-card-form'" v-model="form" label-width="80px"></component>
        </template>
        <!--图表-->
        <template v-if="typeof form.options === 'object'">
          <template v-if="form.type === 'bar/line'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="左边距" :label-width="formLabelWidth">
                  <el-input-number v-model="form.options.grid.left" :min="0" label="左边距"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="右边距" :label-width="formLabelWidth">
                  <el-input-number v-model="form.options.grid.right" :min="0" label="右边距"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="上边距" :label-width="formLabelWidth">
                  <el-input-number v-model="form.options.grid.top" :min="0" label="上边距"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="下边距" :label-width="formLabelWidth">
                  <el-input-number v-model="form.options.grid.bottom" :min="0" label="上边距"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <el-divider>提示框</el-divider>
          <el-form-item label="显示" :label-width="formLabelWidth">
            <el-col :span="2">
              <el-switch v-model="form.options.tooltip.show"></el-switch>
            </el-col>
          </el-form-item>
          <el-divider>图例</el-divider>
          <el-form-item label="显示" :label-width="formLabelWidth">
            <el-col :span="2">
              <el-switch v-model="form.options.legend.show"></el-switch>
            </el-col>
          </el-form-item>
          <div v-show="form.options.legend.show">
            <el-form-item label="方向" :label-width="formLabelWidth">
              <el-select v-model="form.options.legend.orient" placeholder="默认方向">
                <el-option label="水平" value="horizontal"></el-option>
                <el-option label="垂直" value="vertical"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="位置" :label-width="formLabelWidth">
              <el-col :span="12">
                <el-select v-model="form.options.legend.left" placeholder="默认位置">
                  <el-option label="左" value="left"></el-option>
                  <el-option label="中" value="center"></el-option>
                  <el-option label="右" value="right"></el-option>
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-select v-model="form.options.legend.top" placeholder="默认位置">
                  <el-option label="上" value="top"></el-option>
                  <el-option label="中" value="middle"></el-option>
                  <el-option label="下" value="bottom"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="图标形状" :label-width="formLabelWidth">
              <el-select v-model="form.options.legend.icon" placeholder="默认形状">
                <el-option label="圆形" value="circle"></el-option>
                <el-option label="矩形" value="rect"></el-option>
                <el-option label="圆角矩形" value="roundRect"></el-option>
                <el-option label="三角形" value="triangle"></el-option>
                <el-option label="菱形" value="diamond"></el-option>
                <el-option label="箭头形" value="arrow"></el-option>
                <el-option label="无" value="none"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文字颜色" :label-width="formLabelWidth" >
              <el-col :span="2">
                <el-color-picker
                    v-model="form.options.legend.textStyle.color"
                    show-alpha
                    :predefine="predefineColors"
                    style="vertical-align: bottom"
                >
                </el-color-picker>
              </el-col>
            </el-form-item>
          </div>
          <!--自定义颜色-->
          <el-divider>图形</el-divider>
          <el-form-item label="图形颜色" :label-width="formLabelWidth">
            <el-col :span="6" v-for="i in form.options.color.length" :key="i">
              <el-color-picker
                  v-model="form.options.color[i-1]"
                  show-alpha
                  :predefine="predefineColors"
                  style="vertical-align: bottom"
              >
              </el-color-picker>
              <el-button
                  @click="handleDeleteColor(i - 1)"
                  title="删除颜色"
                  type="danger"
                  icon="el-icon-delete"
                  circle
              ></el-button>
            </el-col>
            <el-col :span="3">
              <el-button
                  @click="handleAddColor"
                  title="添加颜色"
                  icon="el-icon-plus"
                  circle
              ></el-button>
            </el-col>
          </el-form-item>
          <!--条形/折线图-->
          <template v-if="form.type === 'bar/line'">
            <div v-for="(item, index) in form.options.series" :key="index">
              <el-divider content-position="left" v-if="form.options.series.length > 1">系列{{ index + 1 }}</el-divider>
              <el-form-item label="数据标记" :label-width="formLabelWidth">
                <el-col :span="2">
                  <el-switch v-model="item.label.show"></el-switch>
                </el-col>
              </el-form-item>
              <el-form-item label="标记位置" :label-width="formLabelWidth" v-show="item.label.show">
                <el-select v-model="item.label.position" placeholder="默认位置">
                  <el-option label="上" value="top"></el-option>
                  <el-option label="左" value="left"></el-option>
                  <el-option label="右" value="right"></el-option>
                  <el-option label="下" value="bottom"></el-option>
                  <el-option label="中间" value="inside"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </template>
          <!--饼图-->
          <template v-if="form.type === 'pie'">
            <div v-for="(item, index) in form.options.series" :key="index">
              <el-divider content-position="left" v-if="form.options.series.length > 1">系列{{ index + 1 }}</el-divider>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="内半径" :label-width="formLabelWidth">
                    <el-input-number
                        v-model="item.radiusValue[0]"
                        :min="0"
                        :max="100"
                        label="内半径"
                        @change="item.radius[0] = item.radiusValue[0] + '%'"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="外半径" :label-width="formLabelWidth">
                    <el-input-number
                        v-model="item.radiusValue[1]"
                        :min="0"
                        :max="100"
                        label="外半径"
                        @change="item.radius[1] = item.radiusValue[1] + '%'"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="数据标记" :label-width="formLabelWidth">
                    <el-col :span="2">
                      <el-switch v-model="item.label.show"></el-switch>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="引导线" :label-width="formLabelWidth" v-show="item.label.show">
                    <el-col :span="2">
                      <el-switch v-model="item.labelLine.show"></el-switch>
                    </el-col>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="标记位置" :label-width="formLabelWidth">
                <el-select v-model="item.label.position" placeholder="默认位置">
                  <el-option label="外部" value="outside"></el-option>
                  <el-option label="内部" value="inside"></el-option>
                  <el-option label="中间" value="center"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </template>
        </template>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import RichEditor from '@/components/RichEditor';
import GlobalCardForm from "@/components/GlobalCardForm";
import WeatherCardForm from "@/components/WeatherCardForm";
import DatetimeCardForm from "@/components/DatetimeCardForm";
import TextCardForm from "@/components/TextCardForm";
import ScrollCardForm from "@/components/ScrollCardForm";
import ProgressCardForm from "@/components/ProgressCardForm";
import RadarCardForm from "@/components/RadarCardForm";
import PieCardForm from "@/components/PieCardForm";
import LineCardForm from "@/components/LineCardForm";
import BarCardForm from "@/components/BarCardForm";
import CircleBarCardForm from "@/components/CircleBarCardForm";
import GaugeCardForm from "@/components/GaugeCardForm";
import ButtonCardForm from "@/components/ButtonCardForm";
import ListCardForm from "@/components/ListCardForm";
export default {
  name: "Drawer",
  components: {
    RichEditor,
    GlobalCardForm,
    WeatherCardForm,
    DatetimeCardForm,
    TextCardForm,
    ScrollCardForm,
    ProgressCardForm,
    RadarCardForm,
    PieCardForm,
    LineCardForm,
    BarCardForm,
    CircleBarCardForm,
    GaugeCardForm,
    ButtonCardForm,
    ListCardForm
  },
  props: {
    editing: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      show: false,
      loading: false,
      form: {},
      // 添加标签
      cardTag: {
        add: false,
        name: ''
      },
      formLabelWidth: '80px',
      // 可选的卡片类型
      cardTypes: [
        {
          label: '文本',
          value: 'text'
        },
        {
          label: '条形/折线图',
          value: 'bar/line'
        },
        {
          label: '饼图',
          value: 'pie'
        }
        // {
        //   label: '雷达图',
        //   value: 'radar'
        // }
      ],
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],
      rules: {
        dataType: [
          { required: true, message: '请选择按钮类型', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        companyPage: [
          { validator: (rule, value, callback) => {
              const options = JSON.parse(this.form.options);
              if (!options.companyPage) callback(new Error('请选择企业页面'));
              callback()
            }, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    projectId () {
      return this.$route.params.projectId;
    },
    pageList () {
      return this.$store.getters.getProject(this.projectId).pageList;
    },
    baseURL () {
      return process.env.VUE_APP_API_BASE_URL;
    },
    imgBaseURL () {
      return process.env.VUE_APP_IMG_BASE_URL
    },
  },
  watch: {
    editing (form) {
      this.show = !!form;
      const cache = [];
      this.form = JSON.parse(JSON.stringify(form, function(key, value) {
        if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
            return;
          }
          cache.push(value);
        }
        return value;
      })) || {}
    }
  },
  methods: {
    /**
     * 卡片类型改变事件
     * @param type 新类型: string
     */
    handleCardTypeChange (type) {
      switch (type) {
        case 'bar/line':
          this.form.options = {
            tooltip: {},
            grid: {
              top: 20,
              bottom: 20,
              left: '10%',
              right: 20
            },
            legend: {
              show: true,
              textStyle: {}
            },
            xAxis: {
              type: 'category',
              data: ['']
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              name: '',
              type: 'bar',
              data: ['']
            }]
          };
          break;
        case 'pie':
          this.form.options = {
            tooltip: {
            },
            legend: {
              show: true,
              textStyle: {}
            },
            series: [
              {
                name: '访问来源',
                type: 'pie',
                radius: '50%',
                data: [
                  {value: 1048, name: '搜索引擎'},
                  {value: 735, name: '直接访问'},
                  {value: 580, name: '邮件营销'},
                  {value: 484, name: '联盟广告'},
                  {value: 300, name: '视频广告'}
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          break;
        default:
          this.form.options = ''
      }
    },
    handleClose() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('submitEdit', this.form);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    cancelForm() {
      this.loading = false;
      this.show = false;
      clearTimeout(this.timer);
      this.$emit('submitEdit')
    },
    // 修改字体大小
    handleChangeFontsize (position) {
      this.form.style[position].fontSize = this.form.style[position].fontsize + 'px';
    },
    // 添加颜色
    handleAddColor () {
      this.form.options.color.push('');
    },
    // 删除颜色
    handleDeleteColor (index) {
      this.form.options.color.splice(index, 1);
    },
    // 数据标签显示与否切换
    handleLabelVisibleChange (bool) {
      this.form.series.forEach(item => {
        item.label.show = bool
      })
    },
    // 准备添加卡片标签
    addCardTag () {
      this.cardTag.add = true;
      this.$nextTick(() => {
        this.$refs.tagInput.focus();
      });
    },
    // 提交添加卡片标签
    submitAddCardTag () {
      let inputValue = this.cardTag.name;
      if (inputValue) {
        this.form.tag.push(inputValue);
      }
      this.cardTag.add = false;
      this.cardTag.name = '';
    },
    // 移除卡片标签
    removeCardTag (tag) {
      this.form.tag.splice(this.form.tag.indexOf(tag), 1);
    },
    // 修改卡片边框粗细
    handleChangeBorderWidth (val) {
      this.form.style.total.borderWidth = val + 'px';
    },
    // 修改卡片标题内容分割线
    handleChangeSplitLine () {
      this.form.style.splitLine = `${ this.form.style.splitLineWidth !== undefined ? this.form.style.splitLineWidth : 1 }px
       solid ${ this.form.style.splitLineColor || '#EBEEF5' }`
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
      // var reader = new FileReader();
      // const _this = this;
      // reader.readAsDataURL(file); //转化二进制流，异步方法
      // reader.onload = function () { //完成后this.result为二进制流
      //   console.log(this.result);
      //   // 页面显示文件名
      //   // var base64Str = this.result;
      //   // var startNum = base64Str.indexOf("base64,");
      //   // startNum = startNum*1 + 7;
      //   // // 去除前部格式信息（如果有需求）
      //   // var baseStr = base64Str.slice(startNum);
      //   _this.settings.imageUrl = this.result;
      //   _this.settings.background = `0 0 / 100% 100% no-repeat url(${this.result})`
      // }
    },
    /**
     * 上传成功后
     */
    // eslint-disable-next-line no-unused-vars
    handleAvatarSuccess(res, file) {
      this.form.style.total.background = `0 0 / 100% 100% no-repeat url(${this.imgBaseURL}${ res.url.split("/").map(item => encodeURIComponent(item)).join('/') })`;
      this.form.style.total._imageUrl = `${this.imgBaseURL}${ res.url.split("/").map(item => encodeURIComponent(item)).join('/') }`;
    },
    /**
     * 链接激活背景上传成功后
     */
    // eslint-disable-next-line no-unused-vars
    handleActiveAvatarSuccess(res, file) {
      this.form.style.linkActive.background = `0 0 / 100% 100% no-repeat url(${this.imgBaseURL}${ res.url.split("/").map(item => encodeURIComponent(item)).join('/') })`;
      this.form.style.linkActive._imageUrl = `${this.imgBaseURL}${ res.url.split("/").map(item => encodeURIComponent(item)).join('/') }`;
    },
    // 主要用来一键清除背景
    handleBackgroundTypeChange (val) {
      if (val === 'none') {
        console.log(this.form)
        this.form.style.total.background = 'none';
      }
    }
  }
}
</script>

<style scoped>
.el-form {
  padding-right: 20px;
}
.el-select {
  width: 100%;
}
.tags {
  text-align: left;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
