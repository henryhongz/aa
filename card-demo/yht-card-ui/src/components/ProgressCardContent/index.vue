<template>
  <div>
    <div v-if="options.total && options.total._show" :style="options.total">
      <div>{{ options.total._name }}</div>
      <div><span style="font-size: 32px">{{ total }}</span> {{ options.total._unit }}</div>
    </div>
    <div v-for="item in data" :key="item.name">
      <div class="box">
        <span class="name" :style="options.name">{{ item.name }}</span>
        <span class="value" :style="options.value">{{ item.value }}{{ options.value._unit }}</span>
      </div>
      <div class="progress" :style="{ ...options.progress, width: item.value / max * 100 + '%' }"></div>
    </div>
  </div>
</template>

<script>
import { getCardData } from "@/api/remote";

export default {
  name: "ProgressCardContent",
  props: {
    params: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      data: []
    }
  },
  computed: {
    max () {
      return Math.max(...this.data.map(item => item.value));
    },
    total () {
      let total = 0;
      this.data.forEach(item => {
        total += item.value;
      })
      return total;
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
        this.update()
      },
      immediate: true
    }
  },
  methods: {
    update () {
      const url = this.params.dataInterface;
      if (!url) return;
      getCardData(this.params, this.$route).then(res => {
        this.data = res.data;
      })
    }
  }
}
</script>

<style lang="less" scoped>
.box{
  font-size: 0;
  &:after {
    content: '';
    width: 100%;
    display: inline-block;
    clear: both;
  }
}
.name {
  display: inline-block;
  vertical-align: middle;
}
.value {
  display: inline-block;
  vertical-align: middle;
}
.progress {
  margin-top: 5px;
  margin-bottom: 8px;
  //background: repeating-linear-gradient(90deg, #f5b174 0, #f5b174 6px, transparent 0, transparent 10px);
  height: 10px;
  position: relative;
  &:after {
    content: '';
    background: rgba(0, 0, 0, .2);
    display: inline-block;
    height: 100%;
    z-index: -1;
  }
}
</style>
