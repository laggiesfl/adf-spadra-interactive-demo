import test from 'node:test';
import assert from 'node:assert/strict';
import { validateResourceMetadata, validateUploadDescriptor, mapAirtableRecord, mergeResources } from '../src/resource-contract.js';

test('rejects missing required resource metadata', () => {
  const result = validateResourceMetadata({ title:'', summary:'short', country:'North Coast Region', topic:'Policy', language:'English', accessibility:'' });
  assert.equal(result.valid, false);
  assert.deepEqual(Object.keys(result.errors).sort(), ['accessibility','summary','title']);
});

test('accepts PDF DOCX and text files up to 4 MB', () => {
  for (const file of [
    {name:'guide.pdf',type:'application/pdf',size:1024},
    {name:'guide.docx',type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',size:1024},
    {name:'guide.txt',type:'text/plain',size:4_000_000}
  ]) assert.equal(validateUploadDescriptor(file).valid,true);
});

test('rejects executable, mismatched and oversized uploads', () => {
  assert.equal(validateUploadDescriptor({name:'bad.html',type:'text/html',size:2}).valid,false);
  assert.equal(validateUploadDescriptor({name:'bad.pdf',type:'text/plain',size:2}).valid,false);
  assert.equal(validateUploadDescriptor({name:'large.pdf',type:'application/pdf',size:4_000_001}).valid,false);
});

test('maps only safe published Airtable fields', () => {
  const mapped=mapAirtableRecord({id:'rec123',fields:{Title:'Guide',Summary:'Accessible summary for everyone.',Country:'North Coast Region',Topic:'Policy',Language:'English','Accessibility notes':'Tagged PDF',Attachment:[{id:'att1',filename:'guide.pdf',type:'application/pdf',size:1200,url:'https://airtable.example/private'}],'Publication status':'Published','Updated at':'2026-08-04T12:00:00Z',Secret:'never'}});
  assert.deepEqual(mapped,{id:'rec123',title:'Guide',summary:'Accessible summary for everyone.',country:'North Coast Region',topic:'Policy',language:'English',format:'PDF',accessibility:'Tagged PDF',fileName:'guide.pdf',fileSize:1200,downloadUrl:'/api/resources/rec123/download',publicationStatus:'Published',updated:'4 Aug 2026',demonstration:true,persistent:true});
  assert.equal('Secret' in mapped,false);
});

test('merges live records without losing bundled fallback resources', () => {
  assert.deepEqual(mergeResources([{id:'r1',title:'Bundled'}],[{id:'rec1',title:'Live'}]).map(x=>x.id),['rec1','r1']);
});
