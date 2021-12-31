<template>
  <div class="button-content">
    <template v-if="params.dataType === 'circle'">
      <div class="button" v-html="circleFlag ? options.active : options.normal" @click="handleCircle"></div>
    </template>
    <template v-if="params.dataType === 'search'">
      <div class="button" v-html="search.flag ? options.active : options.normal" @click="handleClickSearch"></div>
      <div class="search-input" v-show="search.flag">
        <input type="text" v-model="search.text" placeholder="搜索" @keyup="handleSubmitSearch">
        <i class="el-icon-search search-submit" @click="handleSubmitSearch"></i>
        <ul class="search-list" tabindex="-1" v-show="search.result.length">
          <router-link
              v-for="(item, index) in search.result"
              tag="li"
              :to="`${options.companyPage}?cid=${item.id}`"
              :key="index"
          >
            {{ item.companyName }}
          </router-link>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import { searchCompanyList } from '@/api/remote';
export default {
  name: "ButtonCardContent",
  props: {
    params: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      options: {},
      search: {
        flag: false,
        text: '',
        resultTime: 0,
        result: []
      }
    }
  },
  computed: {
    circleFlag () {
      return this.$store.state.map.circleFlag;
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
      this.options = JSON.parse(this.params.options)
    },
    handleCircle () {
      this.$store.commit('map/SET_CIRCLE_FLAG', !this.circleFlag)
    },
    handleClickSearch () {
      this.search.flag = !this.search.flag;
    },
    handleSubmitSearch () {
      const searchTime = new Date().getTime()
      searchCompanyList({ name: this.search.text || null, parkId: this.$route.query.parkId || this.$route.params.projectId }).then(d => {
        // 防止异步时间错乱
        if (searchTime > this.search.resultTime) {
          this.search.result = d.data.slice(0, 10)
          this.search.resultTime = searchTime
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.button-content {
  position: relative;
  height: 100%;
  .button {
    cursor: pointer;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .search-input {
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 23, 33, .5);
    text-align: center;
    color: #ddd;
    font-size: 18px;
    input {
      width: 360px;
      height: 40px;
      outline: 0 none;
      background: #001721;
      opacity: .5;
      padding: 6px 11px;
      font-size: 16px;
      border: 1px solid #888;
      box-sizing: border-box;
      color: #ccc;
    }

    ::placeholder {
      font-size: inherit;
      color: inherit;
    }

    input:focus {
      border-color: #40a9ff;
    }

    .search-submit {
      width: 40px;
      height: 40px;
      line-height: 40px;
      background: #40a9ff;
      vertical-align: top;
      cursor: pointer;
    }

    .search-list {
      background: rgba(0, 23, 33, .5);
      text-align: center;
      color: #ddd;
      font-size: 18px;
      margin: 0;
      padding: 0;

      li {
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: .15em .5em;
      }

      li:hover {
        background: #40a9ff;
        color: #fff;
      }
    }
  }
}
</style>
