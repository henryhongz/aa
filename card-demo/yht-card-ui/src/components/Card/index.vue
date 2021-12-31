<template>
  <!--作为可拖动网格-->
  <grid-item
      class="grid-item"
      v-if="grid"
      :x="params.x"
      :y="params.y"
      :w="params.w"
      :h="params.h"
      :i="params.i"
      drag-allow-from=".vue-draggable-handle"
      drag-ignore-from=".no-drag"
      :is-resizable="!fullScreen"
      @move="handleGridMove"
      @moved="handleGridMoved"
      @resize="handleGridResize"
      @resized="handleGridResized"
  >
    <el-tooltip class="item" effect="dark" :content="`w:${params.w} h:${params.h} (${params.x},${params.y})`" placement="top-start" :manual="true" :value="moving">
      <el-card class="card" :style="totalStyle" :body-style="{ borderTop: params.style.splitLine, padding: params.style.content.padding }">
        <div slot="header" class="clearfix" v-if="params.style.showTitle">
          <div :class="{ 'vue-draggable-handle': !fullScreen }" v-html="params.title"></div>
        </div>
        <span class="card-controls" v-show="!fullScreen">
          <i title="移动" class="el-icon-rank vue-draggable-handle" v-if="!params.style.showTitle"></i>
          <i title="修改" @click="handleEditCard" class="el-icon-edit"></i>
          <i v-show="params.type !== 'text'" title="刷新" class="el-icon-refresh" @click="updateChart(true)"></i>
          <i title="删除" class="el-icon-delete" @click="handleRemoveCard"></i>
        </span>
        <!--文本卡片-->
        <div v-if="['text', 'datetime', 'weather', 'scroll', 'list', 'progress', 'radar', 'pie', 'line', 'bar', 'circle-bar','gauge', 'button'].indexOf(params.type) !== -1" class="card-content" :style="params.style.content">
          <component :is="params.type + '-card-content'" :params="params" :ref="id"></component>
        </div>
        <!--图表卡片-->
        <template v-else>
          <div class="chart card-content" :ref="`chart${params.i}`" style="width: 100%; height: 100%;"></div>
        </template>
      </el-card>
    </el-tooltip>
  </grid-item>
  <!--作为示例模板-->
  <el-row :style="`height: ${boxWidth / params.w * params.h}px;`" v-else>
    <el-card class="card no-grid"
             draggable="true"
             ref="dragBox"
             @drag.native="drag"
             @dragend.native="dragend"
            :style="{ ...params.style.total, height: params.h * 5 + 'px', width: params.w * 5 + 'px', transform: `scale(${boxWidth / params.w / 5},${boxWidth / params.w / 5})` }"
            :body-style="{ borderTop: params.style.splitLine }"
    >
      <div slot="header" class="clearfix" v-if="params.style.showTitle">
        <div v-html="params.title"></div>
      </div>
      <!-- 二代卡片 -->
      <div v-if="['text', 'datetime', 'weather', 'scroll', 'list', 'progress', 'radar', 'pie', 'line', 'bar', 'circle-bar', 'gauge', 'button'].indexOf(params.type) !== -1" class="card-content" :style="params.style.content">
        <component :is="params.type + '-card-content'" :params="params"></component>
      </div>
      <!-- 一代图表卡片 -->
      <template v-else>
        <div class="chart card-content" :ref="`chart${params.i}`" style="width: 100%; height: 100%;"></div>
      </template>
    </el-card>
  </el-row>
</template>

<script>
import * as echarts from "echarts";
import VueGridLayout from 'vue-grid-layout'
const GridItem = VueGridLayout.GridItem;
import WeatherCardContent from '@/components/WeatherCardContent';
import DatetimeCardContent from '@/components/DatetimeCardContent';
import TextCardContent from '@/components/TextCardContent';
import ScrollCardContent from '@/components/ScrollCardContent';
import ProgressCardContent from '@/components/ProgressCardContent';
import RadarCardContent from '@/components/RadarCardContent';
import PieCardContent from '@/components/PieCardContent';
import LineCardContent from '@/components/LineCardContent';
import BarCardContent from '@/components/BarCardContent';
import CircleBarCardContent from '@/components/CircleBarCardContent';
import GaugeCardContent from '@/components/GaugeCardContent';
import ButtonCardContent from '@/components/ButtonCardContent';
import ListCardContent from '@/components/ListCardContent';
export default {
  name: "Card",
  components: {
    GridItem,
    WeatherCardContent,
    DatetimeCardContent,
    TextCardContent,
    ScrollCardContent,
    ProgressCardContent,
    RadarCardContent,
    PieCardContent,
    LineCardContent,
    BarCardContent,
    CircleBarCardContent,
    GaugeCardContent,
    ButtonCardContent,
    ListCardContent
  },
  props: {
    params: {
      type: Object,
      default () {
        return {}
      }
    },
    grid: {
      type: Boolean,
      default: true
    },
    boxWidth: {
      type: Number,
      default: 450
    }
  },
  data () {
    return {
      chart: null,
      moving: false
    }
  },
  computed: {
    id () {
      return 'card_' + this._uid;
    },
    fullScreen () {
      return this.$store.state.fullscreenFlag;
    },
    linkActive () {
      return this.$route.path === this.params.link
    },
    totalStyle () {
      const activeStyle = this.params.style.linkActive
      const useStyle = JSON.parse(JSON.stringify(this.params.style.total))
      if (this.linkActive && activeStyle && activeStyle.background) {
        useStyle.background = activeStyle.background
      }
      return useStyle
    }
  },
  watch: {
    params: {
      handler: function () {
        this.updateChart(true)
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 更新加载卡片
     * @param redraw 是否重绘
     */
    updateChart (redraw) {
      const card = this.params
      // 文本卡片不用管它
      if (['text', 'datetime', 'weather', 'scroll', 'progress', 'button', 'list'].indexOf(card.type) !== -1) return
      else if (['radar', 'pie', 'line', 'bar', 'circle-bar', 'gauge'].indexOf(card.type) !== -1) {
        this.$refs[this.id] && this.$refs[this.id].update(redraw);
        return;
      }
      setTimeout(() => {
        // 初始化图表
        let chart = this.chart;
        if (!chart) {
          chart = this.chart = echarts.init(this.$refs[`chart${this.params.i}`]);
        }
        chart.resize()
        if (redraw) {
          // 重绘
          chart.clear()
          const option = card.options;
          chart.setOption(option);
        }
      })
    },
    // 网格移动过程中
    // eslint-disable-next-line no-unused-vars
    handleGridMove (i, newX, newY){
      this.moving = true
      // console.log("MOVE i=" + i + ", X=" + newX + ", Y=" + newY);
    },
    // 网格移动结束
    // eslint-disable-next-line no-unused-vars
    handleGridMoved (i, newX, newY){
      // console.log("MOVED i=" + i + ", X=" + newX + ", Y=" + newY);
      this.moving = false
    },
    // 网格尺寸拉伸过程中
    // eslint-disable-next-line no-unused-vars
    handleGridResize (i, newH, newW){
      this.updateChart()
      this.moving = true
      // console.log("RESIZE i=" + i + ", H=" + newH + ", W=" + newW);
    },
    // 网格尺寸拉伸结束
    // eslint-disable-next-line no-unused-vars
    handleGridResized (i, newH, newW){
      this.updateChart()
      this.moving = false
      // console.log("RESIZED i=" + i + ", H=" + newH + ", W=" + newW);
    },
    /**
     * 移除卡片
     */
    handleRemoveCard () {
      this.$emit('delete', this.params.i);
    },
    /**
     * 修改卡片
     */
    handleEditCard () {
      this.$emit('edit', this.params)
    },
    drag: function (e) {
      const mouseXY = {
        x: e.screenX,
        y: e.screenY
      };
      let DragPos = {};

      let parentRect = this.$refs.dragBox.$el.getBoundingClientRect();
      let mouseInGrid = false;
      if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
        mouseInGrid = true;
      }
      if (mouseInGrid === true && (this.layout.findIndex(item => item.i === 'drop')) === -1) {
        this.layout.push({
          x: (this.layout.length * 2) % (this.colNum || 12),
          y: this.layout.length + (this.colNum || 12), // puts it at the bottom
          w: 1,
          h: 1,
          i: 'drop',
        });
      }
      let index = this.layout.findIndex(item => item.i === 'drop');
      if (index !== -1) {
        try {
          this.$refs.gridlayout.$children[this.layout.length].$refs.item.style.display = "none";
        } catch {
          e
        }
        let el = this.$refs.gridlayout.$children[index];
        el.dragging = {"top": mouseXY.y - parentRect.top, "left": mouseXY.x - parentRect.left};
        let new_pos = el.calcXY(mouseXY.y - parentRect.top, mouseXY.x - parentRect.left);
        if (mouseInGrid === true) {
          this.$refs.gridlayout.dragEvent('dragstart', 'drop', new_pos.x, new_pos.y, 1, 1);
          DragPos.i = String(index);
          DragPos.x = this.layout[index].x;
          DragPos.y = this.layout[index].y;
        }
        if (mouseInGrid === false) {
          this.$refs.gridlayout.dragEvent('dragend', 'drop', new_pos.x, new_pos.y, 1, 1);
          this.layout = this.layout.filter(obj => obj.i !== 'drop');
        }
      }
    },
    dragend: function (e) {
      const mouseXY = {
        x: e.screenX,
        y: e.screenY
      };
      let DragPos = {};

      let parentRect = this.$refs.dragBox.$el.getBoundingClientRect();
      let mouseInGrid = false;
      if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
        mouseInGrid = true;
      }
      if (mouseInGrid === true) {
        alert(`Dropped element props:\n${JSON.stringify(DragPos, ['x', 'y', 'w', 'h'], 2)}`);
        this.$refs.gridlayout.dragEvent('dragend', 'drop', DragPos.x, DragPos.y, 1, 1);
        this.layout = this.layout.filter(obj => obj.i !== 'drop');
        // UNCOMMENT below if you want to add a grid-item
        /*
        this.layout.push({
            x: DragPos.x,
            y: DragPos.y,
            w: 1,
            h: 1,
            i: DragPos.i,
        });
        this.$refs.gridLayout.dragEvent('dragend', DragPos.i, DragPos.x,DragPos.y,1,1);
        try {
            this.$refs.gridLayout.$children[this.layout.length].$refs.item.style.display="block";
        } catch {
        }
        */
      }
    },
  }
}
</script>

<style lang="less" scoped>
.grid-item {
  z-index: 2;
}
.vue-draggable-handle {
  cursor: move !important;
}
.card.no-grid {
  position: relative;
  transform-origin: 0 0;
}
.card-controls {
  z-index: 1;
  position: absolute;
  top: 10px;
  right: 8px;
  [class|=el-icon] {
    font-size: 18px;
    cursor: pointer;
    margin-left: 3px;
    &:hover {
      color: red;
    }
  }
}
.chart {
  height: 100%;
}
.card-content {
  user-select: none;
  height: 100%;
  max-height: 100%;
}
</style>
