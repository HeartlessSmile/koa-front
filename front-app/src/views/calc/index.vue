<template>
  <div>
    <p>自动解析数据渲染</p>
    <p>支持@或者$选择</p>
    <p>支持删除</p>
    <p>支持自动检测</p>
  </div>
  <div>
    <EditTextArea ref="editor" v-model="text" v-modal:textArr="textArr" />
    <!-- <EditTextArea  v-model="text1" contentId="isk"  /> -->
  </div>
</template>

<script setup>
import EditTextArea from './eidt-textarea/index.vue'
import { ref, onMounted } from 'vue'
const text = ref(`<div>123
  <span><tag class="custom-tag">if</tag>(<tag class="custom-tag primary">@A</tag>,<tag class="custom-tag primary">@B</tag>,<tag class="custom-tag primary">@C</tag>)<span></div>`)
const text1 = ref('9876')
const editor = ref(null)

onMounted(() => {
  // 获取编辑器内容
  // setTimeout(() => {
  //   text.value = '000000000'
  // }, 1000)
})
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
}
</style>
