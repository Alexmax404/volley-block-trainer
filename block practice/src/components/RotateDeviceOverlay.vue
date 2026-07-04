<template>
  <div class="rotate-overlay" role="alert">
    <p class="rotate-overlay__icon">🔄</p>
    <p class="rotate-overlay__title">Gira el dispositivo</p>
    <p class="rotate-overlay__hint">Esta aplicación funciona en horizontal</p>
  </div>
</template>

<style scoped>
.rotate-overlay {
  display: none;
}

@media (orientation: portrait) {
  .rotate-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background-color: #111111;
    color: #ffffff;
    text-align: center;
    padding: 1rem;
  }
}

.rotate-overlay__icon {
  font-size: 2.5rem;
}

.rotate-overlay__title {
  font-size: 1.25rem;
  font-weight: 600;
}

.rotate-overlay__hint {
  font-size: 0.9rem;
  opacity: 0.7;
}
</style>