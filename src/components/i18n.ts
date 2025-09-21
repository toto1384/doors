import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const enTranslations = {
    "landing-page": {
        "hero": {
            "badge": "AI-Powered Real Estate",
            "title": {
                "line1": "Your AI Real Estate",
                "line2": "Companion"
            },
            "description": "Experience the future of property trading with Kraken - a revolutionary two-sided platform where AI agents guide both buyers and sellers through every step of their real estate journey.",
            "buttons": {
                "getStarted": "Get Started Free",
                "watchDemo": "Watch Demo"
            },
            "stats": {
                "properties": "10K+",
                "propertiesLabel": "Properties Listed",
                "satisfaction": "95%",
                "satisfactionLabel": "Satisfaction Rate",
                "support": "24/7",
                "supportLabel": "AI Support"
            }
        },
        "features": {
            "title": {
                "prefix": "Why Choose ",
                "brand": "Kraken",
                "suffix": "?"
            },
            "subtitle": "Revolutionary features powered by cutting-edge AI technology to transform your real estate experience.",
            "items": {
                "aiAssistant": {
                    "title": "AI Assistant",
                    "description": "Your personal real estate companion that understands your needs and preferences, available 24/7 to guide you through every decision."
                },
                "lightningSearch": {
                    "title": "Lightning Fast Search",
                    "description": "Advanced algorithms instantly match you with perfect properties based on your criteria, lifestyle, and budget preferences."
                },
                "personalizedListings": {
                    "title": "Personalized Listings",
                    "description": "Machine learning curates property recommendations that evolve with your preferences and viewing history."
                },
                "transparentPricing": {
                    "title": "Transparent Pricing",
                    "description": "Real-time market analysis and pricing insights ensure you always know the true value of every property."
                }
            }
        },
        "demo": {
            "title": {
                "prefix": "See Kraken AI in ",
                "highlight": "Action"
            },
            "subtitle": "Experience how our AI assistant revolutionizes property search and decision-making.",
            "conversation": {
                "aiGreeting": "Hi! I'm your AI real estate assistant. What kind of property are you looking for?",
                "userRequest": "I'm looking for a 3-bedroom house under $500k in downtown area",
                "aiResponse": "Perfect! I found 12 properties matching your criteria. Based on your preferences, I'd recommend starting with this beautifully renovated Victorian home...",
                "userFollowup": "Can you show me photos and schedule a viewing?",
                "aiFinal": "Absolutely! Here are the photos and I've scheduled a viewing for tomorrow at 2 PM. I'll also prepare a market analysis report for you."
            }
        },
        "pricing": {
            "title": {
                "simple": "Simple, ",
                "transparent": "Transparent",
                "suffix": " Pricing"
            },
            "subtitle": "Choose the perfect plan for your real estate journey. All plans include our revolutionary AI assistant.",
            "plans": {
                "explorer": {
                    "name": "Explorer",
                    "price": "Free",
                    "tokens": "100 tokens/month",
                    "features": [
                        "Basic AI assistance",
                        "Property search",
                        "Market insights",
                        "Email support"
                    ]
                },
                "professional": {
                    "name": "Professional",
                    "price": "$29",
                    "tokens": "1,000 tokens/month",
                    "features": [
                        "Advanced AI guidance",
                        "Personalized recommendations",
                        "Priority support",
                        "Market analysis reports",
                        "Saved searches & alerts"
                    ],
                    "badge": "Most Popular"
                },
                "premium": {
                    "name": "Premium",
                    "price": "$99",
                    "tokens": "Unlimited tokens",
                    "features": [
                        "White-glove AI service",
                        "Dedicated agent support",
                        "Custom market reports",
                        "VIP property access",
                        "Phone support"
                    ]
                }
            },
            "button": "Get Started",
            "contact": {
                "text": "Need a custom solution? ",
                "link": "Contact our sales team"
            }
        },
        "footer": {
            "brand": "Kraken Real Estate",
            "description": "Revolutionizing real estate with AI-powered assistance for both buyers and sellers. Your intelligent companion in property transactions.",
            "sections": {
                "about": {
                    "title": "About",
                    "links": {
                        "story": "Our Story",
                        "team": "Team",
                        "careers": "Careers",
                        "press": "Press"
                    }
                },
                "support": {
                    "title": "Support",
                    "links": {
                        "contact": "Contact Us",
                        "help": "Help Center",
                        "privacy": "Privacy Policy",
                        "terms": "Terms of Service"
                    }
                }
            },
            "copyright": "© 2025 Kraken Real Estate. All rights reserved.",
            "legal": {
                "legal": "Legal",
                "privacy": "Privacy",
                "cookies": "Cookies"
            }
        },
        "navigation": {
            "features": "Features",
            "demo": "Demo",
            "pricing": "Pricing"
        }
    },
    "register-page": {
        "title": "Sign Up",
        "subtitle": "Create your account to get started",
        "form": {
            "email": "Email",
            "password": "Password",
            "confirmPassword": "Confirm Password",
            "firstName": "First Name",
            "lastName": "Last Name",
            "button": "Create Account",
            "haveAccount": "Already have an account?",
            "signIn": "Sign in"
        }
    },
    "login-page": {
        "title": "Sign In",
        "subtitle": "Sign in to your account",
        "form": {
            "email": "Email",
            "password": "Password",
            "button": "Sign In",
            "forgotPassword": "Forgot your password?",
            "noAccount": "Don't have an account?",
            "signUp": "Sign up"
        }
    },
    "profile-page": {
        "title": "Profile",
        "subtitle": "Manage your account settings",
        "settings": "Settings",
        "sections": {
            "personal": "Personal Information",
            "preferences": "Preferences",
            "security": "Security",
            "language": "Language"
        },
        "language": {
            "title": "Language Settings",
            "subtitle": "Choose your preferred language",
            "english": "English",
            "romanian": "Romanian"
        },
        "theme": {
            "title": "Theme Settings",
            "subtitle": "Choose your preferred theme"
        },
        "account": {
            "title": "Account"
        }
    },
    "privacy-policy": {
        "title": "Privacy Policy",
        "lastUpdated": "Last updated: {date}",
        "introduction": "This Privacy Policy describes how we collect, use, and protect your information."
    },
    "terms-of-service": {
        "title": "Terms of Service",
        "lastUpdated": "Last updated: {date}",
        "introduction": "These Terms of Service govern your use of our platform and services."
    },
    "common": {
        "loading": "Loading...",
        "save": "Save",
        "cancel": "Cancel",
        "edit": "Edit",
        "delete": "Delete",
        "confirm": "Confirm",
        "close": "Close"
    },
    "auth-ui": {
        "signIn": "Sign In",
        "signUp": "Sign Up",
        "signOut": "Sign Out",
        "forgotPassword": "Forgot Password",
        "resetPassword": "Reset Password",
        "changePassword": "Change Password",
        "updateProfile": "Update Profile",
        "settings": "Settings",
        "profile": "Profile",
        "account": "Account",
        "email": "Email",
        "password": "Password",
        "confirmPassword": "Confirm Password",
        "newPassword": "New Password",
        "currentPassword": "Current Password",
        "firstName": "First Name",
        "lastName": "Last Name",
        "name": "Name",
        "displayName": "Display Name",
        "phoneNumber": "Phone Number",
        "dateOfBirth": "Date of Birth",
        "gender": "Gender",
        "bio": "Bio",
        "website": "Website",
        "location": "Location",
        "timezone": "Timezone",
        "language": "Language",
        "theme": "Theme",
        "notifications": "Notifications",
        "privacy": "Privacy",
        "security": "Security",
        "sessions": "Sessions",
        "devices": "Devices",
        "continue": "Continue",
        "byContinuingYouAgree": "By continuing, you agree to our",
        "termsOfService": "Terms of Service",
        "privacyPolicy": "Privacy Policy",
        "and": "and",
        "or": "or",
        "rememberMe": "Remember Me",
        "staySignedIn": "Stay signed in",
        "alreadyHaveAccount": "Already have an account?",
        "dontHaveAccount": "Don't have an account?",
        "backToSignIn": "Back to Sign In",
        "createAccount": "Create Account",
        "enterEmail": "Enter your email",
        "enterPassword": "Enter your password",
        "enterNewPassword": "Enter your new password",
        "confirmNewPassword": "Confirm your new password",
        "sendResetLink": "Send Reset Link",
        "checkEmail": "Check your email",
        "resetLinkSent": "We've sent you a password reset link",
        "passwordUpdated": "Password updated successfully",
        "profileUpdated": "Profile updated successfully",
        "emailVerified": "Email verified successfully",
        "verifyEmail": "Verify Email",
        "resendVerification": "Resend Verification",
        "verificationSent": "Verification email sent",
        "emailNotVerified": "Email not verified",
        "pleaseVerifyEmail": "Please verify your email address",
        "loading": "Loading...",
        "saving": "Saving...",
        "submitting": "Submitting...",
        "processing": "Processing...",
        "optional": "Optional",
        "required": "Required"
    }
} as const;

// Romanian translations
const roTranslations = {
    "landing-page": {
        "hero": {
            "badge": "Imobiliare cu Inteligență Artificială",
            "title": {
                "line1": "Compania ta AI pentru",
                "line2": "Imobiliare"
            },
            "description": "Experimentează viitorul tranzacțiilor imobiliare cu Kraken - o platformă revoluționară cu două părți unde agenții AI ghidează atât cumpărătorii, cât și vânzătorii prin fiecare pas al călătoriei lor imobiliare.",
            "buttons": {
                "getStarted": "Începe Gratuit",
                "watchDemo": "Vezi Demo"
            },
            "stats": {
                "properties": "10K+",
                "propertiesLabel": "Proprietăți Listate",
                "satisfaction": "95%",
                "satisfactionLabel": "Rata de Satisfacție",
                "support": "24/7",
                "supportLabel": "Suport AI"
            }
        },
        "features": {
            "title": {
                "prefix": "De ce să alegi ",
                "brand": "Kraken",
                "suffix": "?"
            },
            "subtitle": "Funcții revoluționare alimentate de tehnologia AI de ultimă generație pentru a-ți transforma experiența imobiliară.",
            "items": {
                "aiAssistant": {
                    "title": "Asistent AI",
                    "description": "Compania ta personală pentru imobiliare care înțelege nevoile și preferințele tale, disponibilă 24/7 pentru a te ghida în fiecare decizie."
                },
                "lightningSearch": {
                    "title": "Căutare Ultra-Rapidă",
                    "description": "Algoritmii avansați te conectează instant cu proprietățile perfecte pe baza criteriilor, stilului de viață și preferințelor de buget."
                },
                "personalizedListings": {
                    "title": "Listări Personalizate",
                    "description": "Învățarea automată curează recomandări de proprietăți care evoluează cu preferințele și istoricul tău de vizualizare."
                },
                "transparentPricing": {
                    "title": "Prețuri Transparente",
                    "description": "Analiza pieței în timp real și perspectivele asupra prețurilor îți asigură că știi întotdeauna adevărata valoare a fiecărei proprietăți."
                }
            }
        },
        "demo": {
            "title": {
                "prefix": "Vezi Kraken AI în ",
                "highlight": "Acțiune"
            },
            "subtitle": "Experimentează modul în care asistentul nostru AI revoluționează căutarea proprietăților și luarea deciziilor.",
            "conversation": {
                "aiGreeting": "Salut! Sunt asistentul tău AI pentru imobiliare. Ce fel de proprietate cauți?",
                "userRequest": "Caut o casă cu 3 dormitoare sub 500k în zona centrală",
                "aiResponse": "Perfect! Am găsit 12 proprietăți care corespund criteriilor tale. Pe baza preferințelor tale, aș recomanda să începi cu această casă victoriană frumos renovată...",
                "userFollowup": "Poți să-mi arăți fotografii și să programezi o vizită?",
                "aiFinal": "Absolut! Iată fotografiile și am programat o vizită pentru mâine la 14:00. De asemenea, voi pregăti un raport de analiză a pieței pentru tine."
            }
        },
        "pricing": {
            "title": {
                "simple": "Simple, ",
                "transparent": "Transparent",
                "suffix": " Prețuri"
            },
            "subtitle": "Alege planul perfect pentru călătoria ta imobiliară. Toate planurile includ asistentul nostru AI revoluționar.",
            "plans": {
                "explorer": {
                    "name": "Explorator",
                    "price": "Gratuit",
                    "tokens": "100 token-uri/lună",
                    "features": [
                        "Asistență AI de bază",
                        "Căutare proprietăți",
                        "Perspective de piață",
                        "Suport prin email"
                    ]
                },
                "professional": {
                    "name": "Profesional",
                    "price": "29$",
                    "tokens": "1.000 token-uri/lună",
                    "features": [
                        "Ghidare AI avansată",
                        "Recomandări personalizate",
                        "Suport prioritar",
                        "Rapoarte de analiză a pieței",
                        "Căutări salvate și alerte"
                    ],
                    "badge": "Cel mai Popular"
                },
                "premium": {
                    "name": "Premium",
                    "price": "99$",
                    "tokens": "Token-uri nelimitate",
                    "features": [
                        "Serviciu AI complet personalizat",
                        "Suport dedicat de agent",
                        "Rapoarte de piață personalizate",
                        "Acces VIP la proprietăți",
                        "Suport telefonic"
                    ]
                }
            },
            "button": "Începe",
            "contact": {
                "text": "Ai nevoie de o soluție personalizată? ",
                "link": "Contactează echipa noastră de vânzări"
            }
        },
        "footer": {
            "brand": "Kraken Imobiliare",
            "description": "Revoluționăm piața imobiliară cu asistența bazată pe AI atât pentru cumpărători, cât și pentru vânzători. Compania ta inteligentă în tranzacțiile imobiliare.",
            "sections": {
                "about": {
                    "title": "Despre",
                    "links": {
                        "story": "Povestea Noastră",
                        "team": "Echipa",
                        "careers": "Cariere",
                        "press": "Presă"
                    }
                },
                "support": {
                    "title": "Suport",
                    "links": {
                        "contact": "Contactează-ne",
                        "help": "Centrul de Ajutor",
                        "privacy": "Politica de Confidențialitate",
                        "terms": "Termenii Serviciului"
                    }
                }
            },
            "copyright": "© 2025 Kraken Imobiliare. Toate drepturile rezervate.",
            "legal": {
                "legal": "Legal",
                "privacy": "Confidențialitate",
                "cookies": "Cookie-uri"
            }
        },
        "navigation": {
            "features": "Funcții",
            "demo": "Demo",
            "pricing": "Prețuri"
        }
    },
    "register-page": {
        "title": "Înregistrează-te",
        "subtitle": "Creează-ți contul pentru a începe",
        "form": {
            "email": "Email",
            "password": "Parolă",
            "confirmPassword": "Confirmă Parola",
            "firstName": "Prenume",
            "lastName": "Nume",
            "button": "Creează Cont",
            "haveAccount": "Ai deja un cont?",
            "signIn": "Conectează-te"
        }
    },
    "login-page": {
        "title": "Conectează-te",
        "subtitle": "Conectează-te la contul tău",
        "form": {
            "email": "Email",
            "password": "Parolă",
            "button": "Conectează-te",
            "forgotPassword": "Ți-ai uitat parola?",
            "noAccount": "Nu ai un cont?",
            "signUp": "Înregistrează-te"
        }
    },
    "profile-page": {
        "title": "Profil",
        "subtitle": "Gestionează setările contului",
        "settings": "Setări",
        "sections": {
            "personal": "Informații Personale",
            "preferences": "Preferințe",
            "security": "Securitate",
            "language": "Limbă"
        },
        "language": {
            "title": "Setări Limbă",
            "subtitle": "Alege limba ta preferată",
            "english": "Engleză",
            "romanian": "Română"
        },
        "theme": {
            "title": "Setări Temă",
            "subtitle": "Alege tema ta preferată"
        },
        "account": {
            "title": "Cont"
        }
    },
    "privacy-policy": {
        "title": "Politica de Confidențialitate",
        "lastUpdated": "Ultima actualizare: {date}",
        "introduction": "Această Politică de Confidențialitate descrie modul în care colectăm, folosim și protejăm informațiile dvs."
    },
    "terms-of-service": {
        "title": "Termenii Serviciului",
        "lastUpdated": "Ultima actualizare: {date}",
        "introduction": "Acești Termeni de Serviciu guvernează utilizarea platformei și serviciilor noastre."
    },
    "common": {
        "loading": "Se încarcă...",
        "save": "Salvează",
        "cancel": "Anulează",
        "edit": "Editează",
        "delete": "Șterge",
        "confirm": "Confirmă",
        "close": "Închide"
    },
    "auth-ui": {
        "signIn": "Conectează-te",
        "signUp": "Înregistrează-te",
        "signOut": "Deconectează-te",
        "forgotPassword": "Parolă Uitată",
        "resetPassword": "Resetează Parola",
        "changePassword": "Schimbă Parola",
        "updateProfile": "Actualizează Profilul",
        "settings": "Setări",
        "profile": "Profil",
        "account": "Cont",
        "email": "Email",
        "password": "Parolă",
        "confirmPassword": "Confirmă Parola",
        "newPassword": "Parolă Nouă",
        "currentPassword": "Parola Curentă",
        "firstName": "Prenume",
        "lastName": "Nume",
        "name": "Nume",
        "displayName": "Nume Afișat",
        "phoneNumber": "Număr de Telefon",
        "dateOfBirth": "Data Nașterii",
        "gender": "Gen",
        "bio": "Biografie",
        "website": "Site Web",
        "location": "Locație",
        "timezone": "Fus Orar",
        "language": "Limbă",
        "theme": "Temă",
        "notifications": "Notificări",
        "privacy": "Confidențialitate",
        "security": "Securitate",
        "sessions": "Sesiuni",
        "devices": "Dispozitive",
        "continue": "Continuă",
        "byContinuingYouAgree": "Prin continuare, ești de acord cu",
        "termsOfService": "Termenii Serviciului",
        "privacyPolicy": "Politica de Confidențialitate",
        "and": "și",
        "or": "sau",
        "rememberMe": "Ține-mă Minte",
        "staySignedIn": "Rămâi conectat",
        "alreadyHaveAccount": "Ai deja un cont?",
        "dontHaveAccount": "Nu ai un cont?",
        "backToSignIn": "Înapoi la Conectare",
        "createAccount": "Creează Cont",
        "enterEmail": "Introdu email-ul",
        "enterPassword": "Introdu parola",
        "enterNewPassword": "Introdu parola nouă",
        "confirmNewPassword": "Confirmă parola nouă",
        "sendResetLink": "Trimite Link de Resetare",
        "checkEmail": "Verifică email-ul",
        "resetLinkSent": "Ți-am trimis un link de resetare a parolei",
        "passwordUpdated": "Parola a fost actualizată cu succes",
        "profileUpdated": "Profilul a fost actualizat cu succes",
        "emailVerified": "Email-ul a fost verificat cu succes",
        "verifyEmail": "Verifică Email",
        "resendVerification": "Retrimite Verificarea",
        "verificationSent": "Email de verificare trimis",
        "emailNotVerified": "Email neverificat",
        "pleaseVerifyEmail": "Te rugăm să îți verifici adresa de email",
        "loading": "Se încarcă...",
        "saving": "Se salvează...",
        "submitting": "Se trimite...",
        "processing": "Se procesează...",
        "optional": "Opțional",
        "required": "Obligatoriu"
    }
} as const;

const resources = {
    en: {
        translation: enTranslations
    },
    ro: {
        translation: roTranslations
    }
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .use(LanguageDetector)
    .init({
        resources,
        fallbackLng: "en", // fallback language if translation missing
        supportedLngs: ['en', 'ro'],
        load: 'languageOnly',
        convertDetectedLanguage: (lng: string) => lng.includes('-') ? lng.split('-')[0] : lng,
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            lookupLocalStorage: 'i18nextLng',
            caches: ['localStorage']
        },
    } as any);

export default i18n;
