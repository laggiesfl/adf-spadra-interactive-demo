export function json(res,status,body){res.setHeader('Cache-Control','no-store');return res.status(status).json(body)}
export function method(req,res,allowed){if(!allowed.includes(req.method)){res.setHeader('Allow',allowed.join(', '));json(res,405,{error:'Method not allowed.'});return false}return true}
