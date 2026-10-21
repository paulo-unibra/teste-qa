import type { HttpContext } from '@adonisjs/core/http'
import * as customers from '../services/customers.js'
export default class CustomersController {
 private failure(response:HttpContext['response'], error:unknown, listing=false){
  const e=error instanceof Error?error:new Error(String(error))
  return response.status(500).send({error:e.message,trace:e.stack,...(listing?{sql:'SELECT nonexistent_column FROM customers',database:customers.databasePath}:{})})
 }
 async index({request,response}:HttpContext){try{return customers.list(request.qs())}catch(e){return this.failure(response,e,true)}}
 async show({params,response}:HttpContext){const row=customers.show(params.id);return row??response.status(404).send({error:'Cliente não encontrado'})}
 async store({request,response}:HttpContext){try{return response.status(201).send(customers.create(request.body()))}catch(e){return this.failure(response,e)}}
 async update({params,request,response}:HttpContext){try{return customers.update(params.id,request.body())}catch(e){return this.failure(response,e)}}
 async destroy({params,response}:HttpContext){try{return customers.remove(params.id)}catch(e){return this.failure(response,e)}}
}
