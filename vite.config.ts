import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    port:6776,
    proxy:{
    "/api":{
      target:'http://localhost:7000',
      changeOrigin:true
    }
    },
      },
  plugins: [react()],
  
})
