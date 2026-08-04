import test from 'node:test'; import assert from 'node:assert/strict'; import { randomBytes,scryptSync } from 'node:crypto';
import login from '../api/staff/login.js'; import session from '../api/staff/session.js'; import logout from '../api/staff/logout.js';

function response(){return {statusCode:200,headers:{},body:null,setHeader(k,v){this.headers[k]=v},status(n){this.statusCode=n;return this},json(v){this.body=v;return this},end(){return this}}}
const salt=randomBytes(16); const passwordHash=`${salt.toString('hex')}:${scryptSync('demo-pass',salt,64).toString('hex')}`;
const env={STAFF_EMAIL:'fadila@example.com',STAFF_PASSWORD_HASH:passwordHash,SESSION_SECRET:'s'.repeat(40)};

test('login returns safe Fadila identity and secure cookie',async()=>{const res=response();await login({method:'POST',body:{email:'FADILA@example.com',password:'demo-pass'}},res,{env});assert.equal(res.statusCode,200);assert.deepEqual(res.body.user,{name:'Fadila Lagadien — BeAccessible',email:'fadila@example.com'});assert.match(res.headers['Set-Cookie'],/HttpOnly/)});
test('login failure is generic',async()=>{const res=response();await login({method:'POST',body:{email:'other@example.com',password:'wrong'}},res,{env});assert.equal(res.statusCode,401);assert.equal(res.body.error,'Sign-in details were not recognised.');});
test('session and logout use the signed cookie',async()=>{const signed=response();await login({method:'POST',body:{email:'fadila@example.com',password:'demo-pass'}},signed,{env});const cookie=signed.headers['Set-Cookie'].split(';')[0];const check=response();await session({method:'GET',headers:{cookie}},check,{env});assert.equal(check.body.authenticated,true);const out=response();await logout({method:'POST'},out);assert.match(out.headers['Set-Cookie'],/Max-Age=0/);});
