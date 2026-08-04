const safeError=()=>new Error('Resource service is temporarily unavailable.');
export function createAirtable(env=process.env,fetchImpl=fetch){
  const {AIRTABLE_TOKEN:token,AIRTABLE_BASE_ID:base,AIRTABLE_TABLE_ID:table,AIRTABLE_ATTACHMENT_FIELD_ID:attachment}=env;
  if(!token||!base||!table) throw new Error('Resource service is not configured.');
  const headers={Authorization:`Bearer ${token}`,'Content-Type':'application/json'};
  const root=`https://api.airtable.com/v0/${encodeURIComponent(base)}/${encodeURIComponent(table)}`;
  async function request(url,init={}){let res;try{res=await fetchImpl(url,{...init,headers:{...headers,...init.headers},signal:AbortSignal.timeout(9000)})}catch{throw safeError()}if(!res.ok)throw safeError();return res.json()}
  async function list(formula){let records=[],offset;do{const q=new URLSearchParams({pageSize:'100',filterByFormula:formula});if(offset)q.set('offset',offset);const data=await request(`${root}?${q}`);records.push(...(data.records||[]));offset=data.offset}while(offset);return records}
  return {
    listPublished:()=>list("{Publication status}='Published'"),
    listAll:()=>list("OR({Publication status}='Published',{Publication status}='Draft')"),
    get:id=>request(`${root}/${encodeURIComponent(id)}`),
    create:fields=>request(root,{method:'POST',body:JSON.stringify({fields})}),
    update:(id,fields)=>request(`${root}/${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify({fields})}),
    delete:id=>request(`${root}/${encodeURIComponent(id)}`,{method:'DELETE'}),
    uploadAttachment:(id,file)=>{if(!attachment)throw new Error('Resource service is not configured.');return request(`https://content.airtable.com/v0/${encodeURIComponent(base)}/${encodeURIComponent(id)}/${encodeURIComponent(attachment)}/uploadAttachment`,{method:'POST',body:JSON.stringify({contentType:file.type,filename:file.name,file:file.buffer.toString('base64')})})}
  };
}
