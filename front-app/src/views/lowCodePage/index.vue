<template>
  <el-container class="layout-container">
    <el-header class="layout-header">
      <el-button @click="goBack">返回</el-button>
    </el-header>
    <el-container>
      <el-aside class="layout-aside"> 物料区 </el-aside>
      <div class="canvas-layout">
        <!-- 上，左尺子 -->
        <TickLeft />
        <TickTop />
        <!-- 画布 -->
        <div class="canvas-box">
          <!-- 画布内容 -->
          <div class="canvas-content"></div>
          <!-- 画布网格 -->
          <div class="canvas-grid"></div>
        </div>
        <!-- 参考线 -->
        <div class="refer-box"></div>
      </div>
    </el-container>
  </el-container>
</template>
<script setup>
import TickLeft from './components/tickLeft.vue'
import TickTop from './components/tickTop.vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const goBack = () => {
  router.back()
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
  }
  .canvas-layout {
    flex: 1 1;
    height: 100vh;
    overflow: hidden;
    position: relative;
  }
}
</style>
