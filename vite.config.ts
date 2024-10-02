import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
  plugins: [react()],
  
})
