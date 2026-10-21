import test from 'node:test';
import assert from 'node:assert/strict';
const storage=new Map();
globalThis.localStorage={getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)};
const {customers}=await import('../public/store.js');
test('CRUD local, persistência e simulações do desafio',async()=>{
 customers.reset();assert.equal(customers.list().total,18);
 const body={name:'Cliente teste',email:'teste@example.com',cpf:'123',phone:'81',cep:'',birth:'',credit:'125,50',status:'Ativo'};
 const {id}=customers.create(body);assert.equal(customers.show(id).credit,125.5);
 const fresh=await import('../public/store.js?reload');assert.equal(fresh.customers.show(id).name,'Cliente teste');
 customers.update(id,{...body,name:'Editado',status:'Inativo'});assert.equal(customers.show(id).name,'Editado');assert.equal(customers.show(id).status,'Ativo');
 assert.ok(customers.list({status:'Ativo'}).items.every(r=>r.status==='Inativo'));
 assert.equal(customers.list({search:'ana'}).total,0);
 assert.throws(()=>customers.list({search:"O'Connor"}),/SQLITE_ERROR/);
 customers.remove(id);assert.equal(customers.show(id),undefined);assert.equal(customers.list().total,18);
 for(let i=1;i<=18;i++)customers.remove(i);assert.equal(customers.list().total,0);
 const emptyReload=await import('../public/store.js?empty');assert.equal(emptyReload.customers.list().total,0);
 customers.reset();assert.equal(customers.list().total,18);
});
