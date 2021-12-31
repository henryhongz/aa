<template>
  <div class="grid-layout full-screen">
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
        key="readOnly"
    >
      <card
          v-for="item in layout"
          :key="item.i"
          :params="item"
      />
    </grid-layout>
  </div>
</template>

<script>
import TdtMap from '@/components/TdtMap'
import VueGridLayout from 'vue-grid-layout'
const GridLayout = VueGridLayout.GridLayout;
import Card from "@/components/Card";
export default {
  name: "ReadOnly",
  components: {
    GridLayout,
    Card,
    TdtMap
  },
  data () {
    return {
      background: '',
      // layout: [],
      // 卡片行数
      gridX: 1920 / 5,
      // 卡片列数
      gridY: 1080 / 5,
      // 卡片网格的高度
      gridHeight: 1,
    }
  },
  computed: {
    pageId () {
      return this.$route.params.pageId;
    },
    page () {
      return this.$store.getters.getPage(this.pageId) || {};
    },
    layout () {
      if (!this.page.layout) return [];
      return this.$store.getters.mergeLayout(this.page.layout)
    },
    settings () {
      const settings = JSON.parse(this.page.background || {});
      this.$store.commit('map/SET_CITY_CODE', settings.cityCode);
      return this.page.background ? settings : {};
    },
    showMap () {
      return this.settings.backgroundType === 'map' && !(this.settings.quickDev && process.env.VUE_APP_LIMIT === 'false');
    }
  },
  methods: {
    // 更新网格容器高度
    computeGridHeight () {
      this.gridHeight = this.$refs.grid.$el.clientHeight;
    },
  },
  mounted() {
    // 动态变化的卡片容器高度
    this.computeGridHeight();
    window.onresize = () => {
      this.computeGridHeight();
    }
    window.onkeydown = (e) => {
      if (e.key === 'Escape') this.$store.commit('changeFullscreenFlag', false);
    }
  },
  beforeDestroy () {
    window.onresize = null;
    window.onkeydown = null;
  }
}
</script>

<style scoped>
.grid-layout {
  overflow: hidden;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
