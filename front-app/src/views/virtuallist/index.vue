<template>
  <div class="ma-header">
    <span style="margin-right: 10px">虚拟滚动</span>
    <!-- <el-button>添加节点</el-button>
    <el-button type="primary">保存数据</el-button> -->
  </div>
  <div class="ma-content" id="scrollBox">
    <list />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import list from './virtuallist.vue'
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
