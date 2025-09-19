


export function removeDiacritics(str?: string): string {
    if (!str) return ''
    return str?.normalize("NFD").replace(/\p{Diacritic}/gu, "") ?? ''
}


export const dev = (process.env.NODE_ENV || '').indexOf('production') === -1;


export const domain: string = dev ? "http://localhost:3000" : `https://kraken-ai.vercel.app/`

