<template>
  <h1 style="margin-bottom: 20px; text-align: center">神州云和页面生成器</h1>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
    <el-form-item label="选择工程" prop="project">
      <el-select v-model="ruleForm.project" placeholder="请选择">
        <el-option v-for="item in projectList" :label="item.name" :value="item.key" />
      </el-select>
    </el-form-item>

    <el-form-item label="页面类型" prop="type">
      <el-select v-model="ruleForm.type" placeholder="请选择">
        <el-option label="表格列表页面" value="pageList" />
        <el-option label="tabs列表页面" value="tabsList" />
      </el-select>
    </el-form-item>

    <el-form-item label="文件夹名称" prop="name">
      <el-input v-model.trim="ruleForm.name" />
    </el-form-item>
    <el-form-item label="是否生成API" prop="hasApi">
      <el-switch v-model="ruleForm.hasApi" />
    </el-form-item>

    <!-- 表格列表页面 -->
    <div v-show="ruleForm.type == 'pageList'">
      <PageList ref="pageListRef" />
    </div>

    <!-- tabs列表页面 -->
    <div v-show="ruleForm.type == 'tabsList'">
      <el-form-item label="tabs项">
        <div class="tabs-list">
          <div class="tabs-item" v-for="(item, index) in ruleForm.tabs">
            <el-input v-model.trim="item.name" style="width: 200px" />
            <el-input v-model.trim="item.value" style="width: 200px; margin: 0 12px" />
            <el-button @click="delTabs(index)" v-if="ruleForm.tabs.length > 1">删除</el-button>
          </div>
          <el-button type="primary" @click="addTabs">新增</el-button>
        </div>
      </el-form-item>
    </div>

    <el-form-item style="margin-top: 16px">
      <el-button type="primary" size="large" @click="submitForm(ruleFormRef)"> 创建 </el-button>
      <el-button @click="resetForm(ruleFormRef)" size="large">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { create } from '@/api/createFile'
import PageList from './pageList.vue'
const ruleFormRef = ref()
const pageListRef = ref()
const projectList = [
  { name: '税务申报', key: 'declare' },
  { name: '税务运维', key: 'declare-back' },
  { name: '税务档案', key: 'tax-file' },
]
const ruleForm = reactive({
  name: 'abcd',
  project: 'declare',
  hasApi: false,
  type: 'tabsList',
  tabs: [{ name: '选项一', value: '111' }],
})
const rules = reactive({
  project: [{ required: true, message: '请选择', trigger: 'change' }],
  type: [{ required: true, message: '请选择', trigger: 'change' }],
  name: [{ required: true, message: '请输入', trigger: 'blur' }],
  tabs: [{ required: true, message: '请输入', trigger: 'blur' }],
})
const addTabs = () => {
  ruleForm.tabs.push({ name: '', value: '' })
}
const delTabs = (index) => {
  ruleForm.tabs.splice(index, 1)
}
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      if (ruleForm.type === 'tabsList') {
        for (let i = 0; i < ruleForm.tabs.length; i++) {
          let { name, value } = ruleForm.tabs[i]
          if (!name || !value) {
            return ElMessage.error('请输入完整的tabs选项')
          }
        }
      }
      create({
        ...ruleForm,
        hasApi: ruleForm.hasApi,
        isMultipleTable: pageListRef.value.isMultipleTable,
        searchTableData: pageListRef.value.searchTableData,
        columnTableData: pageListRef.value.columnTableData,
        tableSetList: pageListRef.value.tableSetList,
        tableItemSetList: pageListRef.value.tableItemSetList,
      }).then((res) => {
        console.log(res)
        const { code, msg } = res
        if (code === 200) {
          ElMessage.success('创建成功')
        } else {
          ElMessage.error(msg)
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style lang="scss" scoped>
.tabs-item {
  display: flex;
  margin-bottom: 8px;
}
</style>
