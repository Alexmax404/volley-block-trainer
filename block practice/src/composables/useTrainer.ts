import { onUnmounted, readonly, ref } from 'vue';
import type { Side, TrainerState } from '../types/trainer';
import { useLocalStorage } from './useLocalStorage';

export interface TrainerConfig {
  minDelay: number;
  maxDelay: number;
  stimulusDuration: number;
}

const DEFAULT_CONFIG: TrainerConfig = {
  minDelay: 1000,
  maxDelay: 3000,
  stimulusDuration: 600,
};

const STORAGE_KEY = 'volley-block-trainer:config';

// Función pura, no depende de ningún estado del composable:
// se define en el ámbito del módulo para no recrearla en cada llamada a useTrainer().
function randomSide(): Side {
  return Math.random() < 0.5 ? 'left' : 'right';
}

export function useTrainer(initialConfig: Partial<TrainerConfig> = {}) {
  const config = useLocalStorage<TrainerConfig>(STORAGE_KEY, {
    ...DEFAULT_CONFIG,
    ...initialConfig,
  });

  const isRunning = ref(false);
  const activeSide = ref<TrainerState>(null);

  let timeoutId: number | undefined;

  function clearScheduledTimeout(): void {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  }

  function randomDelay(): number {
    const { minDelay, maxDelay } = config.value;
    return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  }

  function scheduleNextStimulus(): void {
    if (!isRunning.value) return;
    timeoutId = globalThis.setTimeout(triggerStimulus, randomDelay());
  }

  function triggerStimulus(): void {
    if (!isRunning.value) return;

    activeSide.value = randomSide();

    timeoutId = globalThis.setTimeout(() => {
      activeSide.value = null;
      scheduleNextStimulus();
    }, config.value.stimulusDuration);
  }

  function start(): void {
    if (isRunning.value) return;
    isRunning.value = true;
    activeSide.value = null;
    scheduleNextStimulus();
  }

  function stop(): void {
    isRunning.value = false;
    activeSide.value = null;
    clearScheduledTimeout();
  }

  function updateConfig(newConfig: Partial<TrainerConfig>): void {
    config.value = { ...config.value, ...newConfig };
  }

  onUnmounted(() => {
    stop();
  });

  return {
    isRunning: readonly(isRunning),
    activeSide: readonly(activeSide),
    config: readonly(config),
    start,
    stop,
    updateConfig,
  };
}