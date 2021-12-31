<template>
  <div class="gauge-chart">
    <div class="gauge-chart-content" :ref="id"></div>
  </div>
</template>

<script>
import { getCardData } from "@/api/remote";

import * as echarts from "echarts";

export default {
  name: "GaugeCardContent",
  props: {
    params: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      chart: null
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
        let chart = null;
        if (this.chart) {
          chart = this.chart;
          chart.clear();
        } else {
          chart = this.chart = echarts.init(this.$refs[this.id]);
        }
        // 初始化数据
        const data = res.data;
        const option = this.options.option;
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
.gauge-chart {
  height: 100%;
  display: flex;
  .gauge-chart-content {
    height: 100%;
    flex: 1;
  }
  .gauge-chart-note {
    margin-left: 20px;
    width: 120px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .gauge-chart-label {
      position: relative;
      &:before {
        content: '';
        width: 6px;
        height: 6px;
        background: orange;
        position: absolute;
        left: -12px;
        top: 0;
        bottom: 0;
        margin: auto;
      }
      .name {
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
