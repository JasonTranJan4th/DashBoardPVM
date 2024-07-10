import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                login: resolve(__dirname, 'login.html'),
                main: resolve(__dirname, 'index.html'),
                gum: resolve(__dirname, 'gum.html'),
                mentos: resolve(__dirname, 'mentos.html'),
            }
        }
    }
})