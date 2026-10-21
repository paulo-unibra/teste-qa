import router from '@adonisjs/core/services/router'
import { readFile } from 'node:fs/promises'
import CustomersController from '../app/controllers/customers_controller.js'
router.get('/api/customers',[CustomersController,'index'])
router.get('/api/customers/:id',[CustomersController,'show'])
router.post('/api/customers',[CustomersController,'store'])
router.put('/api/customers/:id',[CustomersController,'update'])
router.delete('/api/customers/:id',[CustomersController,'destroy'])
for(const [path,file,type]of [['/','index.html','text/html'],['/app.js','app.js','text/javascript'],['/style.css','style.css','text/css']]){
 router.get(path,async({response})=>{response.header('Content-Type',type+'; charset=utf-8');return response.send(await readFile(new URL('../public/'+file,import.meta.url)))})
}
