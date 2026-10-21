import { defineConfig } from '@adonisjs/core/bodyparser'
export default defineConfig({ allowedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'],
 json: { encoding: 'utf-8', limit: '1mb', strict: true, types: ['application/json'] },
 form: { encoding: 'utf-8', limit: '1mb', queryString: {}, types: ['application/x-www-form-urlencoded'] },
})
