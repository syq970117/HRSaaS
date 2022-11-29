<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 -->
      <el-card class="tree-card">
        <!-- 头部 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 树形组件 -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 循环多少次 -->
          <!-- 作用域插槽 slot-scope='obj' 接受传给插槽的数据 data 每个节点的数据对象 -->
          <tree-tools slot-scope="{ data }" :tree-node="data" @addDepts="addDepts" @editDepts="editDepts" @delDepts="getDepartments" />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增弹层组件 -->
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
import treeTools from './components/tree-tools.vue'
import addDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { translateListToTreeData } from '@/utils/index'

export default {
  components: { treeTools, addDept },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'name' // 从这个属性显示内容
      },
      showDialog: false, // 默认不显示
      node: null
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = translateListToTreeData(result.depts, '') // 需要将其转化成树形结构
    },
    // 点击编辑
    addDepts(node) {
      this.showDialog = true
      this.node = node
    },
    editDepts(node) {
      // 打开弹层
      this.showDialog = true
      // 赋值要操作的节点
      this.node = node
      // 父组件调用子组件方法
      this.$refs.addDept.getDepartDetail(node.id) // 直接调用子组件中的方法，传入1个id
    }
  }

}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
