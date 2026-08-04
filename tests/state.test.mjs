import test from 'node:test';
import assert from 'node:assert/strict';
import { createStore, DEFAULT_STATE } from '../src/state.js';

function memoryStorage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key)
  };
}

test('new store starts with an independent default state', () => {
  const store = createStore(memoryStorage());
  assert.deepEqual(store.getState(), DEFAULT_STATE);
  assert.notEqual(store.getState(), DEFAULT_STATE);
});

test('update persists only known top-level state fields', () => {
  const storage = memoryStorage();
  const store = createStore(storage);
  store.update({ lowBandwidth: true, language: 'fr', secret: 'ignore' });
  const reloaded = createStore(storage);
  assert.equal(reloaded.getState().lowBandwidth, true);
  assert.equal(reloaded.getState().language, 'fr');
  assert.equal('secret' in reloaded.getState(), false);
});

test('subscribers receive a cloned state after an update', () => {
  const store = createStore(memoryStorage());
  let observed;
  const unsubscribe = store.subscribe(state => { observed = state; });
  store.update({ highContrast: true });
  unsubscribe();
  assert.equal(observed.highContrast, true);
  assert.notEqual(observed, store.getState());
});

test('malformed stored JSON falls back to defaults', () => {
  const store = createStore(memoryStorage({ 'spadra-demo-state-v1': '{bad' }));
  assert.deepEqual(store.getState(), DEFAULT_STATE);
});

test('reset restores a safe known state and persists it', () => {
  const storage = memoryStorage();
  const store = createStore(storage);
  store.update({ lowBandwidth: true, language: 'fr', edits: [{ id: 'demo' }] });
  store.reset();
  assert.deepEqual(store.getState(), DEFAULT_STATE);
  assert.deepEqual(createStore(storage).getState(), DEFAULT_STATE);
});
