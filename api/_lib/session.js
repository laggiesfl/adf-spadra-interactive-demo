import { createHmac, timingSafeEqual, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt=promisify(scryptCallback); const MAX_AGE=6*60*60;
const b64=value=>Buffer.from(value).toString('base64url');

function sign(payload,secret){return createHmac('sha256',secret).update(payload).digest('base64url');}
export async function createSessionCookie(identity,secret,now=Date.now){
  if(String(secret||'').length<32) throw new Error('Session configuration unavailable.');
  const payload=b64(JSON.stringify({...identity,exp:Math.floor(now()/1000)+MAX_AGE}));
  return `staff_session=${payload}.${sign(payload,secret)}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Strict`;
}
export async function verifySessionCookie(value,secret,now=Date.now){
  try{const [payload,signature]=String(value||'').split('.'); if(!payload||!signature||String(secret||'').length<32)return null;
    const expected=sign(payload,secret); if(signature.length!==expected.length||!timingSafeEqual(Buffer.from(signature),Buffer.from(expected)))return null;
    const data=JSON.parse(Buffer.from(payload,'base64url').toString()); return data.exp>Math.floor(now()/1000)?data:null;
  }catch{return null;}
}
export async function passwordMatches(password,stored){
  try{const [saltHex,hashHex]=String(stored||'').split(':'); const expected=Buffer.from(hashHex,'hex'); if(!saltHex||expected.length!==64)return false;
    const actual=await scrypt(String(password),Buffer.from(saltHex,'hex'),64); return timingSafeEqual(actual,expected);
  }catch{return false;}
}
export function readSessionCookie(req){return String(req.headers?.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('staff_session='))?.slice(14)||'';}
export const clearSessionCookie='staff_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict';
