import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

test('Adonis: CRUD persistente e comportamentos intencionais', async () => {
 const dir=await mkdtemp(join(tmpdir(),'atlas-qa-'))
 const port=String(18000+Math.floor(Math.random()*10000))
 const env={...process.env,NODE_ENV:'test',HOST:'127.0.0.1',PORT:port,QA_DB:join(dir,'data.sqlite3')}
 let child:ReturnType<typeof spawn>;let output=''
 const launch=()=>{const p=spawn(process.execPath,['--import','tsx','bin/server.ts'],{env,stdio:['ignore','pipe','pipe']});p.stdout!.on('data',c=>output+=c);p.stderr!.on('data',c=>output+=c);return p}
 const base=`http://127.0.0.1:${port}`
 const wait=async()=>{for(let i=0;i<60;i++){try{if((await fetch(base)).ok)return}catch{}if(child.exitCode!==null)throw new Error(output);await delay(100)}throw new Error('Servidor não iniciou: '+output)}
 const req=async(path:string,method='GET',body?:object)=>{const r=await fetch(base+path,{method,headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json() as any}}
 const stop=async()=>{if(child.exitCode!==null)return;await new Promise<void>(resolve=>{child.once('exit',()=>resolve());child.kill('SIGTERM')})}
 try {
 child=launch();await wait()
 for(const path of ['/','/app.js','/style.css'])assert.equal((await fetch(base+path)).status,200)
 let r=await req('/api/customers');assert.equal(r.data.total,18);assert.equal(r.data.items.length,5)
 const body={name:'Teste CRUD',email:'teste@example.com',cpf:'123',phone:'81',cep:'',birth:'',credit:'125,50',status:'Ativo'}
 r=await req('/api/customers','POST',body);assert.equal(r.status,201);const id=r.data.id
 assert.equal((await req('/api/customers/'+id)).data.credit,125.5)
 await stop();child=launch();await wait();assert.equal((await req('/api/customers/'+id)).data.name,'Teste CRUD')
 await req('/api/customers/'+id,'PUT',{...body,name:'Editado',status:'Inativo'})
 r=await req('/api/customers/'+id);assert.equal(r.data.name,'Editado');assert.equal(r.data.status,'Ativo')
 r=await req('/api/customers?status=Ativo');assert.ok(r.data.items.every((x:any)=>x.status==='Inativo'))
 r=await req('/api/customers?search=O%27Connor');assert.equal(r.status,500);assert.match(r.data.error,/nonexistent_column/);assert.ok(r.data.sql&&r.data.trace)
 await req('/api/customers/'+id,'DELETE');assert.equal((await req('/api/customers/'+id)).status,404)
 assert.equal((await req('/api/customers')).data.total,18)
 }finally{await stop();await rm(dir,{recursive:true,force:true})}
})
