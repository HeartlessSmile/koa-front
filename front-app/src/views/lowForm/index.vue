<template>
  <el-container class="layout-container">
    <el-header class="layout-header">
      <el-button class="mr-16" @click="goBack">返回</el-button>
      <span>表单设计器</span>
    </el-header>
    <el-container>
      <el-aside class="layout-aside">
        <draggable
          class="list-group"
          :list="menuList"
          :group="{ name: 'form', pull: 'clone', put: false }"
          :clone="cloneDog"
          @change="log"
          item-key="id"
          :move="onMove"
        >
          <template #item="{ element }">
            <el-button class="menu-item">
              {{ element.name }}
            </el-button>
          </template>
        </draggable>
      </el-aside>
      <div class="canvas-layout">
        <canvas-form />
      </div>
    </el-container>
  </el-container>
</template>
<script setup>
import canvasForm from './canvas-form.vue'
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import draggable from 'vuedraggable'
let idGlobal = 10
const menuList = ref([
  { name: '按钮', id: 1, type: 'button' },
  { name: 'input输入框', id: 2, type: 'input' },
  { name: 'select选择框', id: 3, type: 'select' },
  { name: '日期选择框', id: 4, type: 'date' },
])

const router = useRouter()
const goBack = () => {
  router.back()
}
const onMove = (e, originalEvent) => {
  if (e.to.className.indexOf('list-group') > -1) {
    return false
  }
  return true
}
const log = (evt) => {
  // console.log(evt)
}
const cloneDog = (item) => {
  console.log(item)
  return {
    ...item,
    id: idGlobal++,
  }
}
</script>
<style scoped lang="scss">
.layout-container {
  height: 100vh;
  overflow: hidden;
  .layout-header {
    line-height: 60px;
    border-bottom: 1px solid #e6e6e6;
  }
  .layout-aside {
    border-right: 1px solid #e6e6e6;
    width: 300px;
    padding: 12px;
  }
  .canvas-layout {
    flex: 1 1;
    height: calc(100vh - 60px);
    overflow: hidden;
    position: relative;
  }
}

.menu-item {
  width: 100px;
  margin-bottom: 8px;
  margin-left: 12px;
}
.form-ghost {
  height: 1px;
  width: 100%;
  overflow: hidden;
  background: var(--el-color-primary);
  color: var(--el-color-primary);
}
</style>
