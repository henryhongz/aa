<template>
  <span v-html="formatDate()"></span>
</template>

<script>
export default {
  name: "DatetimeCardContent",
  props: {
    params: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      // 时间
      timer: null,
      // 定时器
      interval: null
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
      // 先清空定时器
      if (this.interval) {
        clearInterval(this.interval)
        this.timer = null;
        this.interval = null;
      }
      this.timer = new Date();
      setInterval(() => {
        this.timer = new Date();
      }, 1000);
    },
    formatDate () {
      const dict = {
        0: '日',
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六'
      }
      const year = this.timer.getFullYear();
      const month = this.timer.getMonth() + 1;
      const date = this.timer.getDate();
      const day = this.timer.getDay();
      const hours = this.timer.getHours();
      const minutes = this.timer.getMinutes();
      const seconds = this.timer.getSeconds();
      let datetime = this.timer.toLocaleString();
      if (this.params.options) {
        datetime = this.params.options
                    .replaceAll('%yy%', year.toString().slice(2))
                    .replaceAll('%yyyy%', year)
                    .replaceAll('%MM%', month.toString().padStart(2, '0'))
                    .replaceAll('%dd%', date.toString().padStart(2, '0'))
                    .replaceAll('%HH%', hours.toString().padStart(2, '0'))
                    .replaceAll('%hh%', hours > 12 ? '下午' + (hours - 12).toString().padStart(2, '0') : '上午' + hours.toString().padStart(2, '0'))
                    .replaceAll('%mm%', minutes.toString().padStart(2, '0'))
                    .replaceAll('%ss%', seconds.toString().padStart(2, '0'))
                    .replaceAll('%E%', dict[day])
                    .replaceAll('%e%', day)
      }
      return datetime;
    }
  },
  created() {
    this.update();
  }
}
</script>

<style scoped>

</style>
