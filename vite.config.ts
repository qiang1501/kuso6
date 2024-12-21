import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/kuso6/', // 设置为 GitHub Pages 的子路径
  plugins: [react()],
})
