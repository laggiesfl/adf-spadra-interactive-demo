import test from 'node:test'; import assert from 'node:assert/strict';
import { createSessionCookie, verifySessionCookie, passwordMatches } from '../api/_lib/session.js';

test('creates a signed secure cookie and verifies its identity', async()=>{
  const cookie=await createSessionCookie({email:'fadila@example.com',name:'Fadila Lagadien — BeAccessible'},'a'.repeat(32),()=>1_000_000);
  assert.match(cookie,/HttpOnly; Secure; SameSite=Strict/);
  const value=cookie.match(/staff_session=([^;]+)/)[1];
  assert.equal((await verifySessionCookie(value,'a'.repeat(32),()=>1_000_100)).name,'Fadila Lagadien — BeAccessible');
});
test('rejects tampered and expired sessions', async()=>{
  const cookie=await createSessionCookie({email:'fadila@example.com',name:'Fadila'},'b'.repeat(32),()=>1_000_000);
  const value=cookie.match(/staff_session=([^;]+)/)[1];
  assert.equal(await verifySessionCookie(value+'x','b'.repeat(32),()=>1_000_100),null);
  assert.equal(await verifySessionCookie(value,'b'.repeat(32),()=>1_000_000+8*60*60*1000),null);
});
test('verifies scrypt password hashes without storing plain text', async()=>{
  const crypto=await import('node:crypto');
  const salt='00112233445566778899aabbccddeeff';
  const hash=crypto.scryptSync('correct horse',Buffer.from(salt,'hex'),64).toString('hex');
  assert.equal(await passwordMatches('correct horse',`${salt}:${hash}`),true);
  assert.equal(await passwordMatches('wrong',`${salt}:${hash}`),false);
});
