<template>
  <!-- 显示form-item的操作项和拖拽 -->
  <div class="item-box">
    <el-form-item class="form-item" label="Activity name">
      <el-input v-model="element.name" />
    </el-form-item>
    <div class="icon-box">
      <el-icon class="move-item move-icon"><Position /></el-icon>
      <el-icon class="set-icon" @click="handleSet(element)"><Tools /></el-icon>
      <el-icon class="del-icon" @click.stop="handleDelete(element)">
        <Delete />
      </el-icon>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({
  element: {
    type: Object,
    default: () => {},
  },
})
const { element } = props
const handleDelete = (element) => {
  console.log('删除', element)
}
const handleSet = (element) => {
  console.log('设置', element)
}
</script>
<style scoped lang="scss">
.item-box {
  position: relative;
  padding: 8px;
  border: 1px solid #e6e6e6;

  &:hover .icon-box {
    display: flex;
  }
  
}
.form-item {
  height: 32px;
  margin-bottom: 8px;
  padding-right: 100px;
}
.icon-box {
  position: absolute;
  right: 0px;
  top: 0px;
  background: var(--el-color-primary);
  color: #fff;
  text-align: center;
  display: none;
  align-items: center;
  justify-content: center;
  height: 20px;
  z-index: 1;
  padding: 0 8px;
  cursor: pointer;
  .move-icon {
    cursor: move;
  }
  .set-icon {
    margin-left: 8px;
  }
  .del-icon {
    margin-left: 8px;
  }
}
</style>
