import { clearSessionCookie } from '../_lib/session.js'; import { json,method } from '../_lib/http.js';
export default async function handler(req,res){if(!method(req,res,['POST']))return;res.setHeader('Set-Cookie',clearSessionCookie);return json(res,200,{authenticated:false});}
