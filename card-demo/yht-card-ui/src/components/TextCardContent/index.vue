<template>
  <router-link v-if="params.link" :to="params.link" class="link" v-html="linkActive ? params.style._activeContent : params.options" />
  <span v-else v-html="content"></span>
</template>

<script>
import { getCardData } from "@/api/remote";

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
      // 需要渲染的内容
      content: ''
    }
  },
  computed: {
    fullScreen () {
      return this.$store.state.fullscreenFlag;
    },
    linkActive () {
      return this.$route.path === this.params.link;
    }
  },
  watch: {
    params: {
      handler: function () {
        this.update();
      },
      immediate: true
    }
  },
  methods: {
    update () {
      const type = this.params.dataType;
      const url = this.params.dataInterface;
      if (!url) {
        this.content = this.params.options;
        return;
      }
      getCardData(this.params, this.$route).then(res => {
        if (type === 'dynamic') {
          this.content = this.params.options.replaceAll('%d%', res.data);
        } else if (type === 'object') {
          res.data = res.data || {};
          this.content = this.params.options.replaceAll(/%([a-zA-Z_0-9]+?)%/g, function ($0, $1) {
            return res.data[$1] === undefined ? $0 : res.data[$1];
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.link {
  color: inherit;
  text-decoration: none;
  //&.router-link-active {
  //  border-bottom: 2px solid;
  //}
}
</style>
