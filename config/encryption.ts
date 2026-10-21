import { defineConfig, drivers } from '@adonisjs/core/encryption'
import { randomBytes } from 'node:crypto'
export default defineConfig({ default: 'app', list: { app: drivers.aes256gcm({ id: 'app', keys: [randomBytes(32).toString('hex')] }) } })
