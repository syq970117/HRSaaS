<template>
  <!-- <div class="dashboard-container"> -->
  <div class="app-container">
    <page-tools :show-before="true">
      <!-- 左侧显示总记录数 -->
      <!-- <span slot="before">共16条记录</span> -->
      <template v-slot:before>
        <span slot="before">共{{ page.total }}条记录</span>
      </template>
      <!-- 右侧显示按钮 -->
      <template v-slot:after>
        <el-button size="small">新增</el-button>
        <el-button size="small">导入</el-button>
        <el-button size="small">导出</el-button>
      </template>
    </page-tools>

    <!-- 放置表格 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="序号" type="index" sortable="" />
      <el-table-column label="姓名" prop="username" sortable="" />
      <el-table-column label="工号" prop="workNumber" sortable="" />
      <el-table-column label="聘用形式" prop="formOfEmployment" sortable="" />
      <el-table-column label="部门" prop="departmentName" sortable="" />
      <el-table-column label="入职时间" prop="timeOfEntry" sortable="" />
      <el-table-column label="账户状态" prop="enableState" sortable="" />
      <el-table-column label="操作" sortable="" fixed="right" width="280">
        <template>
          <el-button type="text" size="small">查看</el-button>
          <el-button type="text" size="small">转正</el-button>
          <el-button type="text" size="small">调岗</el-button>
          <el-button type="text" size="small">离职</el-button>
          <el-button type="text" size="small">角色</el-button>
          <el-button type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-row type="flex" justify="center" align="middle" style="height: 60px">
      <el-pagination :current-page="page.page" :page-size="page.size" :total="page.total" layout="prev, pager, next" @current-change="changePage" />
    </el-row>
  </div>
  <!-- </div> -->
</template>

<script>
import { getEmployeeList } from '@/api/employees'
export default {
  data() {
    return {
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false // 显示遮罩层
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    }
  }
}
</script>

<style></style>
