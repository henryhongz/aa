<template>
  <div v-html="content" class="list-content"></div>
</template>

<script>
import { getCardData } from "@/api/remote";
export default {
  name: "ListCardContent",
  components: {
  },
  props: {
    params: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      content: ''
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
      const box = document.createElement('div');
      box.innerHTML = this.params.options;
      const table = box.querySelector('table');
      const hasTitle = box.querySelector('tr th');
      // 把表头单独拎出来
      if (hasTitle) {
        const title = box.querySelector('tr:first-child')
        const thead = document.createElement('thead');
        table.prepend(thead);
        thead.append(title)
      }

      getCardData(this.params, this.$route).then(res => {
        const tbody = box.querySelector('tbody')
        if (!(res.data instanceof Array)) return;
        if (!tbody) {
          this.content = this.params.options;
          return;
        }
        // 依据内容模板生成内容
        const contentTpl = tbody.innerHTML
        let content = '';
        res.data.forEach((item, index) => {
          content += contentTpl.replaceAll('%index%', index + 1)
              .replaceAll(/%([a-zA-Z_0-9]+?)%/g, function ($0, $1) {
            return item[$1] === undefined ? $0 : item[$1];
          })
        })
        tbody.innerHTML = content;
        this.content = box.innerHTML;
        // const tableContent = box.querySelectorAll('table tbody tr');
        // const textContent = box.querySelectorAll(':not(table *):not(table)');
        // console.log(tableContent, textContent)
      })
    }
  },
  created () {
    this.update();
  }
}
</script>

<style lang="less" scoped>
.list-content {
  height: 100%;
  overflow: auto;
}
</style>
