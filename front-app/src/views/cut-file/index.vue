<template>
  <h1>文件切割</h1>
  <el-button @click="handelClick">选择文件</el-button>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { sliceFile,uploadChunks } from './base'
onMounted(() => {})

const handelClick = () => {
  const file = document.createElement('input')
  file.type = 'file'
  file.click()
  file.onchange = (e) => {
    console.log(e.target.files[0])
    sliceFile(e.target.files[0], 1024 * 2).then((res) => {
      uploadChunks(res)
    })
  }
}
</script>

<style lang="scss" scoped></style>
