import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({mode})=>{
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(),'')
  return{
    plugins: [
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace('%VITE_MAP_KEY%', env.VITE_MAP_KEY);
      },
    },
    react(),
    tailwindcss(),
  ],}
})
