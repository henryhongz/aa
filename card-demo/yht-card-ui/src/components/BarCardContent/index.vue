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
        const axis = option.xAxis.type === 'category' ? 'xAxis' : 'yAxis';
        const nameKey = typeof option[axis].data === 'string' ? option[axis].data : 'name';
        option[axis].data = res.data.map(item => item[nameKey]);
        option.series.forEach(item => {
          const valueKey = typeof item.data === 'string' ? item.data : 'value';
          item.data = res.data.map(item => item[valueKey]);
        })
        // 颜色列表为空时，去掉该属性以防止出错
        if (option.color instanceof Array && !option.color.length) {
          delete option.color;
        }

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
