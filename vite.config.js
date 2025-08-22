import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/",   // since it's a user site repo, root is fine
  plugins: [react()],
})
