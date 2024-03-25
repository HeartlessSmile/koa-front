<template>
  <div class="top-tick-container" ref="tickRef">
    <div class="top-tick" :style="{ width: width + 'px' }">
      <div
        :class="['calibration-line', index % 10 == 0 ? 'calibration-line-long' : '']"
        v-for="(item, index) in width / 5"
      >
        <span v-if="index % 10 == 0">{{ index * 5 }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits, onMounted, ref } from 'vue'
const tickRef = ref(null)
const width = ref(1000)

onMounted(() => {
  width.value = Math.floor(tickRef.value.parentElement.clientWidth / 5) * 10
})
</script>
<style scoped lang="scss">
.top-tick-container {
  width: calc(100% - 50px);
  height: 50px;
  position: absolute;
  top: 0px;
  left: 0px;
  margin-left: 50px;
  .top-tick {
    display: flex;
    justify-content: space-between;
  }
  .calibration-line {
    width: 1px;
    height: 6px;
    background: rgb(204, 204, 204);
  }
  .calibration-line-long {
    height: 12px;
    > span {
      transform: translate3d(-4px, 16px, 0px) scale(1.1);
      display: block;
      font-size: 12px;
      color: #888;
    }
  }
}
</style>
