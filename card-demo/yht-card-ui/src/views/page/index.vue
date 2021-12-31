<template>
  <div class="page">
    <el-row>
      <el-col :span="12" style="text-align: left">
        <el-button type="primary" @click="handleCreateCard">新增卡片</el-button>
        <el-button type="primary" @click="select = true">卡片池</el-button>
        <el-button type="primary" @click="handleOutRange">出界清除</el-button>
        <el-button type="primary" @click="handleSavePage">保存修改</el-button>
        共{{ layout.length }}个
      </el-col>
      <el-col :span="12" style="text-align: right;">
        <el-tooltip class="item" effect="dark" content="设为首页" placement="bottom">
          <el-button :type="isIndex ? 'primary' : 'text'" icon="el-icon-house" circle @click="handleSetHome"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="全屏" placement="bottom">
          <el-button type="info" icon="el-icon-full-screen" circle @click="$store.commit('changeFullscreenFlag', true)"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="页面设置" placement="bottom">
          <el-button icon="el-icon-setting" circle @click="settings.show = true"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="删除页面" placement="bottom">
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDeletePage"></el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <div class="grid-layout" :class="{ 'full-screen': fullScreen }">
      <tdt-map v-if="showMap"></tdt-map>
      <grid-layout
          ref="grid"
          :layout="layout"
          :col-num="gridX"
          :max-rows="gridY"
          :row-height="gridHeight / gridY"
          :is-draggable="true"
          :is-resizable="true"
          :vertical-compact="false"
          :prevent-collision="true"
          :margin="[0, 0]"
          :use-css-transforms="false"
          :style="{ background: settings.background, height: '100%' }"
      >
        <card
            v-for="item in layout"
            :key="item.i"
            :params="item"
            @edit="handleEditCard"
            @delete="handleDeleteCard"
        />
      </grid-layout>
    </div>
    <el-dialog
        title="新增卡片"
        :visible.sync="dialogVisible"
        width="30%"
        :close-on-click-modal="false"
        :before-close="handleCloseDialog"
    >
      <!--预览-->
<!--      <el-row class="pre-view">-->
<!--        <card :params="card" :grid="false"></card>-->
<!--      </el-row>-->
      <el-form label-width="80px" :model="card" :rules="cardRules" ref="createCard">
        <el-row>
          <el-col :span="12">
            <el-form-item label="卡片宽度" prop="w">
              <el-input-number v-model="card.w" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="卡片高度" prop="h">
              <el-input-number v-model="card.h" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="卡片类型" prop="type">
          <el-select v-model="card.type" placeholder="请选择" @change="handleCardTypeChange">
            <el-option
                v-for="item in cardTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <rich-editor v-model="card.title" :height="50"></rich-editor>
        </el-form-item>
        <global-card-form v-model="card"></global-card-form>
        <component :is="card.type + '-card-form'" v-model="card"></component>
<!--        &lt;!&ndash;图表配置项&ndash;&gt;-->
<!--        <template v-else-if="typeof card.options === 'object'">-->
<!--&lt;!&ndash;          <el-form-item label="显示图例">&ndash;&gt;-->
<!--&lt;!&ndash;            <el-col :span="3">&ndash;&gt;-->
<!--&lt;!&ndash;              <el-switch v-model="card.options.legend.show"></el-switch>&ndash;&gt;-->
<!--&lt;!&ndash;            </el-col>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-form-item>&ndash;&gt;-->
<!--          &lt;!&ndash;折线图卡片专属表单&ndash;&gt;-->
<!--          <div v-if="card.type === 'bar/line'">-->
<!--            <el-form-item label="数据">-->
<!--              <el-col :span="4">-->
<!--                <el-link icon="el-icon-plus" type="primary" :underline="false" @click="handleAddData">添加数据</el-link>-->
<!--              </el-col>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="x轴">-->
<!--              <el-col :span="12" v-for="i in card.options.xAxis.data.length" :key="i" style="margin-bottom: 18px;">-->
<!--                <el-col :span="16">-->
<!--                  <el-form-item :prop="`options.xAxis.data.${i - 1}`" :rules="cardRules.dataName">-->
<!--                    <el-input v-model="card.options.xAxis.data[i - 1]" placeholder="请输入数据名"></el-input>-->
<!--                  </el-form-item>-->
<!--                </el-col>-->
<!--                <el-col :span="8">-->
<!--                  <el-button v-show="card.options.xAxis.data.length > 1" @click.prevent="handleDeleteData(card.options.xAxis.data, i - 1)">删除</el-button>-->
<!--                </el-col>-->
<!--              </el-col>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="系列">-->
<!--              <el-col :span="4">-->
<!--                <el-link icon="el-icon-plus" :underline="false" @click="handleAddSeries">添加系列</el-link>-->
<!--              </el-col>-->
<!--            </el-form-item>-->
<!--            <div v-for="(series, si) in card.options.series" :key="si">-->
<!--              &lt;!&ndash;条形图、折线图可以混合&ndash;&gt;-->
<!--              <el-form-item :label="'系列' + (si + 1)" prop="type">-->
<!--                <el-select v-model="series.type" placeholder="请选择" @change="handleChartTypeChange(si)">-->
<!--                  <el-option label="条形图" value="bar"></el-option>-->
<!--                  <el-option label="折线图" value="line"></el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="系列名" :prop="`options.series.${si}.name`" :rules="cardRules.seriesName">-->
<!--                <el-input v-model="series.name" placeholder="请输入系列名"></el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="数据">-->
<!--                <el-col :span="12" v-for="di in card.options.xAxis.data.length" :key="`${si}-${di - 1}`" style="margin-bottom: 18px;">-->
<!--                  <el-form-item :prop="`options.series.${si}.data.${di - 1}`" :rules="cardRules.dataValue">-->
<!--                    <el-input v-model.number="card.options.series[si].data[di - 1]" placeholder="请输入数据值"></el-input>-->
<!--                  </el-form-item>-->
<!--                </el-col>-->
<!--              </el-form-item>-->
<!--            </div>-->
<!--          </div>-->
<!--          &lt;!&ndash;饼图卡片专属表单&ndash;&gt;-->
<!--          <div v-else-if="card.type === 'pie-static'">-->
<!--            <el-form-item label="系列">-->
<!--              <el-row>-->
<!--                <el-col :span="4">-->
<!--                  <el-link icon="el-icon-plus" :underline="false" @click="handleAddSeries">添加系列</el-link>-->
<!--                </el-col>-->
<!--              </el-row>-->
<!--            </el-form-item>-->
<!--            <div v-for="(series, si) in card.options.series" :key="si">-->
<!--              <el-form-item :label="'系列' + (si + 1)" :prop="`options.series.${si}.name`" :rules="cardRules.seriesName">-->
<!--                <el-input v-model="series.name" placeholder="请输入系列名"></el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="数据">-->
<!--                <el-row>-->
<!--                  <el-col :span="4">-->
<!--                    <el-link icon="el-icon-plus" :underline="false" @click="handleAddData(series.data)">添加数据</el-link>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row v-for="(item, di) in series.data" :key="`${si},${di}`" style="margin-bottom: 18px;">-->
<!--                  <el-col :span="10">-->
<!--                    <el-form-item :prop="`options.series.0.data.${di}.name`" :rules="cardRules.dataName">-->
<!--                      <el-input v-model="card.options.series[0].data[di].name" placeholder="请输入数据名"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="10">-->
<!--                    <el-form-item :prop="`options.series.${si}.data.${di}.value`" :rules="cardRules.dataValue">-->
<!--                      <el-input v-model.number="item.value" placeholder="请输入数据值"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="4">-->
<!--                    <el-button @click.prevent="handleDeleteData(series.data, di)">删除</el-button>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--              </el-form-item>-->
<!--            </div>-->
<!--          </div>-->
<!--        </template>-->
<!--        &lt;!&ndash;代码生成图表&ndash;&gt;-->
<!--        <el-form-item v-if="card.type === 'chart'" label="图表参数">-->
<!--          <el-input-->
<!--              type="textarea"-->
<!--              :autosize="{ minRows: 4 }"-->
<!--              placeholder="请输入内容"-->
<!--              v-model="card.options">-->
<!--          </el-input>-->
<!--        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCreateCard">确 定</el-button>
      </span>
    </el-dialog>
    <!--选择组件对话框-->
    <el-dialog
        title="选择组件"
        :visible.sync="select"
        width="600px"
        :close-on-click-modal="false"
        :before-close="() => { select = false }"
    >
      <el-input
          placeholder='请输入卡片标签(多个标签请以 " "(空格) 或 ","(逗号) 分割)'
          v-model="cardTagSearch"
          class="input-with-select"
          @input="handleCardTagSearch"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
        <el-button slot="append" icon="el-icon-search" @click="handleCardTagSearch"></el-button>
      </el-input>
      <div v-loading="searchingFlag" style="min-height: 200px;background: #ccc" v-infinite-scroll="loadCardPool">
        <el-empty v-show="!cardList.length && this.cardTagSearch" description="暂无卡片"></el-empty>
        <div v-show="!cardList.length && !this.cardTagSearch">输入卡片标签进行搜索</div>
        <el-row v-for="item in cardPool" :key="item.i" class="card-component" style="overflow: auto">
          <el-col :span="20">
            <el-row class="tags">
              标签：
              <el-tag
                  :key="tag"
                  v-for="tag in item.tag"
                  :disable-transitions="false"
              >
                {{ tag }}
              </el-tag>
              <span v-if="!item.tag.length">无标签</span>
            </el-row>
            <card :ref="`card-${item.i}`" :params="item" :grid="false"/>
          </el-col>
          <el-col :span="4">
            <el-row>
              <el-button v-show="item.type !== 'text'" plain @click="handleRefreshComponent(item.i)">刷新</el-button>
            </el-row>
            <el-row>
              <el-button plain @click="handleRefererComponent(item)">引用</el-button>
            </el-row>
            <el-row>
              <el-button type="primary" @click="handleCopyComponent(item)">复制</el-button>
            </el-row>
            <el-row>
              <el-button type="danger" @click="handleDeleteComponent(item.i)">删除</el-button>
            </el-row>
          </el-col>
        </el-row>
        <p v-if="cardPool.length && cardPool.length === cardList.length">没有更多了</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="select = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!--设置对话框-->
    <el-dialog title="页面设置" :visible.sync="settings.show" width="30%" :before-close="handleCancelSetting">
      <el-form :model="settings" ref="settings">
        <el-form-item label="标题" label-width="80px">
          <el-input v-model="title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="背景" label-width="80px">
          <el-select v-model="settings.backgroundType" placeholder="请选择" @change="handleChangeBackgroundType">
            <el-option label="颜色" value="color"></el-option>
            <el-option label="图片" value="image"></el-option>
            <el-option label="天地图" value="map"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="背景颜色" v-if="settings.backgroundType === 'color'" label-width="80px">
          <el-col :span="2">
            <el-color-picker
                v-model="settings.background"
                show-alpha
                :predefine="predefineColors"
            ></el-color-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="背景图片" v-else-if="settings.backgroundType === 'image'" label-width="80px">
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
              <img v-if="settings.imageUrl" :src="settings.imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
        </el-form-item>
        <template v-else-if="settings.backgroundType === 'map'">
          <el-form-item label="跳转到" label-width="80px">
            <el-select v-model="settings.mapTo" placeholder="不跳转" clearable>
              <el-option v-for="item in pageList" :label="item.title" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编辑时隐藏天地图" label-width="80px">
            <el-switch v-model="settings.quickDev"></el-switch>
          </el-form-item>
          <el-form-item label="城市区域" label-width="80px">
            <el-select v-model="settings.cityCode" placeholder="请选择城市" filterable>
              <el-option v-for="item in cityList" :label="item.city" :value="item.cityCode" :key="item.cityCode"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancelSetting">取 消</el-button>
        <el-button type="primary" @click="handleSaveSetting">保 存</el-button>
      </div>
    </el-dialog>
    <drawer :editing="editing" @submitEdit="handleSubmitEditCard"/>
  </div>
</template>

<script>
import TdtMap from '@/components/TdtMap';
import VueGridLayout from 'vue-grid-layout'
const GridLayout = VueGridLayout.GridLayout;
import RichEditor from "@/components/RichEditor";
import Card from "@/components/Card";
import Drawer from "@/components/Drawer";
import WeatherCardForm from "@/components/WeatherCardForm";
import DatetimeCardForm from "@/components/DatetimeCardForm";
import TextCardForm from "@/components/TextCardForm";
import ScrollCardForm from "@/components/ScrollCardForm";
import RadarCardForm from "@/components/RadarCardForm";
import PieCardForm from "@/components/PieCardForm";
import LineCardForm from "@/components/LineCardForm";
import BarCardForm from "@/components/BarCardForm";
import CircleBarCardForm from "@/components/CircleBarCardForm";
import ProgressCardForm from "@/components/ProgressCardForm";
import GaugeCardForm from "@/components/GaugeCardForm";
import ButtonCardForm from "@/components/ButtonCardForm";
import ListCardForm from "@/components/ListCardForm";
import GlobalCardForm from "@/components/GlobalCardForm";
import {updateAllCards, savePage, deletePage, searchCard} from "@/api/card";
import {getRemoteProjectAttributes} from "@/api/remote";
import html2canvas from'html2canvas'
import {uploadFile} from "@/api/card";
const cityList = require('../../../public/json/cityList.json')
export default {
  name: "edit",
  components: {
    TdtMap,
    RichEditor,
    TextCardForm,
    DatetimeCardForm,
    GridLayout,
    Card,
    Drawer,
    GlobalCardForm,
    WeatherCardForm,
    ScrollCardForm,
    RadarCardForm,
    PieCardForm,
    LineCardForm,
    BarCardForm,
    CircleBarCardForm,
    ProgressCardForm,
    GaugeCardForm,
    ButtonCardForm,
    ListCardForm
  },
  data () {
    return {
      gridX: 1920 / 5,
      gridY: 1080 / 5,
      loading: true,
      layout: [],
      cityList: cityList,
      // 预定义颜色
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
      // 卡片类型选择列表
      editing: null,
      // 选择组件对话框
      select: false,
      title: '',
      // 页面设置对话框
      settings: {
        show: false,
        background: '',
        imageUrl: '',
        backgroundType: ''
      },
      // 卡片标签搜索
      cardTagSearch: '',
      // 搜索后的卡片列表
      searchedCardList: [],
      searchingFlag: false,
      // 添加标签
      cardTag: {
        add: -1,
        name: ''
      },
      // 可选的卡片类型
      cardTypes: [
        {
          label: '文本',
          value: 'text'
        },
        {
          label: '日期时间',
          value: 'datetime'
        },
        {
          label: '天气',
          value: 'weather'
        },
        {
          label: '按钮',
          value: 'button'
        },
        {
          label: '滚动列表',
          value: 'scroll'
        },
        {
          label: '下拉列表',
          value: 'list'
        },
        {
          label: '进度条',
          value: 'progress'
        },
        {
          label: '仪表盘',
          value: 'gauge'
        },
        {
          label: '雷达图',
          value: 'radar'
        },
        {
          label: '饼图',
          value: 'pie'
        },
        {
          label: '折线图',
          value: 'line'
        },
        {
          label: '条形图',
          value: 'bar'
        },
        {
          label: '圆环条形图',
          value: 'circle-bar'
        },
        // {
        //   label: '静态条形/折线图',
        //   value: 'bar/line'
        // },
        // {
        //   label: '静态饼图',
        //   value: 'pie-static'
        // },
        // {
        //   label: '自定义静态图表（根据代码生成）',
        //   value: 'chart'
        // }
      ],
      // 新建卡片对话框显示
      dialogVisible: false,
      // 新建卡片表单
      card: {},
      // 校验规则
      cardRules: {
        type1: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择卡片类型', trigger: 'change' }
        ],
        dataType: [
          { required: true, message: '请选择数据类型', trigger: 'change' }
        ],
        contentType: [
          { required: true, message: '请选择动态数据类型', trigger: 'change' }
        ],
        width: [
          { required: true, message: '请输入卡片宽度', trigger: 'blur' }
        ],
        height: [
          { required: true, message: '请输入卡片高度', trigger: 'blur' }
        ],
        seriesName: [
          { required: true, message: '请输入系列名', trigger: 'blur' }
        ],
        dataName: [
          { required: true, message: '请输入数据名', trigger: 'blur' }
        ],
        // 数据值
        dataValue: [
          { required: true, message: '请输入数据值', trigger: 'blur' },
          {
            validator: function (rule, value, callback) {
              if (typeof value !== 'number') {
                callback(new Error('数据值必须为数字'));
              } else {
                callback();
              }
            }
          }
        ]
      },
      // 当前正在编辑标题的卡片
      titleEditing: undefined,
      // 当前正在编辑内容的卡片
      optionsEditing: undefined,
      // 卡片网格的高度
      gridHeight: 0,
      // 卡片池初始数量
      cardPoolLimit: 10,
      // 已选择的企业属性列表
      selectedAttributes: []
    }
  },
  computed: {
    projectId () {
      return this.$route.params.projectId;
    },
    pageId () {
      return this.$route.params.pageId;
    },
    cardList () {
      if (this.cardTagSearch) return this.searchedCardList;
      return this.$store.state.cards;
      // return []
    },
    oldPage () {
      return this.$store.getters.getPage(this.pageId);
    },
    fullScreen () {
      return this.$store.state.fullscreenFlag;
    },
    baseURL () {
      return process.env.VUE_APP_API_BASE_URL;
    },
    imgBaseURL () {
      return process.env.VUE_APP_IMG_BASE_URL
    },
    cardPool () {
      return this.cardList.slice(0, this.cardPoolLimit);
    },
    readOnly () {
      return this.$store.state.readOnly;
    },
    isIndex () {
      return this.oldPage ? !!this.oldPage.isIndex : false;
    },
    showMap () {
      return this.settings.backgroundType === 'map' && !(this.settings.quickDev && process.env.VUE_APP_LIMIT === 'false');
    },
    pageList () {
      return this.$store.getters.getProject(this.projectId).pageList;
    },
    parkId () {
      return this.$route.query.parkId;
    }
  },
  watch: {
    projectId: {
      handler: function () {
        // 获取该项目企业属性列表
        getRemoteProjectAttributes(this.projectId).then(res => {
          this.selectedAttributes = res.rows
        })
      },
      immediate: true
    },
    pageId: {
      handler: function () {
        this.getPage();
      },
      immediate: true
    },
    oldPage: function () {
      if (this.loading) {
        this.getPage();
      }
    },
    cardList: function () {
      if (this.loading) {
        this.getPage();
      }
    },
    parkId: {
      handler: function () {
        if (this.settings.mapTo && this.parkId) this.$router.push(`${this.settings.mapTo}?parkId=${this.parkId}`);
      }
    }
  },
  methods: {
    /**
     * 初始化表单
     */
    initForm () {
      this.card = {
        w: 100,
        h: 50,
        type: 'text',
        dataType: '',
        title: '',
        options: '',
        style: { total: { border: '' }, title: {}, content: {}, showTitle: true },
        tag: ['文本']
      }
    },
    /**
     * 打开新增卡片面板
     */
    handleCreateCard () {
      this.initForm()
      this.dialogVisible = true
    },
    /**
     * 关闭新增卡片面板
     */
    handleCloseDialog(done) {
      done();
    },
    /**
     * 卡片类型改变事件
     * @param type 新类型: string
     */
    handleCardTypeChange (type) {
      const typeOpt = this.cardTypes.find(item => item.value === type)
      if (typeOpt) this.card.tag = [typeOpt.label]
      switch (type) {
        case 'bar/line':
          this.card.options = {
            color: [],
            grid: {
              top: 20,
              bottom: 20,
              left: 25,
              right: 20
            },
            legend: {
              show: true,
              textStyle: {}
            },
            tooltip: {
              show: true
            },
            xAxis: {
              type: 'category',
              data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              name: '上周数据',
              type: 'bar',
              label: {
                show: true
              },
              data: [820, 932, 901, 934, 1290, 1330, 1320]
            }]
          };
          break;
        case 'pie-static':
          this.card.options = {
            color: [],
            grid: {
              top: 20,
              bottom: 20,
              left: 25,
              right: 20
            },
            legend: {
              show: true,
              textStyle: {}
            },
            tooltip: {
              show: true
            },
            series: [
              {
                name: '访问来源',
                type: 'pie',
                radiusValue: [0, 50],
                radius: [0, '50%'],
                label: {
                  show: true
                },
                labelLine: {
                  show: true
                },
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
          this.card.options = '';
      }
    },
    /**
     * 系列图表类型改变事件
     * @param sIndex 被改变的系列索引: number
     */
    handleChartTypeChange (sIndex) {
      const type = this.card.options.series[sIndex].type;
      const oldName = this.card.options.series[sIndex].name;
      const oldData = this.card.options.series[sIndex].data;
      this.card.options.series.splice(sIndex, 1, {
        name: oldName,
        data: oldData,
        type: type,
        label: {
          show: false
        }
      })
    },
    /**
     * 添加系列
     */
    handleAddSeries () {
      switch (this.card.type) {
        case 'bar/line':
          this.card.options.series.push({
            name: '',
            type: 'bar',
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            label: {
              show: false
            },
          })
          break;
        case 'pie-static':
          this.card.options.series.push({
            name: '',
            type: 'pie',
            radiusValue: [0, 50],
            radius: [0, '50%'],
            label: {
              show: true
            },
            labelLine: {
              show: true
            },
            data: [
              {value: 1048, name: '搜索引擎'},
              {value: 735, name: '直接访问'},
              {value: 580, name: '邮件营销'},
              {value: 484, name: '联盟广告'},
              {value: 300, name: '视频广告'}
            ]
          })
          break;
      }
    },
    /**
     * 添加数据
     * @param arr 要添加数据的数组
     */
    handleAddData (arr) {
      const type = this.card.type
      switch (type) {
        case 'bar/line':
          this.card.options.xAxis.data.push('');
          this.card.options.series.forEach(item => {
            item.data.push('')
          })
          break;
        case 'pie-static': {
          arr.push({
            name: '',
            value: ''
          })
        }
      }
    },
    /**
     * 删除数据
     * @param arr 要删除数据的数组
     * @param index 要删除的数据项索引
     */
    handleDeleteData (arr, index) {
      const type = this.card.type;
      switch (type) {
        case 'bar/line':
          this.card.options.xAxis.data.splice(index, 1);
          this.card.options.series.forEach(item => {
            item.data.splice(index, 1);
          });
          break
        case 'pie-static':
          arr.splice(index, 1)
      }
    },
    /**
     * 获取本页面信息
     * 有可能页面数据没加载好，也有可能卡片数据没加载好
     */
    getPage () {
      const page = this.oldPage;
      if (page === undefined) return;
      this.title = page.title;
      this.settings = page.background ? { show: this.settings.show, ...JSON.parse(page.background) } : { show: this.settings.show };
      this.$store.commit('map/SET_CITY_CODE', this.settings.cityCode);
      try {
        this.layout = this.$store.getters.mergeLayout(page.layout);
        if (page.layout.length && !this.layout.length) return;
        this.loading = false;
      } catch (e) {
        this.layout = [];
        this.$message.error(e);
      }
    },
    /**
     * 提交新增卡片
     * 新增卡片组件
     */
    handleSubmitCreateCard () {
      // eslint-disable-next-line no-unreachable
      this.$refs.createCard.validate((valid) => {
        if (valid) {
          // 代码生成的, 转为object
          if (this.card.type === 'chart') {
            try {
              let option = null;
              eval('option = ' +  this.card.options);
              // 添加必要的参数
              option.grid = option.grid || {};
              option.color = option.color || [];
              option.tooltip = option.tooltip || {};
              option.legend = option.legend || {};
              option.legend.textStyle = option.legend.textStyle || {};
              this.card.options = option;
            } catch (e) {
              this.$message.error(e);
              return;
            }
          }
          // 新增卡片
          // 获取卡片宽高
          const w = this.card.w || Math.floor(Math.random() * 3) + 2
          const h = this.card.h || Math.floor(Math.random() * 2) + 2

          //获取插入位置
          const position = { x: (this.gridX - w) / 2, y: (this.gridY - h) / 2};

          // 补全参数
          this.card.title = this.card.title || '未命名卡片'
          const card = {
            ...this.card,
            x: position.x,
            y: position.y,
            w: w,
            h: h,
          }
          // 新增组件
          this.$store.dispatch('createCard', card)
              .then(card => {
                this.layout.push(card)
              })
          this.dialogVisible = false
        } else {
          return false;
        }
      });
    },
    /**
     * 开始修改卡片
     * @param params 卡片参数
     */
    handleEditCard (params) {
      this.editing = params
    },
    /**
     * 确定修改卡片
     * @param params 修改后卡片参数
     */
    handleSubmitEditCard (params) {
      this.editing = null;
      if (!params) return
      const index = this.layout.findIndex(item => item.i === params.i);
      this.layout.splice(index, 1, params)
    },
    /**
     * 删除卡片
     */
    handleDeleteCard (i) {
      const index = this.layout.findIndex(item => item.i === i);
      this.layout.splice(index, 1);
    },
    /**
     * 截图上传
     */
    shotScreen() {
      return new Promise(resolve => {
        setTimeout(() => {
        // 第一个参数是需要生成截图的元素,第二个是自己需要配置的参数,宽高等
        const grid = this.$refs.grid.$el;
        html2canvas(grid, {
          ignoreElements: (elem) => {
            return elem.classList.contains('vue-resizable-handle') || elem.classList.contains('card-controls')
          },
          onclone: function (dom, grid) {
            const videoList = grid.querySelectorAll('video')
            videoList.forEach(video => {
              const parent = video.parentElement;
              const width = video.clientWidth;
              const height = video.clientHeight;
              parent.removeChild(video);

              const div = document.createElement('div');
              div.innerHTML = `<div style="position: absolute;width: 40px;height: 40px;top: 0; bottom: 0;left: 0;right: 0;margin: auto; color: #fff;border-radius: 50%;border: 2px solid;">
                    <div style="border: 10px solid transparent;border-left-color: #fff;width: 0;height: 0;position: absolute;left: 16px;top: 10px"></div>
                </div>`;
              div.style.position = 'relative';
              div.style.background = '#000';
              div.style.width = width + 'px';
              div.style.height = height + 'px';
              parent.appendChild(div)
            })
          },
          backgroundColor: null,
          useCORS: true, // 如果截图的内容里有图片,可能会有跨域的情况,加上这个参数,解决文件跨域问题
          logging: false
        }).then(canvas => {
          let url = canvas.toDataURL("image/png")

          // 网上找的base64转File对象
          var arr = url.split(','),
              mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]),
              n = bstr.length,
              u8arr = new Uint8Array(n);
          while(n--){
            u8arr[n] = bstr.charCodeAt(n);
          }
          const imgFile = new File([u8arr], 'screenShot_' + this.pageId + '.png', {type:mime})
          const formData = new FormData();
          formData.set('files', imgFile);
          // 把生成的base64位图片上传到服务器,生成在线图片地址
          uploadFile(formData).then(res => {
            // return savePage({ id: this.pageId, image: this.imgBaseURL + res.url })
            resolve(res)
          })
        })
      })
      }, 800);
    },
    /**
     * 保存整个页面
     */
    handleSavePage () {
      // 全局遮罩
      const loading = this.$loading({
        lock: true,
        text: '保存上传中...',
        spinner: 'el-icon-loading',
        // background: 'rgba(0, 0, 0, 0.7)'
      });
      // 保存页面布局
      const layout = JSON.stringify(this.layout.map(item => {
        return {
          i: item.i,
          x: item.x,
          y: item.y
        }
      }));
      this.shotScreen().then(res => {
        // 保存组件修改 和 页面布局
        return Promise.all([updateAllCards(this.layout.map(item => {
          return {
            id: item.i,
            width: item.w,
            length: item.h,
            type: item.type,
            title: item.title,
            style: JSON.stringify(item.style),
            options: JSON.stringify(item.options),
            tag: item.tag.join(','),
            link: item.link,
            dataType: item.dataType,
            difId: item.difId,
            readonly: item.difId ? 'w' : 'r',
            param: item.param
          }
        })), savePage({
          id: this.pageId,
          title: this.title,
          pageText: layout,
          image: this.imgBaseURL + res.url
        })])
      }).then(() => {
        this.$message.success('保存成功');
        this.$store.dispatch('updateProjects');
        this.$store.dispatch('updateCards');
      }).catch(() => {
        this.$message.error('保存出错');
      }).finally(() => {
        loading.close();
      })
    },
    handleRefreshComponent (id) {
      this.$refs['card-' + id][0].updateChart(true)
    },
    /**
     * 引用卡片组件
     */
    handleRefererComponent (card) {
      const isUsed = this.layout.findIndex(item => item.i === card.i);
      if (isUsed !== -1) {
        this.$message('同一页面不可引用两个相同组件，若确实要用，请使用【复制】');
        return;
      }
      const position = this.getInsertPosition(card.w, card.h);
      this.layout.push({
        ...card,
        i: card.i,
        x: position.x,
        y: position.y
      });
      this.$message.success('引用成功')
    },
    /**
     * 复制卡片组件
     */
    handleCopyComponent (card) {
      this.$store.dispatch('createCard', card).then(card => {
        const position = this.getInsertPosition(card.w, card.h);
        this.layout.push({ ...card, ...position})
      })
    },
    /**
     * 删除卡片组件
     */
    handleDeleteComponent (id) {
      this.$confirm('此操作将解除所有页面对该组件的引用, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteCard', id);
        // 更新搜索项
        if (this.cardTagSearch) {
          this.handleCardTagSearch();
        }
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      });
    },
    /**
     * 取消设置
     */
    handleCancelSetting () {
      const oldPage = this.$store.getters.getPage(this.pageId);
      this.settings = { ...JSON.parse(oldPage.background), show: false };
      this.title = oldPage.title;
    },
    /**
     * 保存设置
     */
    handleSaveSetting () {
      const settings = { ...this.settings }
      delete settings.show;
      savePage({
        id: this.pageId,
        title: this.title,
        background: JSON.stringify(settings)
      }).then(d => {
        this.$message.success(d.msg);
        // 更新页面
        this.$store.dispatch('updateProjects');
      }).catch(() => {
        this.$message.error('保存失败!');
      })
      this.settings.show = false;
    },
    /**
     * 删除页面
     */
    handleDeletePage () {
      this.$confirm('此操作将删除该页面所有数据, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePage(this.pageId).then(d => {
          this.$message.success(d.msg);
          return this.$store.dispatch('updateProjects').then(() => {
            this.$router.push('/' + this.$route.params.projectId)
          });
        })
      }).catch(() => {});
    },
    /**
     * 获取当前布局可插入的位置
     * @param w 卡片宽度
     * @param h 卡片高度
     */
    // eslint-disable-next-line no-unused-vars
    getInsertPosition (w, h) {
      // // 获取矩阵高
      // if (this.layout.length) {
      //   h += Math.max(...this.layout.map(item => {
      //     return item.y + item.h
      //   }))
      // }
      //
      // // 初始化已用空间矩阵
      // const space = new Array(12 * h).fill(0)
      // // 获取已用空间
      // this.layout.forEach(item => {
      //   for (let i = 0; i < item.w; i++) {
      //     for (let j = 0; j < item.h; j++) {
      //       space[(item.x + i) + (item.y + j) * 12] = 1
      //     }
      //   }
      // })
      // // 获取最低可用位置
      // let x = -1
      // let y = -1
      // for (let index = 0; index < space.length; index++) {
      //   if (space[index]) continue
      //   // 先假设可以用
      //   y = Math.floor(index / 12)
      //   x = index % 12
      //   // 验证是否可以用
      //   for (let i = 0; i < w; i++) {
      //     if (x === -1 && y === -1) break
      //     for (let j = 0; j < h; j++) {
      //       if (x === -1 && y === -1) break
      //       // 不能用
      //       if (space[x + i + (y + j) * 12] === 1 || x + i >= 12) {
      //         x = y = -1
      //       }
      //     }
      //   }
      //   if (x > -1 && y >-1) break
      // }
      // return { x, y }
      return { x: this.gridX / 2 - 30, y: this.gridY / 2 };
    },
    /**
     * 根据标签搜索卡片组件
     */
    handleCardTagSearch () {
      if (!this.cardTagSearch) return;
      this.searchingFlag = true;
      const formatedSearch = this.cardTagSearch.replaceAll(/(\s+)|(，+)/g, ',');
      searchCard ({tags: formatedSearch, pid: this.projectId }).then (d => {
        this.searchedCardList = d.data.map(item => {
          let options = '';
          try {
            options = JSON.parse(item.options);
          } catch (e) {
            options = item.options;
          }
          this.cardPoolLimit = 10;
          return {
            ...item,
            i: parseInt(item.id),
            w: parseInt(item.width),
            h: parseInt(item.length),
            x: item.x,
            y: item.y,
            title: item.title || '',
            options: options,
            type: item.type,
            style: JSON.parse(item.style) || { total: {}, title: {}, content: {} },
            tag: item.tag ? item.tag.split(',') : [],
            dataType: item.dataType,
            link: item.link,
            param: item.param
          }
        });
      }).finally(() => {
        this.searchingFlag = false;
      })
    },
    /**
     * 准备添加卡片标签
     * @param item
     */
    addCardTag (item) {
      this.cardTag.add = item.i;
      this.$nextTick(() => {
        this.$refs['saveTagInput' + item.i][0].focus();
      });
    },
    /**
     * 提交添加卡片标签
     * @param item
     */
    submitAddCardTag (item) {
      let inputValue = this.cardTag.name;
      if (inputValue) {
        item.tag.push(inputValue);
      }
      this.cardTag.add = -1;
      this.cardTag.name = '';
    },
    /**
     * 移除卡片标签
     * @param item
     * @param tag
     */
    removeCardTag (item, tag) {
      item.tag.splice(item.tag.indexOf(tag), 1);
    },
    /**
     * 上传成功后
     */
    // eslint-disable-next-line no-unused-vars
    handleAvatarSuccess(res, file) {
      this.settings.background = `0 0 / 100% 100% no-repeat url(${this.imgBaseURL}${ res.url.split("/").map(item => encodeURIComponent(item)).join('/') })`;
      this.settings.imageUrl = `${this.imgBaseURL}${ res.url.split("/").map(item => encodeURIComponent(item)).join('/') }`;
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
    // 更新网格容器高度
    computeGridHeight () {
      this.gridHeight = this.$refs.grid.$el.clientHeight
    },
    // 加载卡片池
    loadCardPool () {
      if (this.cardPoolLimit >= this.cardList.length) return;
      this.cardPoolLimit += 5
    },
    // 设为首页
    handleSetHome () {
      this.oldPage.isIndex = 1;
      savePage({
        id: this.pageId,
        projectId: this.projectId,
        isIndex: 1
      }).then(res => {
        this.$message.success(res.msg);
        setTimeout(() => {
          location.reload()
        }, 1000);
      })
    },
    // 切换为天地图背景时清空原背景
    handleChangeBackgroundType (type) {
      if (type === 'map') this.settings.background = '#ccc';
    },
    // 清除出界的卡片
    handleOutRange () {
      this.layout = this.layout.filter(item => {
        return item.x <= 384 && item.y <= 216
      })
    }
  },
  created () {
    if (this.$route.query.mode ==='fullscreen') {
      this.$store.commit('changeFullscreenFlag', true);
      this.$store.commit('changeReadOnlyFlag', true);
    }
  },
  mounted () {
    // 动态变化的卡片容器高度
    this.computeGridHeight();
    window.onresize = () => {
      this.computeGridHeight();
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.$store.commit('changeFullscreenFlag', false);
    })
  }
}
</script>

<style lang="less" scoped>
.pre-view {
  margin-bottom: 20px;
}
.page {
  padding: 5px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .grid-layout {
    position: relative;
    height: 100%;
    margin-top: 10px;
    flex: 1;
    overflow: hidden;
    &.full-screen {
      margin: 0;
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      // 作为遮罩底图
      &:before {
        content: '';
        position: absolute;
        z-index: -2;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: #fff;
      }
      // 作为上层背景
      &:after {
        content: '';
        position: absolute;
        z-index: -1;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: inherit;
      }
    }
  }
  .card-component {
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    margin-top: 10px;
    .tags {
      text-align: left;
      .el-tag + .el-tag {
        margin-left: 10px;
      }
    }
  }
}
.el-select {
  width: 100%;
}
.invalid-message {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 43%;
}
</style>
