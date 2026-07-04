<script setup lang="ts">
import { ref } from 'vue';
import TrainingScreen from './components/TrainingScreen.vue';
import ControlPanel from './components/ControlPanel.vue';
import RotateDeviceOverlay from './components/RotateDeviceOverlay.vue';
import MainMenu from './components/MainMenu.vue';
import SettingsScreen from './components/SettingsScreen.vue';
import { useTrainer, type TrainerConfig } from './composables/useTrainer';
import { useFullscreen } from './composables/useFullscreen';
import type { AppView } from './types/view';

const trainer = useTrainer();
const fullscreen = useFullscreen();

const view = ref<AppView>('menu');

async function handleStartFromMenu() {
  view.value = 'training';
  await fullscreen.enter();
  trainer.start();
}

function handleOpenSettings() {
  view.value = 'settings';
}

function handleBackToMenu() {
  view.value = 'menu';
}

function handleSaveSettings(newConfig: TrainerConfig) {
  trainer.updateConfig(newConfig);
  view.value = 'menu';
}

async function handleStopTraining() {
  trainer.stop();
  await fullscreen.exit();
  view.value = 'menu';
}
</script>

<template>
  <main class="app">
    <MainMenu
      v-if="view === 'menu'"
      @start="handleStartFromMenu"
      @open-settings="handleOpenSettings"
    />

    <SettingsScreen
      v-else-if="view === 'settings'"
      :config="trainer.config.value"
      @save="handleSaveSettings"
      @back="handleBackToMenu"
    />

    <template v-else-if="view === 'training'">
      <TrainingScreen :active-side="trainer.activeSide.value" />
      <ControlPanel :is-running="trainer.isRunning.value" @start="trainer.start" @stop="handleStopTraining" />
    </template>

    <RotateDeviceOverlay />
  </main>
</template>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
  position: relative;
}
</style>