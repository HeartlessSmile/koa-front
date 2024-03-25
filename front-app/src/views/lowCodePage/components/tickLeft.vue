<template>
  <div class="left-tick-container" ref="tickRef">
    <div class="left-tick" :style="{ height: height + 'px' }">
      <div
        :class="['calibration-line', index % 10 == 0 ? 'calibration-line-long' : '']"
        v-for="(item, index) in height / 5"
      >
        <span v-if="index % 10 == 0">{{ index * 5 }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits, onMounted, ref } from 'vue'
const tickRef = ref(null)
const height = ref(1000)

onMounted(() => {
  height.value = Math.floor(tickRef.value.parentElement.clientHeight / 5) * 10
})
</script>
<style scoped lang="scss">
.left-tick-container {
  height: calc(100% - 50px);
  width: 50px;
  position: absolute;
  top: 0px;
  left: 0px;
  margin-top: 50px;
  .left-tick {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  .calibration-line {
    height: 1px;
    width: 6px;
    background: rgb(204, 204, 204);
  }
  .calibration-line-long {
    width: 12px;
    > span {
      padding-left: 20px;
      display: block;
      transform: translate3d(-4px, -8px, 0px) scale(1.1);
      font-size: 12px;
      color: #888;
    }
  }
}
</style>
