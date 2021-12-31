<template>
  <div :id="id"></div>
</template>

<script>
import WangEditor from "wangeditor";
import { uploadFile } from "@/api/card";
// 获取必要的变量，这些在下文中都会用到
// eslint-disable-next-line no-unused-vars
const { $, BtnMenu, DropListMenu, PanelMenu, DropList, Panel, Tooltip } = WangEditor

// 将图片设置成该区域背景
class ImgBackground extends BtnMenu {
  constructor(editor) {
    // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
    const $elem = WangEditor.$(
        `<div class="w-e-menu" data-title="将图片设置成该区域背景">
                <button>bg</button>
            </div>`
    )
    super($elem, editor)
  }
  // 菜单点击事件
  clickHandler(e) {
    // 防止它自己刷新
    e.preventDefault()
    // 网格元素
    let grid = this.editor.selection.getSelectionContainerElem().elems[0];
    let display = getComputedStyle(grid).display;
    while (display === 'inline') {
      grid = grid.parentElement;
      if (!grid) return;
      display = getComputedStyle(grid).display;
    }
    // 获取选取内第一张图片
    const img = grid.querySelector('img');
    if (!img) return;
    const url = img.src;
    // 将此图片设置成网格元素背景
    grid.style.background = `0 0 / 100% 100% url(${url})`;
    // 移除图片
    img.remove();
  }
  // 菜单是否被激活（如果不需要，这个函数可以空着）
  // 1. 激活是什么？光标放在一段加粗、下划线的文本时，菜单栏里的 B 和 U 被激活，如下图
  // 2. 什么时候执行这个函数？每次编辑器区域的选区变化（如鼠标操作、键盘操作等），都会触发各个菜单的 tryChangeActive 函数，重新计算菜单的激活状态
  tryChangeActive() {
    // 激活菜单
    // 1. 菜单 DOM 节点会增加一个 .w-e-active 的 css class
    // 2. this.this.isActive === true
    this.active()

    // // 取消激活菜单
    // // 1. 菜单 DOM 节点会删掉 .w-e-active
    // // 2. this.this.isActive === false
    // this.unActive()
  }
}

// 使超链接不打开新页面
class InnerLink extends BtnMenu {
  constructor(editor) {
    // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
    const $elem = WangEditor.$(
        `<div class="w-e-menu" data-title="使超链接不打开新页面">
                <button>inner</button>
            </div>`
    )
    super($elem, editor)
  }
  // 菜单点击事件
  clickHandler(e) {
    // 防止它自己刷新
    e.preventDefault()
    // 网格元素
    let link = this.editor.selection.getSelectionContainerElem().elems[0];
    let tagName = link.tagName.toUpperCase();
    while (tagName !== 'A') {
      link = link.parentElement;
      if (!link) return;
      tagName = link.tagName.toUpperCase();
    }
    link.target = '_self';
    console.log(link)
  }
  tryChangeActive() {
    this.active()
  }
}

// 使文本不换行并显示省略号
class OverflowNowrap extends BtnMenu {
  constructor(editor) {
    // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
    const $elem = WangEditor.$(
        `<div class="w-e-menu" data-title="使文本不换行">
                <button>t...</button>
            </div>`
    )
    super($elem, editor)
  }
  // 菜单点击事件
  clickHandler(e) {
    // 防止它自己刷新
    e.preventDefault()
    // 网格元素
    let text = this.editor.selection.getSelectionContainerElem().elems[0];
    text.style.overflow = 'hidden';
    text.style.textOverflow = 'ellipsis';
    text.style.whiteSpace = 'nowrap';
    console.log(text)
  }
  tryChangeActive() {
    this.active()
  }
}

// 块级元素设置
class BlockSettings extends PanelMenu {
  constructor(editor) {
    const $elem = $(
        `<div class="w-e-menu" data-title="块级设置">
                <button>block</button>
            </div>`
    )
    super($elem, editor)

    // // 绑定事件 tootip
    // bindEvent(editor)
  }

  /**
   * 菜单点击事件
   */
  clickHandler(e) {
    e.preventDefault();
    // 弹出 panel
    this.createPanel()
  }

  /**
   * 创建 panel
   */
  createPanel() {
    let grid = this.editor.selection.getSelectionContainerElem().elems[0];
    let display = getComputedStyle(grid).display;
    while (display === 'inline') {
      grid = grid.parentElement;
      if (!grid) return;
      display = getComputedStyle(grid).display;
    }
    const oldWidth = grid.style.width;
    const oldHeight = grid.style.height;
    const oldBackground = grid.style.background;
    const panel = new Panel(this, {
      width: 300,
      height: 0,

      tabs: [{
        title: '宽高',
        tpl: `<div>
                  <div>
                      宽度：<input type="text" id="gridWidth" value="${oldWidth}" placeholder="请输入宽度"></input>
                  </div>
                  <div>
                      高度：<input type="text" id="gridHeight" value="${oldHeight}" placeholder="请输入高度"></input>
                  </div>
                  <div class="w-e-button-container">
                      <button type="button" id="setShape" class="right">
                          确定
                      </button>
                  </div>
              </div>`,
        events: [
          {
            selector: '#setShape',
            type: 'click',
            fn: () => {
              const height = $('#gridHeight').elems[0].value
              const width = $('#gridWidth').elems[0].value
              grid.style.width = width;
              grid.style.height = height;
              return true;
            },
            bindEnter: true,
          }
        ]
      }, {
        // @todo 背景待完善整合
        title: '背景（未完成）',
        tpl: `<div>
                  <div>
                    背景：<input type="text" value="${oldBackground}" id="gridBackground" placeholder="请输入背景">
                  </div>
                  <div>
                    背景图片：<input type="file" id="gridBackgroundImage" placeholder="请选择背景图片" accept="image/*">
                  </div>
                  <div class="w-e-button-container">
                      <button type="button" id="setBackground" class="right">
                          确定
                      </button>
                  </div>
              </div>`,
        events: [
          // {
          //   selector: '#gridBackgroundImage',
          //   type: 'change',
          //   fn: (e) => {
          //     console.log(e.target.value)
          //   },
          //   bindEnter: true,
          // },
          {
            selector: '#setBackground',
            type: 'click',
            fn: () => {
              const background = $('#gridBackground').elems[0].value;
              grid.style.background = background;
              return true;
            },
            bindEnter: true,
          }
        ]
      }]
    })
    panel.create()
  }

  /**
   * 尝试修改菜单 active 状态
   */
  tryChangeActive() {}
}
export default {
  name: "RichEditor",
  props: {
    value: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 250
    }
  },
  data () {
    return {
      richEditor: null
    }
  },
  computed: {
    id () {
      return `richEditor-${this._uid}`
    },
    imgBaseURL () {
      return process.env.VUE_APP_IMG_BASE_URL
    },
  },
  methods: {
    init () {
      if (this.richEditor) return;

      // 菜单 key ，各个菜单不能重复
      // 注册菜单
      WangEditor.registerMenu('ImgBackgroundKey', ImgBackground)
      WangEditor.registerMenu('BlockSettingsKey', BlockSettings)
      WangEditor.registerMenu('InnerLinkKey', InnerLink)
      WangEditor.registerMenu('OverflowNowrapKey', OverflowNowrap)

      const editor = this.richEditor = new WangEditor('#' + this.id);
      editor.config.height = this.height;
      // 配置颜色
      editor.config.colors = [
        '#fff',
        '#ccc',
        '#000',
        '#c24f4a',
        '#f9963b',
        '#e7e065',
        '#28df89',
        '#8baa4a',
        '#1c487f',
        '#4d80bf',
        '#46acc8',
        '#5de9fe',
        '#7b5ba1',
      ]
      const _this = this;
      // 上传图片
      editor.config.customUploadImg = function (resultFiles, insertImgFn) {
        const formData = new FormData();
        formData.append('files', resultFiles[0])
        uploadFile(formData).then(res => {
          insertImgFn(`${_this.imgBaseURL}${res.url}`)
        })
      }
      // 上传视频
      editor.config.uploadVideoMaxSize = 80 * 1024 * 1024 // 限制视频大小80m
      editor.config.customUploadVideo = function (resultFiles, insertVideoFn) {
        const formData = new FormData();
        formData.append('files', resultFiles[0])
        uploadFile(formData).then(res => {
          insertVideoFn(`${_this.imgBaseURL}${res.url}`)
        })
      }

      editor.create();
      editor.txt.html(this.value)
      // 配置 onchange 回调函数
      editor.config.onchange = (newHtml) => {
        this.$emit('input', newHtml)
      };
      // 配置触发 onchange 的时间频率，默认为 200ms
      // editor.config.onchangeTimeout = 500; // 修改为 500ms
    }
  },
  mounted() {
    this.init();
  }
}
</script>

<style scoped>

</style>
