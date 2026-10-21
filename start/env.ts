import { Env } from '@adonisjs/core/env'
process.env.HOST ||= '127.0.0.1'
process.env.PORT ||= '8000'
process.env.NODE_ENV ||= 'development'
export default await Env.create(new URL('../', import.meta.url), {
 NODE_ENV: Env.schema.enum.optional(['development', 'production', 'test'] as const),
 HOST: Env.schema.string.optional(), PORT: Env.schema.number.optional(),
})
