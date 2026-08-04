import { createSessionCookie,passwordMatches } from '../_lib/session.js'; import { json,method } from '../_lib/http.js';
export default async function handler(req,res,deps={}){if(!method(req,res,['POST']))return;const env=deps.env||process.env;const email=String(req.body?.email||'').trim().toLowerCase();const password=String(req.body?.password||'');
  const passwordOk=await passwordMatches(password,env.STAFF_PASSWORD_HASH);const emailOk=email===String(env.STAFF_EMAIL||'').trim().toLowerCase();
  if(!emailOk||!passwordOk)return json(res,401,{error:'Sign-in details were not recognised.'});
  const user={name:'Fadila Lagadien — BeAccessible',email:String(env.STAFF_EMAIL).trim().toLowerCase()};res.setHeader('Set-Cookie',await createSessionCookie(user,env.SESSION_SECRET));return json(res,200,{user});}
