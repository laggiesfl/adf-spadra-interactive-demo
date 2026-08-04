import test from 'node:test';
import assert from 'node:assert/strict';
import { WALKTHROUGH_STEPS, boundedStep } from '../src/walkthrough.js';

test('walkthrough provides seven ordered interview steps', () => assert.equal(WALKTHROUGH_STEPS.length, 7));
test('walkthrough step stays within available steps', () => {
  assert.equal(boundedStep(-1), 0);
  assert.equal(boundedStep(99), 6);
});
