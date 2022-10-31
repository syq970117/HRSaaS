<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 -->
      <el-card class="tree-card">
        <!-- 头部 -->
        <tree-tools :tree-node="company" :is-root="true" />
        <!-- 树形组件 -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 循环多少次 -->
          <!-- 作用域插槽 slot-scope='obj' 接受传给插槽的数据 data 每个节点的数据对象 -->
          <tree-tools slot-scope="{ data }" :tree-node="data" />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import treeTools from './components/tree-tools.vue'
export default {
  components: { treeTools },
  data() {
    return {
      company:
        {
          name: '四方集团',
          manager: '负责人'
        },
      departs: [
        {
          name: '总裁办',
          manager: '刘帅帅',
          children: [
            {
              name: '董事会',
              manager: '朱豪'
            }
          ]
        },
        {
          name: '行政部',
          manager: '厉明超'
        },
        {
          name: '人事部',
          manager: '王金甫'
        }
      ],
      defaultProps: {
        label: 'name' // 从这个属性显示内容
      }
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
