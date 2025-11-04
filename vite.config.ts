import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { loadEnv } from 'vite'

const config = defineConfig({
    plugins: [
        // this is the plugin that enables path aliases
        viteTsConfigPaths({
            projects: ['./tsconfig.json'],
        }),
        tailwindcss(),
        ...(process.env.VITEST ? [] : [tanstackStart({ customViteReactPlugin: true, tsr: { routeFileIgnorePattern: 'test' } }),]), // 🧠 disable for tests
        viteReact(),
    ],
    test: {
        // 👋 add the line below to add jsdom to vite
        environment: 'jsdom',
        env: loadEnv('', process.cwd(), ''),
        // hey! 👋 over here
        globals: true,
        setupFiles: './setupTests.tsx', // assuming the test folder is in the root of our project
    },
    deps: {
        inline: ['katex', 'streamdown'],
        web: {
            transformCss: true
        }
    },
    ssr: {
        noExternal: ['katex', 'streamdown']
    },
})

export default config
