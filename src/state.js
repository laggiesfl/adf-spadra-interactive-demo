const STORAGE_KEY = 'spadra-demo-state-v1';

export const DEFAULT_STATE = Object.freeze({
  language: 'en',
  lowBandwidth: false,
  highContrast: false,
  reducedMotion: false,
  textScale: 1,
  walkthroughStep: 0,
  learning: { completedLessons: [], quizAnswer: null },
  edits: []
});

const clone = value => JSON.parse(JSON.stringify(value));

function safeState(value) {
  const next = clone(DEFAULT_STATE);
  if (!value || typeof value !== 'object' || Array.isArray(value)) return next;
  for (const key of Object.keys(DEFAULT_STATE)) {
    if (Object.hasOwn(value, key)) next[key] = clone(value[key]);
  }
  return next;
}

export function createStore(storage = globalThis.localStorage) {
  let current;
  const listeners = new Set();
  try {
    current = safeState(JSON.parse(storage.getItem(STORAGE_KEY) || 'null'));
  } catch {
    current = clone(DEFAULT_STATE);
  }

  const persist = () => storage.setItem(STORAGE_KEY, JSON.stringify(current));
  const notify = () => listeners.forEach(listener => listener(clone(current)));

  return {
    getState: () => clone(current),
    update(patch) {
      current = safeState({ ...current, ...patch });
      persist();
      notify();
    },
    reset() {
      current = clone(DEFAULT_STATE);
      persist();
      notify();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}
