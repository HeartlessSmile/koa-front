<template>
  <div class="smile-container">
    1111
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps({
  contentId: {
    type: String,
    default: 'contentId',
  },
  defaultValue: {
    type: String,
    default: '',
  },
  modelValue: {
    type: String,
    default: '',
  },
})
// 生命周期钩子
onMounted(() => {})
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
}
.ma-header {
  height: 40px;
  display: flex;
}
.ma-content {
  height: calc(100% - 40px);
}
</style>
