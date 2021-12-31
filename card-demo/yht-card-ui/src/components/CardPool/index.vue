<template>
  <el-row>
    <el-input
        placeholder='请输入卡片标签(多个标签请以 " "(空格) 或 ","(逗号) 分割)'
        v-model="cardTagSearch"
        class="input-with-select"
        @input="handleCardTagSearch"
        size="mini"
    >
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
      <el-button slot="append" icon="el-icon-search" @click="handleCardTagSearch"></el-button>
    </el-input>
    <div v-loading="searchingFlag" style="min-height: 200px;" v-infinite-scroll="loadCardPool">
      <el-empty v-show="!cardList.length" description="暂无卡片"></el-empty>
      <el-row v-for="item in cardPool" :key="item.i" class="card-component" style="overflow: auto;">
        <el-col :span="20">
          <el-row class="tags">
            标签：
            <el-tag
                :key="tag"
                v-for="tag in item.tag"
                :disable-transitions="false"
                size="mini"
            >
              {{ tag }}
            </el-tag>
            <span v-if="!item.tag.length">无标签</span>
          </el-row>
          <card :ref="`card-${item.i}`" :params="item" :grid="false" :box-width="190"/>
        </el-col>
        <el-col :span="4">
<!--          <el-row>-->
<!--            <el-button v-show="item.type !== 'text'" plain @click="handleRefreshComponent(item.i)">刷新</el-button>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--            <el-button plain @click="handleRefererComponent(item)">引用</el-button>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--            <el-button type="primary" @click="handleCopyComponent(item)">复制</el-button>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--            <el-button type="danger" @click="handleDeleteComponent(item.i)">删除</el-button>-->
<!--          </el-row>-->
        </el-col>
      </el-row>
      <p v-if="cardPool.length === cardList.length">没有更多了</p>
    </div>
  </el-row>
</template>

<script>
import {searchCard} from "@/api/card";
import Card from '@/components/Card'

export default {
  name: "CardPool",
  components: {
    Card
  },
  data () {
    return {
      // 卡片标签搜索
      cardTagSearch: '',
      // 搜索后的卡片列表
      searchedCardList: [],
      searchingFlag: false,
      // 添加标签
    }
  },
  computed: {
    cardList () {
      if (this.cardTagSearch) return this.searchedCardList;
      return this.$store.state.cards;
    },
    cardPool () {
      return this.cardList.slice(0, this.cardPoolLimit);
    }
  },
  methods: {
    /**
     * 根据标签搜索卡片组件
     */
    handleCardTagSearch () {
      if (!this.cardTagSearch) return;
      this.searchingFlag = true;
      const formatedSearch = this.cardTagSearch.replaceAll(/(\s+)|(，+)/g, ',');
      searchCard (formatedSearch).then (d => {
        this.searchedCardList = d.data.map(item => {
          let options = '';
          try {
            options = JSON.parse(item.options);
          } catch (e) {
            options = item.options;
          }
          return {
            i: parseInt(item.id),
            w: parseInt(item.width),
            h: parseInt(item.length),
            x: item.x,
            y: item.y,
            title: item.title || '',
            options: options,
            type: item.type,
            style: JSON.parse(item.style) || { total: {}, title: {}, content: {} },
            tag: item.tag ? item.tag.split(',') : []
          }
        });
      }).finally(() => {
        this.searchingFlag = false;
      })
    },
    // 加载卡片池
    loadCardPool () {
      if (this.cardPoolLimit >= this.cardList.length) return;
      this.cardPoolLimit += 5
    }
  }
}
</script>

<style scoped>
.tags {
  font-size: 14px;
  color: #fff;
}
</style>
