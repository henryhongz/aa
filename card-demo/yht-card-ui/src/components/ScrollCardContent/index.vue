<template>
  <div>
    <div class="table-header" :style="{ display: style._titleDisplay }">
      <span class="column" v-for="column in columns" :key="column.key" :style="{ width: column.width, ...style }">{{ column.title || column.key }}</span>
    </div>
    <text-auto-scroll :data="data" :timeout="5000" :max-line="maxLine" :line-height="lineHeight">
      <template #default="{ item }">
        <div>
          <span class="column" v-for="column in columns" :key="column.key" :style="{ width: column.width, ...style }">{{ item[column.key] }}</span>
        </div>
      </template>
    </text-auto-scroll>
  </div>
</template>

<script>
import TextAutoScroll from '@/components/TextAutoScroll';
import { getCardData } from "@/api/remote";
export default {
  name: "ScrollCardContent",
  components: {
    TextAutoScroll
  },
  props: {
    params: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      data: [],
      columns: [],
      maxLine: 5,
      lineHeight: 2,
      style: {}
    }
  },
  computed: {
    width () {
      if (!this.columns.length) return '100%';
      return 100 / this.columns.length + '%';
    }
  },
  watch: {
    params: {
      handler: function () {
        this.update()
      }
    }
  },
  methods: {
    update () {
      const options = JSON.parse(this.params.options || '{}');
      this.columns = options.columns || this.columns;
      this.maxLine = options.maxLine || this.maxLine;
      this.style = options.style || this.style;
      this.lineHeight = options.lineHeight || this.lineHeight;
      getCardData(this.params, this.$route).then(res => {
        this.data = res.data;
      })
    }
  },
  created () {
    this.update();
  }
}
</script>

<style lang="less" scoped>
.table-header {
  font-size: 0;
  line-height: 2;
}
.column {
  font-size: 16px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
