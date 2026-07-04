<script setup lang="ts">
interface Props {
  isRunning: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  start: [];
  stop: [];
}>();
</script>

<template>
  <div class="control-panel">
    <button
      type="button"
      class="control-panel__button"
      :disabled="isRunning"
      @click="emit('start')"
    >
      Iniciar
    </button>
    <button
      type="button"
      class="control-panel__button"
      :disabled="!isRunning"
      @click="emit('stop')"
    >
      Detener
    </button>
  </div>
</template>

<style scoped>
.control-panel {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
  z-index: 10;
}

.control-panel__button {
  padding: 0.6rem 1.4rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: #2c2c2c;
  color: white;
}

.control-panel__button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>