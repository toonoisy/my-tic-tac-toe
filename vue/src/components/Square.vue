<script setup>
defineProps({
  value: String,
});
</script>

<template>
  <button class="square">
    {{ value }}
  </button>
</template>

<style scoped>
</style>