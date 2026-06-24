import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
    resolve: {
        // The admin React app lives in resources/js/admin and ships its own
        // nested node_modules (it started life as a separate CRA project).
        // Force these packages to resolve to the project root's copy so we
        // don't end up with two copies of React (which breaks hooks).
        dedupe: ['react', 'react-dom', 'react-router-dom'],
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
