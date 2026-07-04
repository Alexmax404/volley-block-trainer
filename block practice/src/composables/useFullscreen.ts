import { ref, onMounted, onUnmounted } from 'vue';

export function useFullscreen() {
  const isFullscreen = ref(false);

  function updateState(): void {
    isFullscreen.value = document.fullscreenElement !== null;
  }

  async function enter(element: HTMLElement = document.documentElement): Promise<void> {
    try {
      if (!document.fullscreenElement) {
        await element.requestFullscreen();
      }
      // Best-effort: no todos los navegadores lo soportan (ej. iOS Safari)
      await screen.orientation?.lock?.('landscape').catch(() => undefined);
    } catch (error) {
      console.warn('No se pudo activar pantalla completa:', error);
    }
  }

  async function exit(): Promise<void> {
    try {
      screen.orientation?.unlock?.();
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn('No se pudo salir de pantalla completa:', error);
    }
  }

  onMounted(() => {
    document.addEventListener('fullscreenchange', updateState);
  });

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', updateState);
  });

  return {
    isFullscreen,
    enter,
    exit,
  };
}