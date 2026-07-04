import { onUnmounted, readonly, ref } from 'vue';
import type { Stimulus, TrainerState } from '../types/trainer';
import { useLocalStorage } from './useLocalStorage';

export interface TrainerConfig {
  minDelay: number;
  maxDelay: number;
  stimulusDuration: number;
  /** Si está activo, el estímulo puede marcar ambos paneles en negro a la vez */
  allowBothSides: boolean;
}

const DEFAULT_CONFIG: TrainerConfig = {
  minDelay: 1000,
  maxDelay: 3000,
  stimulusDuration: 600,
  allowBothSides: false,
};

const STORAGE_KEY = 'volley-block-trainer:config';

// Función pura: dado si "ambos lados" está permitido, decide el próximo estímulo.
// Se mantiene fuera de useTrainer porque no depende de ningún estado del composable.
function randomStimulus(allowBothSides: boolean): Stimulus {
  const options: Stimulus[] = allowBothSides ? ['left', 'right', 'both'] : ['left', 'right'];
  const index = Math.floor(Math.random() * options.length);
  return options[index];
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

    activeSide.value = randomStimulus(config.value.allowBothSides);

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