import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
export const databasePath = process.env.QA_DB || fileURLToPath(new URL('../../data.sqlite3', import.meta.url))
const db = new DatabaseSync(databasePath)
db.exec('CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT, cpf TEXT, phone TEXT, cep TEXT, birth TEXT, credit REAL, status TEXT)')
if (!(db.prepare('SELECT COUNT(*) AS total FROM customers').get() as any).total) {
 const names=['Ana Lima','Bruno Costa','Carla Souza','Daniel Alves','Érica Santos','Felipe Melo','Gabriela Rocha','Hugo Silva','Isabela Dias','João Pereira','Larissa Nunes','Marcos Reis','Nádia Gomes','Otávio Freitas','Paula Ramos','Rafael Torres','Sofia Martins','Tiago Barros']
 const insert=db.prepare('INSERT INTO customers VALUES (?,?,?,?,?,?,?,?,?)')
 db.exec('BEGIN')
 try { names.forEach((name,index)=>{const id=index+1;insert.run(id,name,`cliente${id}@example.com`,String(id).padStart(11,'0'),'81999990000','54300100','1995-05-20',id*125.5,id%3?'Ativo':'Inativo')});db.exec('COMMIT') }
 catch(error){db.exec('ROLLBACK');throw error}
}
export type Customer = { id:number; name:string; email:string; cpf:string; phone:string; cep:string; birth:string; credit:number; status:string }
export function list(q: Record<string, any>) {
 const search=String(q.search||''); const status=String(q.status||'')
 if(search.includes("'")) db.prepare('SELECT nonexistent_column FROM customers').all()
 let rows=db.prepare('SELECT * FROM customers').all() as Customer[]
 if(search) rows=rows.filter(r=>r.name.includes(search))
 if(status) rows=rows.filter(r=>r.status!==status)
 if(q.min) {const min=Number(q.min);if(!Number.isFinite(min))throw new Error('Invalid numeric value');rows=rows.filter(r=>r.credit>min)}
 const key=(q.sort||'name') as keyof Customer
 rows.sort((a,b)=>String(a[key]??'')<String(b[key]??'')?-1:String(a[key]??'')>String(b[key]??'')?1:0)
 const page=Math.max(1,Math.trunc(Number(q.page)||1))
 return {items:rows.slice((page-1)*5,(page-1)*5+5),total:rows.length,page}
}
export function show(id:string){return db.prepare('SELECT * FROM customers WHERE id=?').get(id)}
function values(data:Record<string,any>){
 const result=['name','email','cpf','phone','cep','birth','credit','status'].map(k=>data[k]??'')
 const raw=String(result[6]).replaceAll(',','.')
 if(!raw.trim() || !Number.isFinite(Number(raw)))throw new Error(`could not convert string to float: '${raw}'`)
 result[6]=Number(raw);return result
}
export function create(data:Record<string,any>){return {id:Number(db.prepare('INSERT INTO customers (name,email,cpf,phone,cep,birth,credit,status) VALUES (?,?,?,?,?,?,?,?)').run(...values(data)).lastInsertRowid)}}
export function update(id:string,data:Record<string,any>){db.prepare('UPDATE customers SET name=?,email=?,cpf=?,phone=?,cep=?,birth=?,credit=? WHERE id=?').run(...values(data).slice(0,7),id);return {message:'Cliente atualizado'}}
export function remove(id:string){db.prepare('DELETE FROM customers WHERE id=?').run(id);return {message:'Cliente excluído'}}
