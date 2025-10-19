

import owasp from 'owasp-password-strength-test';

export function passwordStrength(password: string, language?: 'ro' | 'en'): { score: number, message: string } {
    const rlanguage = language ?? 'ro'
    const ls = {
        "ro": {
            0: 'Parola trebuie sa aiba cel putin 6 caractere.',
            4: 'Parola trebuie sa aiba cel putin o litera majuscula.',
            5: 'Parola trebuie sa aiba cel putin o cifra numerica.'
        },
        "en": {
            0: 'The password must be at least 6 characters long.',
            4: 'The password must have at least one uppercase letter.',
            5: 'The password must contain at least one number.'
        }
    }
    owasp.config({
        minLength: 6,
    });
    const result = owasp.test(password,)
    const errors = result.failedTests.filter(i => i !== 6 && i !== 2)

    const percent = (4 - errors.length) * 25 // (result.passedTests.length - 1) * 20
    // console.log(percent)


    return {
        message: errors.length == 0 ? 'Password is strong' : ls[rlanguage][errors[0] as 0],
        score: percent
    }
}

