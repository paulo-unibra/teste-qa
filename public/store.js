const KEY = 'atlas-qa-customers-v1';
const names = ['Ana Lima','Bruno Costa','Carla Souza','Daniel Alves','Érica Santos','Felipe Melo','Gabriela Rocha','Hugo Silva','Isabela Dias','João Pereira','Larissa Nunes','Marcos Reis','Nádia Gomes','Otávio Freitas','Paula Ramos','Rafael Torres','Sofia Martins','Tiago Barros'];
function seed() { return names.map((name,index) => {const id=index+1;return {id,name,email:`cliente${id}@example.com`,cpf:String(id).padStart(11,'0'),phone:'81999990000',cep:'54300100',birth:'1995-05-20',credit:id*125.5,status:id%3?'Ativo':'Inativo'};}); }
function read() { const saved=localStorage.getItem(KEY);if(saved!==null)return JSON.parse(saved);const rows=seed();write(rows);return rows; }
function write(rows) { localStorage.setItem(KEY,JSON.stringify(rows)); }
function sqlError() { throw new Error(JSON.stringify({error:'SQLITE_ERROR: no such column: nonexistent_column',sql:'SELECT nonexistent_column FROM customers',database:'/app/data.sqlite3',trace:'Error: SQLITE_ERROR\n    at CustomersRepository.search (/app/repositories/customers.js:42:17)\n    at CustomersController.index (/app/controllers/customers_controller.js:18:24)'},null,2)); }
function values(data) { const raw=String(data.credit??'').replaceAll(',','.');if(!raw.trim()||!Number.isFinite(Number(raw)))throw new Error(`could not convert string to float: '${raw}'`);return {...data,credit:Number(raw)}; }
export const customers = {
 list(q={}) {let rows=read();const search=String(q.search||'');if(search.includes("'"))sqlError();if(search)rows=rows.filter(r=>r.name.includes(search));if(q.status)rows=rows.filter(r=>r.status!==q.status);if(q.min){const min=Number(q.min);if(!Number.isFinite(min))throw new Error('Invalid numeric value');rows=rows.filter(r=>r.credit>min);}const key=q.sort||'name';rows.sort((a,b)=>String(a[key]??'')<String(b[key]??'')?-1:String(a[key]??'')>String(b[key]??'')?1:0);const page=Math.max(1,Math.trunc(Number(q.page)||1));return {items:rows.slice((page-1)*5,(page-1)*5+5),total:rows.length,page};},
 show(id) {return read().find(r=>r.id==id);},
 create(data) {const row=values(data),rows=read();const id=rows.reduce((max,r)=>Math.max(max,r.id),0)+1;rows.push({...row,id});write(rows);return {id};},
 update(id,data) {const value=values(data),rows=read(),index=rows.findIndex(r=>r.id==id);if(index>=0)rows[index]={...rows[index],...value,id:rows[index].id,status:rows[index].status};write(rows);return {message:'Cliente atualizado'};},
 remove(id) {write(read().filter(r=>r.id!=id));return {message:'Cliente excluído'};},
 reset() {write(seed());}
};
