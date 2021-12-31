<template>
  <div class="line-chart">
    <div class="line-chart-content" :ref="id"></div>
  </div>
</template>

<script>
import { getCardData } from "@/api/remote";

import * as echarts from "echarts";

export default {
  name: "BarCardContent",
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
        if (!(res.data instanceof Array) || !res.data.length) return;
        // 初始化数据
        const option = this.options.option;
        option.tooltip.formatter = function (args) {
          return `${args.marker}${args.seriesName} ${args.data}`
        }
        const nameKey = typeof option.series[0].name === 'string' ? option.series[0].name : 'name';
        const valueKey = typeof option.series[0].data === 'string' ? option.series[0].data : 'value';
        const series = option.series[0];
        const strSeries = JSON.stringify(series);
        let total = 0;
        const data = res.data.map(item => {
          total += item[valueKey];
          return {
            ...JSON.parse(strSeries),
            name: item[nameKey],
            data: [item[valueKey]]
          };
        });
        if (series._showTotal) {
          data.push({
            ...JSON.parse(strSeries),
            name: series._totalName || '总数',
            data: [ total ]
          })
        }
        if (option.legend._showValue) {
          option.legend.formatter = function (name) {
            const value = data.find(item => item.name === name).data[0];
            return `${name}:   {value|${value}} {unit|${option.legend._unit || ''}}`
          }
        }
        option.series = data;
        option.legend.data = data.map(item => item.name).reverse();

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
.line-chart {
  height: 100%;
  display: flex;
  .line-chart-content {
    height: 100%;
    flex: 1;
  }
  .line-chart-note {
    margin-left: 20px;
    width: 120px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .line-chart-label {
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
