<script setup lang="ts">
import type { TrainerState } from '../types/trainer';

interface Props {
  activeSide: TrainerState;
}

defineProps<Props>();
</script>

<template>
  <div class="training-screen">
    <div
      class="panel panel--left"
      :class="{ 'panel--active': activeSide === 'left' || activeSide === 'both' }"
      aria-hidden="true"
    />
    <div
      class="panel panel--right"
      :class="{ 'panel--active': activeSide === 'right' || activeSide === 'both' }"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.training-screen {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.panel {
  flex: 1;
  background-color: #ffffff;
  transition: background-color 80ms ease-out;
}

.panel--active {
  background-color: #000000;
}
</style>