import Busboy from 'busboy';
export function parseUpload(req){return new Promise((resolve,reject)=>{const fields={};let file=null;let failed=false;let parser;try{parser=Busboy({headers:req.headers,limits:{files:1,fileSize:4_000_000,fields:10,fieldSize:20_000}})}catch{return reject(new Error('Invalid upload request.'))}
  parser.on('field',(name,value)=>{fields[name]=value});
  parser.on('file',(_name,stream,info)=>{const chunks=[];let size=0;stream.on('data',chunk=>{size+=chunk.length;chunks.push(chunk)});stream.on('limit',()=>{failed=true});stream.on('end',()=>{file={name:info.filename,type:info.mimeType,size,buffer:Buffer.concat(chunks)}})});
  parser.on('filesLimit',()=>{failed=true}); parser.on('fieldsLimit',()=>{failed=true}); parser.on('error',reject); parser.on('finish',()=>{if(failed||!file)return reject(new Error('Invalid or oversized upload.'));resolve({fields,file})}); req.pipe(parser);
})}
