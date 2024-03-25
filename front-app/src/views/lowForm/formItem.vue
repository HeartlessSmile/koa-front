<template>
  <!-- 显示form-item的操作项和拖拽 -->
  <div class="item-box">
    <div class="handle-item move-item">{{ element.name }}</div>
    <div class="form-item">{{}}</div>
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
</script>
<style scoped lang="scss">
.item-box {
  width: 100%;
  position: relative;
  .move-item {
    height: 16px;
    width: 80px;
    font-size: 12px;
    position: absolute;
    left: 0px;
    top: 0px;
    background: var(--el-color-primary);
    color: #fff;
    text-align: center;
    cursor: move;
  }
}
.form-item {
  height: 32px;
  border: 1px solid #e6e6e6;
  margin-bottom: 8px;
}
</style>
