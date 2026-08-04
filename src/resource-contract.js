const MAX_UPLOAD = 4 * 1000 * 1000;
const TYPES = new Map([
  ['pdf','application/pdf'],
  ['docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ['txt','text/plain']
]);

export function validateResourceMetadata(values={}) {
  const errors={};
  if (String(values.title||'').trim().length < 3) errors.title='Enter a title of at least 3 characters.';
  if (String(values.summary||'').trim().length < 20) errors.summary='Enter a summary of at least 20 characters.';
  if (!String(values.country||'').trim()) errors.country='Choose a country.';
  if (!String(values.topic||'').trim()) errors.topic='Enter a topic.';
  if (!String(values.language||'').trim()) errors.language='Choose a language.';
  if (String(values.accessibility||'').trim().length < 3) errors.accessibility='Describe the file accessibility or known limitations.';
  return {valid:Object.keys(errors).length===0,errors};
}

export function validateUploadDescriptor(file={}) {
  const ext=String(file.name||'').split('.').pop().toLowerCase();
  let error='';
  if (!TYPES.has(ext) || TYPES.get(ext)!==file.type) error='Upload a PDF, DOCX or plain-text file with a matching file type.';
  else if (!Number.isFinite(file.size) || file.size<=0) error='Choose a non-empty file.';
  else if (file.size>MAX_UPLOAD) error='The file must be 4 MB or smaller.';
  return {valid:!error,error};
}

export function mapAirtableRecord(record) {
  const f=record?.fields||{}; const a=Array.isArray(f.Attachment)?f.Attachment[0]:null;
  const date=f['Updated at']?new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(f['Updated at'])):'';
  return {id:record.id,title:f.Title||'',summary:f.Summary||'',country:f.Country||'All countries',topic:f.Topic||'Resource',language:f.Language||'English',format:(a?.filename?.split('.').pop()||'File').toUpperCase(),accessibility:f['Accessibility notes']||'Accessibility information not supplied.',fileName:a?.filename||'',fileSize:a?.size||0,downloadUrl:`/api/resources/${encodeURIComponent(record.id)}/download`,publicationStatus:f['Publication status']||'Draft',updated:date,demonstration:true,persistent:true};
}

export function mergeResources(bundled=[],live=[]) {
  const ids=new Set(live.map(x=>x.id)); return [...live,...bundled.filter(x=>!ids.has(x.id))];
}
