<script setup lang="ts">
const props = defineProps(['timer'])
</script>

<template>
  <div>
    <span>{{ props.timer.days }}</span>:<span>{{ props.timer.hours }}</span>:<span>{{ props.timer.minutes }}</span>:<span>{{ props.timer.seconds }}</span>
  </div>
</template>
