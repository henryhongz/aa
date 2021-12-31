<template>
  <el-menu
      :default-openeds="activeMenu"
      class="el-menu-vertical"
      @open="handleOpen"
      @close="handleClose"
      :collapse="false"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#fff"
  >
    <div class="menu-title">
      云汇通卡片系统
<!--      <span class="change-menu" @click="changeType">-->
<!--        <el-link type="primary" :underline="false">切换</el-link>-->
<!--      </span>-->
    </div>
    <!-- 菜单 -->
    <card-pool v-if="type === 'cardPool'"></card-pool>
    <template v-if="type === 'menu'">
      <el-submenu :index="project.id.toString()" v-for="project in projectList" :key="project.id">
        <template slot="title">
        <span :class="{ 'menu-active': `/${project.id}` === activePath }">
          <i class="el-icon-files"></i>
          <span slot="title">{{ project.projectName }}</span>
        </span>
        </template>
        <el-menu-item
            v-for="page in project.pageList"
            :index="`${ project.id }-${page.id}`"
            :key="page.id"
            @click="goto(`/${project.id}/${page.id}`)"
            class="overflow-ellipsis"
            :class="{ 'menu-active': `/${project.id}/${page.id}` === activePath }"
        >
          <i class="el-icon-document"></i>
          {{ page.title }}
        </el-menu-item>
        <el-menu-item :index="`page-${project.id}`" class="create" @click="addPage(project.id)">
          <i class="el-icon-document-add"></i>
          添加页面
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="proj" class="create" @click="addProject">
        <i class="el-icon-document-add"></i>
        新建项目
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
import { addPage } from "@/api/card";
import { addProject } from  '@/api/project';
import CardPool from '@/components/CardPool';

export default {
  name: "Menu",
  components: {
    CardPool
  },
  data () {
    return {
      type: 'menu' // menu：菜单   cardPool：卡片池
    }
  },
  computed: {
    activePath () {
      if (!this.$route.params.pageId) return `/${this.projectId}`
      return `/${this.projectId}/${this.$route.params.pageId}`;
    },
    activeMenu () {
      if (!this.projectId) return []
      return [`${this.projectId}`];
    },
    menuList () {
      return this.$store.state.pages;
    },
    projectList () {
      return this.$store.state.projects;
    },
    projectId () {
      return this.$route.params.projectId
    }
  },
  methods: {
    changeType () {
      this.type = (this.type === 'menu' ? 'cardPool' : 'menu');
    },
    // eslint-disable-next-line no-unused-vars
    handleOpen(key, keyPath) {
      if (this.$route.path === `/${key}`) return
      this.$router.push(`/${key}`).catch(() => {})
    },
    // eslint-disable-next-line no-unused-vars
    handleClose(key, keyPath) {
      if (this.$route.path === `/${key}`) return
      this.$router.push(`/${key}`).catch(() => {})
    },
    goto (url) {
      this.$router.push({ path: url },
        () => {},
        () => {})
    },
    addPage (pid) {
      this.$prompt('请输入标题', '新建页面', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        return addPage(pid, value)
      }, () => {
        throw new Error('取消');
      }).then(d => {
        this.$message.success(d.msg);
        this.$store.dispatch('updateProjects').then(projects => {
          const project = projects.find(item => item.id === pid)
          this.$router.push(`/${pid}/${project.pageList[0].id}`)
        })
      }, (e) => {
        if (e.message === '取消') return;
        this.$message.error('添加失败');
      });
    },
    addProject () {
      this.$prompt('请输入项目名称', '新建项目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        return addProject(value)
      }, () => {
        throw new Error('取消');
      }).then(d => {
        this.$message.success(d.msg);
        this.$store.dispatch('updateProjects').then(projects => {
          this.$router.push('/' + projects[0].id)
        })
      }, (e) => {
        if (e.message === '取消') return;
        this.$message.error('添加失败');
      });
    }
  }
}
</script>

<style lang="less" scoped>
.menu-title {
  padding: 10px 0;
  text-align: center;
  color: #fff;
  background: inherit;
  z-index: 1;
  border-bottom: 1px solid #999;
  position: sticky;
  top: 0;
}
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  text-align: left;
  overflow: auto;
}
.overflow-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-menu-item.is-active i {
    color: #909399;
}
.menu-active {
  color: #ffd04b !important;
  i {
    color: inherit !important;
  }
}
.create {
  color: #909399 !important;
  i {
    color: inherit !important;
  }
}
</style>
