import { ref, watch, type Ref } from 'vue';

/**
 * Crea un ref reactivo sincronizado con localStorage.
 * Si no hay valor guardado, o si localStorage no está disponible
 * (modo incógnito estricto, cuota superada, etc.), usa `defaultValue`
 * sin romper la aplicación.
 */
export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const storedValue = readFromStorage(key, defaultValue);
  const state = ref<T>(storedValue) as Ref<T>;

  watch(
    state,
    (newValue) => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.warn(`No se pudo guardar "${key}" en localStorage:`, error);
      }
    },
    { deep: true }
  );

  return state;
}

function readFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return { ...defaultValue, ...JSON.parse(raw) };
  } catch (error) {
    console.warn(`No se pudo leer "${key}" de localStorage:`, error);
    return defaultValue;
  }
}