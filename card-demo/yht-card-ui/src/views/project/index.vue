<template>
  <div>
    <el-header>
      <el-col :span="23">
        <el-row>
          <b>项目名：</b> {{ projectInfo.projectName }}
          <i class="el-icon-edit" @click="handleEditName"></i>
        </el-row>
        <el-row>
          <b>创建时间：</b>{{ new Date(projectInfo.createTime).toLocaleString() }}
        </el-row>
      </el-col>
      <el-col :span="1">
        <el-tooltip class="item" effect="dark" content="删除项目" placement="bottom">
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDeleteProject"></el-button>
        </el-tooltip>
      </el-col>
    </el-header>
    <el-main class="align-left">
      <el-row>
        <b>企业属性：</b>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="23">
          <el-row>
            <p>主要属性：</p>
            <p>
              <el-skeleton :loading="attributeLoading" :rows="1">
                <el-checkbox-group :value="necessaryAttributes.map(item => item.id)">
                  <el-checkbox v-for="attr in necessaryAttributes" :label="attr.id" :key="attr.id" disabled>{{attr.fieldChineseName}}</el-checkbox>
                </el-checkbox-group>
              </el-skeleton>
            </p>
          </el-row>
          <el-row>
            <p>
              次要属性：
               <el-checkbox :indeterminate="isIndeterminate" :value="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            </p>
            <p>
              <el-skeleton :loading="attributeLoading" :rows="2">
                <el-checkbox-group v-model="checkedAttributes">
                  <el-checkbox v-for="attr in unnecessaryAttributes" :label="attr.id" :key="attr.id">{{attr.fieldChineseName}}</el-checkbox>
                </el-checkbox-group>
              </el-skeleton>
            </p>
          </el-row>
          <el-row>
            <el-button type="primary" round @click="updateProjectAttributes">保存</el-button>
            <a :href="baseDownloadPath + '/common/companyfield/project/download/' + projectId" download>
              <el-button type="primary" round>下载模板</el-button>
            </a>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="align-left">
        <el-row><b>页面列表:</b></el-row>
        <el-row>
          <el-col :offset="1" :span="23">
<!--            <router-link v-for="page in projectInfo.pageList" :to="`/${projectInfo.id}/${page.id}`" :key="page.id">-->
<!--              {{ page.title }}<br>-->
<!--            </router-link>-->
            <router-link v-for="page in projectInfo.pageList" :to="`/${projectInfo.id}/${page.id}`" :key="page.id" style="text-decoration: none">
              <el-link icon="el-icon-document" style="margin-right: 20px">
                {{ page.title }}
              </el-link>
            </router-link>
            <span v-if="!projectInfo.pageList || !projectInfo.pageList.length">无</span>
          </el-col>
        </el-row>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import { editProject, deleteProject } from "@/api/project"
import { getRemoteProjectAttributes, updateRemoteProjectAttributes } from '@/api/remote'
export default {
  name: "Project",
  data () {
    return {
      checkedAttributes: []
    }
  },
  computed: {
    projectId () {
      return this.$route.params.projectId
    },
    projectInfo () {
      return this.$store.getters.getProject(this.projectId)
    },
    attributeLoading () {
      return !this.$store.state.attributes
    },
    necessaryAttributes () {
      return this.$store.getters.necessaryAttributes
    },
    necessaryAttributeKeys () {
      return this.necessaryAttributes.map(item => item.id)
    },
    unnecessaryAttributes () {
      return this.$store.getters.unnecessaryAttributes
    },
    unnecessaryAttributeKeys () {
      return this.unnecessaryAttributes.map(item => item.id)
    },
    isIndeterminate () {
      return !!this.checkedAttributes.length && this.checkedAttributes.length !== this.unnecessaryAttributes.length;
    },
    checkAll () {
      return !!this.checkedAttributes.length && this.checkedAttributes.length === this.unnecessaryAttributes.length
    },
    baseDownloadPath () {
      return process.env.VUE_APP_API_REMOTE_URL;
    }
  },
  watch: {
    projectId: {
      handler: function () {
        // 获取已选的属性
        getRemoteProjectAttributes(this.projectId).then(res => {
          this.checkedAttributes = res.rows.map(item => item.id).filter(item => this.necessaryAttributeKeys.indexOf(item) === -1)
        })
      },
      immediate: true
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedAttributes = val ? this.unnecessaryAttributeKeys : [];
    },
    handleEditName () {
      this.$prompt('请输入新名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '名称不能为空'
      }).then(({ value }) => {
        editProject({ id: this.projectId, projectName: value }).then(res => {
          this.$message.success(res.msg)
          this.$store.dispatch('updateProjects')
        }).catch(res => {
          this.$message.error(res)
        })
      }).catch(() => {});
    },
    handleDeleteProject () {
      this.$confirm('此操作将删除该项目所有数据, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProject(this.projectId).then(d => {
          this.$message.success(d.msg);
          return this.$store.dispatch('updateProjects').then(projects => {
            if (!projects.length) return
            this.$router.push('/' + projects[0].id)
          });
        })
      }).catch(() => {});
    },
    updateProjectAttributes () {
      const checked = [...this.necessaryAttributeKeys, ...this.checkedAttributes]
      updateRemoteProjectAttributes({  projectId: this.projectId, companyFieldIds: checked }).then(res => {
        this.$message.success(res.msg)
      }).catch(e => () => {
        this.$message.error(e)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.align-left {
  text-align: left;
}
.el-icon-edit {
  cursor: pointer;
  &:hover {
    color: cornflowerblue;
  }
}
</style>
