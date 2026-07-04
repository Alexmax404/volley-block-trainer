<script setup lang="ts">
const emit = defineEmits<{
  start: [];
  openSettings: [];
}>();
</script>

<template>
  <div class="main-menu">
    <h1 class="main-menu__title">Entrenamiento de Bloqueo</h1>
    <div class="main-menu__actions">
      <button
        type="button"
        class="main-menu__button main-menu__button--primary"
        @click="emit('start')"
      >
        Iniciar
      </button>
      <button type="button" class="main-menu__button" @click="emit('openSettings')">
        Configuración
      </button>
    </div>
  </div>
</template>

<style scoped>
.main-menu {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  background-color: #f5f5f5;
  color: #111111;
}

.main-menu__title {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  padding: 0 1rem;
}

.main-menu__actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: min(280px, 80vw);
}

.main-menu__button {
  padding: 0.9rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: #e0e0e0;
  color: #111111;
}

.main-menu__button--primary {
  background-color: #2c2c2c;
  color: #ffffff;
}
</style>