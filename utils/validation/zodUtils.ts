import { z } from 'zod/v3';
import { passwordStrength } from './passwordInput';


export const zDate = z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
    if (arg == undefined) return arg
}, z.date())


export const PasswordSchema = z.custom((value) => {
    if (typeof value !== 'string') return false
    const { message, score } = passwordStrength(value)
    if (score != 100) {
        return false//helper.message({ custom: message })
    } else {
        return true
    }

},)



