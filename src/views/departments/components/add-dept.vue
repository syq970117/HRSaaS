<template>
  <!-- 放置弹层组件 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCanel">
    <!-- 表单数据 -->
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width: 80%;" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width: 80%;" placeholder="请输入部门编号" />
      </el-form-item>
      <el-form-item label="部门负责人" placeholder="请选择部门负责人" prop="manager">
        <!-- native修饰符可以找到原生元素的事件 -->
        <el-select v-model="formData.manager" style="width: 80%;" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :value="item.username" :label="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width: 80%;" type="textarea" :rows="3" placeholder="请输入部门介绍" />
      </el-form-item>
    </el-form>

    <!-- 确定和取消 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCanel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  // 传入一个props变量来控制显示或隐藏
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检查部门名称是否重复
    const checkNameRepeat = async(rule, value, callback) => {
      // value是部门名称，要去和同级部门比较
      const { depts } = await getDepartments()
      // 找同级部门下有无和value相同的数据
      // 找到同级部门的所有子部门
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式
        // 编辑的数据在数据库里
        // 同级部门下，我的名字不能和其他同级部门名字重复
        // 首先要找到我的同级部门，我的id是this.formData.id 我的pid是this.formData.pid
        // depts.filter(item => item.pid === this.formData.pid)
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 新增模式
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }

      isRepeat ? callback(new Error(`同级部门下已存在${value}！`)) : callback()
    }

    // 检查部门编码是否重复
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      // 要求部门编码不能重复
      // 由于历史数据没有code，需要加一个强制性条件 value不能为空
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式
        // 要求不能有一样的code
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        // 新增模式
        isRepeat = depts.some(item => item.code === value && value)
      }

      isRepeat ? callback(new Error(`组织架构下已经存在该${value}编码了`)) : callback()
    }

    return {
      // 定义一个表单数据
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      // 校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空！', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称长度为1-50个字符！', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepeat }
        ],
        code: [
          { required: true, message: '部门编码不能为空！', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称长度为1-50个字符！', trigger: 'blur' },
          { validator: checkCodeRepeat, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空！', trigger: 'blur' }
        ]
      },
      peoples: [] // 接受获取的员工简单列表的数据
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
      console.log(this.peoples)
    },
    // 点击确定时触发
    btnOk() {
      // 手动校验表单数据
      this.$refs.deptForm.validate(async isOk => {
        if (isOk) {
          if (this.formData.id) {
            // 编辑
            await updateDepartments(this.formData)
          } else {
            // 新增
            // 将父级id设置成子级pid
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          // 表示可以提交了
          // 将父级部门的id设置为子部门的pid
          // await addDepartments({ ...this.formData, pid: this.treeNode.id })
          // 通知父组件数据已修改，需要刷新页面
          this.$emit('addDepts')
          // 修改showDialog的值
          this.$emit('update:showDialog', false)
        }
      })
    },
    btnCanel() {
      // 重置数据
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 关闭弹层
      this.$emit('update:showDialog', false)
      // 清除校验
      // 只能重置定义在data中的数据
      this.$refs.deptForm.resetFields()
    },
    // 获取部门详情
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style></style>
