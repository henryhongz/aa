<template>
  <div class="menu-layout">
    <page-view v-if="fullscreen"></page-view>
    <template v-else>
      <Menu />
      <div class="router-view">
        <router-view />
      </div>
    </template>
  </div>
</template>

<script>
import Menu from '@/components/Menu';
import pageView from '@/views/pageView';
export default {
  name: "MenuLayout",
  components: {
    Menu,
    pageView
  },
  computed: {
    fullscreen() {
      return this.$store.state.fullscreenFlag;
    }
  }
}
</script>

<style scoped>
.menu-layout {
  width: 100%;
  display: flex;
  overflow: hidden;
  height: 100%;

}
.router-view {
  flex: 1;
  overflow: auto;
}
</style>
