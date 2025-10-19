


export function removeDiacritics(str?: string): string {
    if (!str) return ''
    return str?.normalize("NFD").replace(/\p{Diacritic}/gu, "") ?? ''
}


export const dev = (process.env.NODE_ENV || '').indexOf('production') === -1;

export const formatPrice = (price: { value: number, currency?: string }) => {
    if (!price.currency) return `${price.value.toLocaleString()} €`
    if (price.currency === 'EUR') return `${price.value.toLocaleString()} €`
    if (price.currency === 'RON') return `${price.value.toLocaleString()} RON`
    if (price.currency === 'USD') return `$${price.value.toLocaleString()}`
}



