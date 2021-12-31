<template>
  <el-dialog
      title="新增卡片"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :before-close="handleCloseDialog"
  >
    <!--预览-->
    <!--      <el-row class="pre-view">-->
    <!--        <card :params="currentForm" :grid="false"></card>-->
    <!--      </el-row>-->
    <el-form label-width="80px" :model="currentForm" :rules="formRules" ref="createCard">
      <el-row>
        <el-col :span="12">
          <el-form-item label="卡片宽度" prop="w">
            <el-input-number v-model="currentForm.w" :min="1"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="卡片高度" prop="h">
            <el-input-number v-model="currentForm.h" :min="1"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="卡片类型" prop="type">
        <el-select v-model="currentForm.type" placeholder="请选择" @change="handleCardTypeChange">
          <el-option
              v-for="item in cardTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="currentForm.title"></el-input>
      </el-form-item>
      <!--文本标签卡片专属内容-->
      <template v-if="['text', 'datetime'].indexOf(currentForm.type) !== -1">
<!--        <el-form-item label="数据类型" prop="dataType">-->
<!--          <el-select v-model="currentForm.dataType" placeholder="请选择" @change="handledataTypeChange">-->
<!--            <el-option label="静态数据" value="static"/>-->
<!--            <el-option label="日期时间" value="datetime"/>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="内容">
          <!--            <el-input v-model="currentForm.options" type="textarea"></el-input>-->
          <div id="richEditor" ref="richEditor"></div>
        </el-form-item>
      </template>
      <!--图表配置项-->
      <template v-if="currentForm.type !== 'text' && typeof currentForm.options === 'object'">
        <!--          <el-form-item label="显示图例">-->
        <!--            <el-col :span="3">-->
        <!--              <el-switch v-model="currentForm.options.legend.show"></el-switch>-->
        <!--            </el-col>-->
        <!--          </el-form-item>-->
        <!--折线图卡片专属表单-->
        <div v-if="currentForm.type === 'bar/line'">
          <el-form-item label="数据">
            <el-col :span="4">
              <el-link icon="el-icon-plus" type="primary" :underline="false" @click="handleAddData">添加数据</el-link>
            </el-col>
          </el-form-item>
          <el-form-item label="x轴">
            <el-col :span="12" v-for="i in currentForm.options.xAxis.data.length" :key="i" style="margin-bottom: 18px;">
              <el-col :span="16">
                <el-form-item :prop="`options.xAxis.data.${i - 1}`" :rules="currentFormRules.dataName">
                  <el-input v-model="currentForm.options.xAxis.data[i - 1]" placeholder="请输入数据名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-button v-show="currentForm.options.xAxis.data.length > 1" @click.prevent="handleDeleteData(currentForm.options.xAxis.data, i - 1)">删除</el-button>
              </el-col>
            </el-col>
          </el-form-item>
          <el-form-item label="系列">
            <el-col :span="4">
              <el-link icon="el-icon-plus" :underline="false" @click="handleAddSeries">添加系列</el-link>
            </el-col>
          </el-form-item>
          <div v-for="(series, si) in currentForm.options.series" :key="si">
            <!--条形图、折线图可以混合-->
            <el-form-item :label="'系列' + (si + 1)" prop="type">
              <el-select v-model="series.type" placeholder="请选择" @change="handleChartTypeChange(si)">
                <el-option label="条形图" value="bar"></el-option>
                <el-option label="折线图" value="line"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="系列名" :prop="`options.series.${si}.name`" :rules="formRules.seriesName">
              <el-input v-model="series.name" placeholder="请输入系列名"></el-input>
            </el-form-item>
            <el-form-item label="数据">
              <el-col :span="12" v-for="di in currentForm.options.xAxis.data.length" :key="`${si}-${di - 1}`" style="margin-bottom: 18px;">
                <el-form-item :prop="`options.series.${si}.data.${di - 1}`" :rules="formRules.dataValue">
                  <el-input v-model.number="currentForm.options.series[si].data[di - 1]" placeholder="请输入数据值"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </div>
        </div>
        <!--饼图卡片专属表单-->
        <div v-else-if="currentForm.type === 'pie'">
          <el-form-item label="系列">
            <el-row>
              <el-col :span="4">
                <el-link icon="el-icon-plus" :underline="false" @click="handleAddSeries">添加系列</el-link>
              </el-col>
            </el-row>
          </el-form-item>
          <div v-for="(series, si) in currentForm.options.series" :key="si">
            <el-form-item :label="'系列' + (si + 1)" :prop="`options.series.${si}.name`" :rules="formRules.seriesName">
              <el-input v-model="series.name" placeholder="请输入系列名"></el-input>
            </el-form-item>
            <el-form-item label="数据">
              <el-row>
                <el-col :span="4">
                  <el-link icon="el-icon-plus" :underline="false" @click="handleAddData(series.data)">添加数据</el-link>
                </el-col>
              </el-row>
              <el-row v-for="(item, di) in series.data" :key="`${si},${di}`" style="margin-bottom: 18px;">
                <el-col :span="10">
                  <el-form-item :prop="`options.series.0.data.${di}.name`" :rules="formRules.dataName">
                    <el-input v-model="currentForm.options.series[0].data[di].name" placeholder="请输入数据名"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item :prop="`options.series.${si}.data.${di}.value`" :rules="formRules.dataValue">
                    <el-input v-model.number="item.value" placeholder="请输入数据值"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-button @click.prevent="handleDeleteData(series.data, di)">删除</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
        </div>
      </template>
      <!--代码生成图表-->
      <el-form-item v-if="currentForm.type === 'chart'" label="图表参数">
        <el-input
            type="textarea"
            :autosize="{ minRows: 4 }"
            placeholder="请输入内容"
            v-model="currentForm.options">
        </el-input>
      </el-form-item>
      <!--        &lt;!&ndash;图表标签&ndash;&gt;-->
      <!--        <el-form-item label="标签">-->
      <!--          <el-tag-->
      <!--              :key="tag"-->
      <!--              v-for="tag in item.tag"-->
      <!--              closable-->
      <!--              :disable-transitions="false"-->
      <!--              @close="removeCardTag(item, tag)">-->
      <!--            {{ tag }}-->
      <!--          </el-tag>-->
      <!--          <el-input-->
      <!--              class="input-new-tag"-->
      <!--              v-if="cardTag.add === item.i"-->
      <!--              v-model="cardTag.name"-->
      <!--              :ref="'saveTagInput' + item.i"-->
      <!--              size="small"-->
      <!--              @keyup.enter.native="submitAddCardTag(item)"-->
      <!--              @blur="submitAddCardTag(item)"-->
      <!--          >-->
      <!--          </el-input>-->
      <!--          <el-button v-else class="button-new-tag" size="small" @click="addCardTag(item)">+ 添加标签</el-button>-->
      <!--        </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCreateCard">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
import WangEditor from 'wangeditor'
export default {
  name: "Form",
  props: {
    form: {
      type: Object,
      require: true
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 表单
      currentForm: {},
      // 校验规则
      formRules: {
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
          label: '条形/折线图',
          value: 'bar/line'
        },
        {
          label: '饼图',
          value: 'pie'
        },
        {
          label: '自定义图表（根据代码生成）',
          value: 'chart'
        }
        // {
        //   label: '雷达图',
        //   value: 'radar'
        // }
      ],
      richEditor: null
    }
  },
  methods: {
    initForm () {
      this.currentForm = {
        w: 100,
        h: 50,
        type: 'text',
        title: '',
        options: '',
        style: { total: { border: '' }, title: {}, content: {}, showTitle: true },
        tag: []
      }
    },
    handleCloseDialog () {
      this.$emit('close');
    },
    handleCardTypeChange (type) {
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
        case 'pie':
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
    handleSubmitCreateCard () {
      this.$emit('submit', this.currentForm)
    },
    createRichEditor () {
      if (this.richEditor) return;
      try {
        const editor = this.richEditor = new WangEditor('#createEditor')
        editor.config.height = 100
        editor.create()
      } catch (e) {
        setTimeout(() => {
          this.createRichEditor();
        }, 500);
      }
    }
  },
  watch: {
    form: {
      handler: function () {
        this.currentForm = this.form
      },
      immediate: true
    },
    currentForm: function () {
      this.$emit('change', this.currentForm);
    }
  },
  created () {
    this.initForm();
  },
  mounted() {
    this.createRichEditor();
  }
}
</script>

<style scoped>

</style>
