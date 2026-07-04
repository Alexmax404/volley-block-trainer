import { onUnmounted, readonly, ref } from 'vue';
import type { Side, TrainerState } from '../types/trainer';

export interface TrainerConfig {
  /** Tiempo mínimo en estado neutro antes del siguiente estímulo (ms) */
  minDelay: number;
  /** Tiempo máximo en estado neutro antes del siguiente estímulo (ms) */
  maxDelay: number;
  /** Duración del estímulo activo (ms) */
  stimulusDuration: number;
}

const DEFAULT_CONFIG: TrainerConfig = {
  minDelay: 1000,
  maxDelay: 3000,
  stimulusDuration: 600,
};

export function useTrainer(initialConfig: Partial<TrainerConfig> = {}) {
  const config = ref<TrainerConfig>({ ...DEFAULT_CONFIG, ...initialConfig });

  const isRunning = ref(false);
  const activeSide = ref<TrainerState>(null);

  let timeoutId: number | undefined;

  function clearScheduledTimeout(): void {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  }

  function randomSide(): Side {
    return Math.random() < 0.5 ? 'left' : 'right';
  }

  function randomDelay(): number {
    const { minDelay, maxDelay } = config.value;
    return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  }

  function scheduleNextStimulus(): void {
    if (!isRunning.value) return;
    timeoutId = window.setTimeout(triggerStimulus, randomDelay());
  }

  function triggerStimulus(): void {
    if (!isRunning.value) return;

    activeSide.value = randomSide();

    timeoutId = window.setTimeout(() => {
      activeSide.value = null; // vuelve a neutro antes de programar el siguiente
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
