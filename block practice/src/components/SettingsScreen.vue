<script setup lang="ts">
import { computed, ref } from 'vue';
import type { TrainerConfig } from '../composables/useTrainer';

interface Props {
  config: TrainerConfig;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  save: [config: TrainerConfig];
  back: [];
}>();

const minDelaySeconds = ref(props.config.minDelay / 1000);
const maxDelaySeconds = ref(props.config.maxDelay / 1000);
const allowBothSides = ref(props.config.allowBothSides);

const isValid = computed(
  () =>
    minDelaySeconds.value > 0 &&
    maxDelaySeconds.value > 0 &&
    minDelaySeconds.value <= maxDelaySeconds.value
);

function handleSave(): void {
  if (!isValid.value) return;

  emit('save', {
    ...props.config,
    minDelay: Math.round(minDelaySeconds.value * 1000),
    maxDelay: Math.round(maxDelaySeconds.value * 1000),
    allowBothSides: allowBothSides.value,
  });
}
</script>

<template>
  <div class="settings-screen">
    <h2 class="settings-screen__title">Configuración</h2>

    <label class="settings-screen__field">
      Tiempo mínimo de espera (s)
      <input
        v-model.number="minDelaySeconds"
        type="number"
        min="0.1"
        step="0.1"
        class="settings-screen__input"
      />
    </label>

    <label class="settings-screen__field">
      Tiempo máximo de espera (s)
      <input
        v-model.number="maxDelaySeconds"
        type="number"
        min="0.1"
        step="0.1"
        class="settings-screen__input"
      />
    </label>

    <label class="settings-screen__checkbox">
      <input v-model="allowBothSides" type="checkbox" />
      Habilitar bloqueo central
    </label>

    <p v-if="!isValid" class="settings-screen__error">
      El tiempo mínimo debe ser mayor que 0 y no mayor que el máximo.
    </p>

    <div class="settings-screen__actions">
      <button type="button" class="settings-screen__button" @click="emit('back')">
        Volver
      </button>
      <button
        type="button"
        class="settings-screen__button settings-screen__button--primary"
        :disabled="!isValid"
        @click="handleSave"
      >
        Guardar
      </button>
    </div>
  </div>
</template>

<style scoped>
.settings-screen {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background-color: #f5f5f5;
  color: #111111;
  padding: 1rem;
}

.settings-screen__title {
  font-size: 1.25rem;
  font-weight: 600;
}

.settings-screen__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: min(280px, 80vw);
  font-size: 0.9rem;
}

.settings-screen__input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #cccccc;
  border-radius: 6px;
}

.settings-screen__checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: min(280px, 80vw);
  font-size: 0.9rem;
  cursor: pointer;
}

.settings-screen__error {
  color: #c0392b;
  font-size: 0.85rem;
  text-align: center;
  max-width: min(280px, 80vw);
}

.settings-screen__actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.settings-screen__button {
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: #e0e0e0;
  color: #111111;
}

.settings-screen__button--primary {
  background-color: #2c2c2c;
  color: #ffffff;
}

.settings-screen__button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>