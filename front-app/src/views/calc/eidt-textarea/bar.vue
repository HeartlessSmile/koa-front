<template>
  <div class="edit_textarea_bar"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({
  list: {
    type: String,
    default: () => [],
  },
})
const { list } = props
onMounted(() => {})

onBeforeUnmount(() => {})
</script>

<style lang="scss"></style>
