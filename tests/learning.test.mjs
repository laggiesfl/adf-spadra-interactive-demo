import test from 'node:test';
import assert from 'node:assert/strict';
import { gradeKnowledgeCheck } from '../src/learning.js';

test('knowledge check identifies the accountable action', () => {
  assert.deepEqual(gradeKnowledgeCheck('document-owner-date'), { correct: true, messageKey: 'quiz.correct' });
});

test('knowledge check allows retry after an incorrect answer', () => {
  assert.deepEqual(gradeKnowledgeCheck('publish-only'), { correct: false, messageKey: 'quiz.retry' });
});
