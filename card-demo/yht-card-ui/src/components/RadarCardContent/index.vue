<template>
  <div class="radar-chart">
    <div class="radar-chart-content" :ref="id"></div>
    <div class="radar-chart-note" v-show="options.label.show">
      <div class="radar-chart-label" v-for="item in label" :key="item.name">
        <span class="icon" :style="options.label.icon"></span>
        <span class="name" :style="options.label.name">{{ item.name }}</span>
        <span class="value" :style="options.label.value">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getCardData } from "@/api/remote";

import * as echarts from "echarts";

export default {
  name: "RadarCardContent",
  props: {
    params: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      chart: null,
      label: []
    }
  },
  computed: {
    fullScreen () {
      return this.$store.state.fullscreenFlag;
    },
    id () {
      return 'chart_' + this._uid;
    },
    options () {
      try {
        return JSON.parse(this.params.options)
      } catch (e) {
        return {}
      }
    }
  },
  watch: {
    params: {
      handler: function () {
        this.update(true);
      }
    }
  },
  methods: {
    update (redraw) {
      const url = this.params.dataInterface;
      if (!url) return;
      if (this.chart && !redraw) {
        this.chart.resize();
        return;
      }
      getCardData(this.params, this.$route).then(res => {
        this.label = res.data;
        let chart = null;
        if (this.chart) {
          chart = this.chart;
          chart.clear();
        } else {
          chart = this.chart = echarts.init(this.$refs[this.id]);
        }
        if (!res.data.length) return;
        // 初始化数据
        const data = res.data.map(item => item.value);
        const max = Math.max(...data);
        const indicator = res.data.map(item => {
          return {
            name: item.name,
            max: max
          }
        });

        const option = this.options.option;
        option.radar.indicator = indicator;
        option.series[0].data[0].value = data;
        chart.setOption(option);
        this.chart.resize();
      })
    }
  },
  mounted() {
    this.update();
  }
}
</script>

<style lang="less" scoped>
.radar-chart {
  height: 100%;
  display: flex;
  .radar-chart-content {
    height: 100%;
    flex: 1;
  }
  .radar-chart-note {
    margin-left: 20px;
    width: 120px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .radar-chart-label {
      position: relative;
      white-space: nowrap;
      .icon {
        width: 6px;
        height: 6px;
        background: orange;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto;
      }
      .name {
        padding-left: 12px;
        color: white;
        font-size: 12px;
        line-height: 2;
        margin-right: 20px;
      }
      .value {
        color: orange;
      }
    }
  }
}
</style>
