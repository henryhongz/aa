<template>
  <div class="text-auto-scroll" :style="{ height: maxLine * itemLine * lineHeight + 'em', fontSize: baseFontSize }">
    <ul class="text-auto-scroll-list" :ref="'ul' + _uid" @transitionend="handleTransitionEnd" :style="`transition: all ${duringTime}s`" v-show="lines.length > 0">
      <li class="text-auto-scroll-item" v-for="item in lines" :key="item.id" :style="{ 'line-height': lineHeight + 'em', height: lineHeight * itemLine + 'em', borderBottom: splitLine, padding: liPadding }">
        <slot :item="item">
          <span>{{ item }}</span>
        </slot>
      </li>
    </ul>
    <div class="no-data" v-show="lines.length === 0">
      暂无数据
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    },
    timeout: {
      type: Number,
      default: 3000,
      validator: function (val) {
        return val > 1000
      }
    },
    maxLine: {
      type: Number,
      default: 5
    },
    itemLine: {
      type: Number,
      default: 1
    },
    lineHeight: {
        type: Number,
        default: 2.2
    },
    splitLine: {
        type: String,
        default: 'none'
    },
    duringTime: {
        type: Number,
        default: 1
    },
    liPadding: {
        type: String,
        default: '0'
    },
    baseFontSize: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      timer: null,
      index: 0,
      lines: [],
      render: false
    }
  },
  methods: {
    scroll: function () {
      const $ul = this.$refs['ul' + this._uid]
      if ($ul) {
        $ul.style.transition = `all ${this.duringTime}s`
        $ul.style.transform = 'translateY(-' + (1 / this.data.length) * 100 + '%)'
      }
    },
    handleTransitionEnd: function (e) {
        const $ul = e.target
        $ul.style.transition = 'none'
        $ul.style.transform = ''
        this.lines.push(this.lines.shift())
    },
    updateLines: function () {
        this.lines = this.data.slice()
        if (!this.timer && this.lines.length > this.maxLine) {
            this.timer = setInterval(() => {
                this.scroll()
            }, this.timeout)
        }
    }
  },
  watch: {
    data: function (val) {
        if (!this.render && val.length > 0) {
            // 重置
            if (this.timer) clearInterval(this.timer)
            this.timer = null
            this.index = 0
            const $ul = this.$refs['ul' + this._uid]
            // 滚动到一半时的切换
            $ul.style.transition = 'none'
            $ul.style.transform = ''
            setTimeout(() => {
                this.updateLines()
                $ul.style.transition = `all ${this.duringTime}s`
            }, 0)
        }
    }
  },
  mounted () {
      this.updateLines()
    //   this.$refs['ul' + this._uid].addEventListener('mouseenter', () => {
    //       if (this.timer) clearInterval(this.timer)
    //   })
    //   this.$refs['ul' + this._uid].addEventListener('mouseleave', () => {
    //       this.updateLines()
    //   })
  },
  beforeDestroy () {
    if (this.timer) clearInterval(this.timer)
  }
}
</script>

<style scoped>
.text-auto-scroll {
  box-sizing: border-box;
  color: #000;
  overflow: hidden;
}
.text-auto-scroll-list {
  margin: 0;
  padding: 0;
  list-style: none;
  /* transition: all 1s; */
}
.text-auto-scroll-item {
    line-height: 0;
  /*font-size: 0;*/
    box-sizing: border-box;
    white-space: nowrap;
}
.no-data {
    text-align: center;
    color: #ccc;
    margin-top: 2em;
}
</style>
