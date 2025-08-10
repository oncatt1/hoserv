import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import react from '@vitejs/plugin-react'

const key = fs.readFileSync('./192.168.8.175+2-key.pem')
const cert = fs.readFileSync('./192.168.8.175+2.pem')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    https: { key, cert },
    host: '0.0.0.0', // nasłuch na wszystkich interfejsach
    port: 5173,
  }
})
