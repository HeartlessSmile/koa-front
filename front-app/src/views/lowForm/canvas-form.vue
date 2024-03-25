<template>
  <div class="no-form-data" v-if="formList.length == 0">请从左侧列表中选择一个组件, 然后用鼠标拖动组件放置于此处.</div>
  <el-form :model="form" label-width="auto" class="form-widget-list">
    <!-- 画布 -->
    <draggable
      handle=".move-item"
      class="form-drag-list"
      ghostClass="form-ghost"
      :list="formList"
      group="form"
      @change="log"
      item-key="id"
    >
      <template #item="{ element }">
        <div>
          <formItem :element="element" @setItem="setItem" />
        </div>
      </template>
    </draggable>
  </el-form>
</template>
<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import formItem from './formItem.vue'
let idGlobal = 10
const formList = ref([])
const activeItem = ref(null)
const setItem = (item, type) => {
  console.log(item, type)
}

const log = (evt) => {
  // console.log(evt)
}
</script>
<style scoped lang="scss">
.no-form-data {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 18px;
  color: #999;
}
.form-widget-list {
  padding: 8px;
  border: 1px solid #e6e6e6;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .form-drag-list {
    width: 100%;
    min-height: 100%;
  }
}
.form-ghost {
  height: 1px;
  width: 100%;
  overflow: hidden;
  background: var(--el-color-primary);
  color: var(--el-color-primary);
}
.form-item {
  width: 100%;
  height: 32px;
  border: 1px solid #e6e6e6;
  margin-bottom: 8px;
}
</style>
