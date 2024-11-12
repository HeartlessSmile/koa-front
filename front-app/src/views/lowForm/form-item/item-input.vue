<template>
  <!-- 显示form-item的操作项和拖拽 -->
  <div class="form-item-input">
    <div class="form-item-input-label">{{ element.label }}</div>
    <div class="form-item-input-value"></div>
    <div class="form-item-input-icon"></div>
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
</style>
