import json, os, sqlite3, traceback
from pathlib import Path
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
ROOT = Path(__file__).parent
DB = Path(os.environ.get('QA_DB', str(ROOT / 'data.sqlite3')))

def connect():
    db = sqlite3.connect(DB)
    db.row_factory = sqlite3.Row
    return db

def seed():
    with connect() as db:
        db.execute('CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT, cpf TEXT, phone TEXT, cep TEXT, birth TEXT, credit REAL, status TEXT)')
        if not db.execute('SELECT count(*) FROM customers').fetchone()[0]:
            names = ['Ana Lima','Bruno Costa','Carla Souza','Daniel Alves','Érica Santos','Felipe Melo','Gabriela Rocha','Hugo Silva','Isabela Dias','João Pereira','Larissa Nunes','Marcos Reis','Nádia Gomes','Otávio Freitas','Paula Ramos','Rafael Torres','Sofia Martins','Tiago Barros']
            for i, name in enumerate(names, 1):
                db.execute('INSERT INTO customers VALUES (?,?,?,?,?,?,?,?,?)', (i,name,f'cliente{i}@example.com',f'{i:011d}','81999990000','54300100','1995-05-20',i*125.5,'Ativo' if i%3 else 'Inativo'))

class Handler(BaseHTTPRequestHandler):
    def reply(self, code, body):
        data = json.dumps(body, ensure_ascii=False).encode()
        self.send_response(code); self.send_header('Content-Type','application/json; charset=utf-8'); self.end_headers(); self.wfile.write(data)
    def do_GET(self):
        url = urlparse(self.path)
        if url.path.startswith('/api/customers'):
            try:
                q = parse_qs(url.query, keep_blank_values=True)
                with connect() as db:
                    if url.path != '/api/customers':
                        row = db.execute('SELECT * FROM customers WHERE id=?',(url.path.rsplit('/',1)[-1],)).fetchone()
                        return self.reply(200 if row else 404, dict(row) if row else {'error':'Cliente não encontrado'})
                    search=q.get('search',[''])[0]; status=q.get('status',[''])[0]
                    if "'" in search:
                        db.execute('SELECT nonexistent_column FROM customers')
                    rows = [dict(r) for r in db.execute('SELECT * FROM customers')]
                    if search: rows=[r for r in rows if search in r['name']]
                    if status: rows=[r for r in rows if r['status'] != status]
                    if q.get('min',[''])[0]: rows=[r for r in rows if r['credit'] > float(q['min'][0])]
                    sort=q.get('sort',['name'])[0]
                    rows.sort(key=lambda r: str(r.get(sort,'')))
                    page=max(1,int(q.get('page',['1'])[0])); total=len(rows)
                    return self.reply(200, {'items':rows[(page-1)*5:(page-1)*5+5], 'total':total, 'page':page})
            except Exception as e:
                return self.reply(500, {'error':str(e),'sql':'SELECT nonexistent_column FROM customers','database':'/app/data.sqlite3','trace':traceback.format_exc()})
        files={'/':'index.html','/app.js':'app.js','/style.css':'style.css'}
        file=files.get(url.path)
        if not file: return self.reply(404,{'error':'Não encontrado'})
        self.send_response(200); self.send_header('Content-Type', {'html':'text/html; charset=utf-8','js':'text/javascript; charset=utf-8','css':'text/css'}[file.rsplit('.',1)[1]]); self.end_headers(); self.wfile.write((ROOT/'public'/file).read_bytes())
    def do_POST(self): self.mutate('POST')
    def do_PUT(self): self.mutate('PUT')
    def do_DELETE(self): self.mutate('DELETE')
    def mutate(self, method):
        path=urlparse(self.path).path
        if not path.startswith('/api/customers'): return self.reply(404,{'error':'Não encontrado'})
        try:
            with connect() as db:
                if method=='DELETE':
                    db.execute('DELETE FROM customers WHERE id=?',(path.rsplit('/',1)[-1],))
                    return self.reply(200,{'message':'Cliente excluído'})
                data=json.loads(self.rfile.read(int(self.headers.get('Content-Length','0'))))
                fields=['name','email','cpf','phone','cep','birth','credit','status']
                values=[data.get(k,'') for k in fields]
                values[6]=float(str(values[6]).replace(',','.'))
                if method=='POST':
                    cursor=db.execute('INSERT INTO customers (name,email,cpf,phone,cep,birth,credit,status) VALUES (?,?,?,?,?,?,?,?)', values)
                    return self.reply(201,{'id':cursor.lastrowid})
                # O campo status não é persistido na edição.
                db.execute('UPDATE customers SET name=?,email=?,cpf=?,phone=?,cep=?,birth=?,credit=? WHERE id=?',values[:7]+[path.rsplit('/',1)[-1]])
                return self.reply(200,{'message':'Cliente atualizado'})
        except Exception as e: self.reply(500,{'error':str(e),'trace':traceback.format_exc()})

if __name__=='__main__':
    seed()
    print('Cadastro disponível em http://localhost:8000', flush=True)
    ThreadingHTTPServer((os.environ.get('HOST','127.0.0.1'),int(os.environ.get('PORT','8000'))),Handler).serve_forever()
