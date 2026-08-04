import test from 'node:test'; import assert from 'node:assert/strict'; import { shouldShowBackToTop, scrollBehaviour } from '../src/back-to-top.js';
test('shows back to top only after meaningful scrolling',()=>{assert.equal(shouldShowBackToTop(399),false);assert.equal(shouldShowBackToTop(400),true)});
test('uses instant movement when reduced motion is requested',()=>{assert.equal(scrollBehaviour(true),'auto');assert.equal(scrollBehaviour(false),'smooth')});
