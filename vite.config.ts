import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Garante que process.env.API_KEY seja substituído pelo valor da string
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY),
      // Define um objeto vazio para process.env para evitar erros caso alguma lib tente acessá-lo diretamente
      // Nota: A substituição mais específica (API_KEY) geralmente tem precedência
      'process.env': {}
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      commonjsOptions: {
        // Ajuda o Rollup a lidar com pacotes que misturam CommonJS e ESM (comum em novas libs)
        transformMixedEsModules: true,
      },
    }
  };
});