import test from 'node:test'; import assert from 'node:assert/strict'; import { createResourceApi } from '../src/resource-api.js';
const response=(body,ok=true,status=200)=>({ok,status,json:async()=>body});
test('loads published resources with same-origin credentials',async()=>{let init;const api=createResourceApi(async(_url,i)=>{init=i;return response({resources:[{id:'rec1'}]})});assert.deepEqual(await api.listPublished(),[{id:'rec1'}]);assert.equal(init.credentials,'same-origin')});
test('throws safe API messages without exposing server details',async()=>{const api=createResourceApi(async()=>response({error:'Upload failed safely'},false,503));await assert.rejects(()=>api.listPublished(),/Upload failed safely/)});
