import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base: './'` emits relative asset paths, so the build works on GitHub Pages
// regardless of the repository name (https://<user>.github.io/<any-repo>/).
export default defineConfig({
  base: './',
  plugins: [react()],
})
