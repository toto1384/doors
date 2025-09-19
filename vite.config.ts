import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
    plugins: [
        // this is the plugin that enables path aliases
        viteTsConfigPaths({
            projects: ['./tsconfig.json'],
        }),
        tailwindcss(),
        tanstackStart({
            customViteReactPlugin: true,
        }),
        viteReact(),
    ],
    test: {
        pool: "vmForks",
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
