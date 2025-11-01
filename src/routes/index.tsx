
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Search, Bot, Zap, Eye, DollarSign, Home, Star, ArrowRight, Menu, X, Shield, Atom, Focus, CheckCircle, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from "src/components/headerLanding";
import { useTRPC } from 'trpc/react';
import { authClient } from 'utils/auth-client';
import '../components/i18n';
import i18n from '../components/i18n';


export const Route = createFileRoute('/')({
    component: LandingPage,
})


function LandingPage() {

    const blobs = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: i % 2 === 0 ? 10 : 90, // alternates left (20%) and right (80%)
        y: i * 600, // fixed spacing, 400px apart
    }));

    return (
        <div className='bg-[#0B0014] text-white overflow-x-clip overflow-y-clip relative'>


            {blobs.map(blob => (
                <div
                    key={blob.id}
                    className="absolute w-[700px] h-[700px] rounded-full blur-[100px] pointer-events-none -z10"
                    style={{
                        left: `${blob.x}%`,
                        top: `calc(${blob.y}px + 150dvh)`,
                        background: 'radial-gradient(circle, rgba(138, 64, 182, 0.3) 0%, transparent 70%)',
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            ))}


            <Header />
            <HeroSection />
            <BenefitsSection />
            <DemoSection />
            <AboutSection />
            <PricingSection />
            <FAQSection />
            <FinalCTASection />
            <Footer />
        </div>
    );
}




// Hero Section Component
const HeroSection: React.FC = () => {
    const { data } = authClient.useSession();
    const { t } = useTranslation();
    const language = i18n.language;

    return (
        <section className="min-h-[95dvh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-end relative md:overflow-hidden h-fit">
            <img src="/landing/chat.png" className="absolute hidden md:block z-40 top-0 bottom-0 my-auto left-10 w-[30vw] opacity-50" />
            <img src="/landing/hero.png" className="absolute brightness-75 right-0 top-0 md:left-[15%] md:w-[90%] bg-black/50 object-cover h-[70dvh] md:h-auto" />
            <img src="/landing/heroLayer.png" className="absolute brightness-75 hidden md:block z-20 right-0 top-0 md:left-[15%] md:w-[90%] object-cover h-[70dvh] md:h-auto " />
            <div className='bg-gradient-to-r hidden md:block from-[#0B0014]/90 from-20% to-black/0 to-50% absolute z-30 inset-0'></div>
            <div className='bg-gradient-to-t from-[#0B0014] from-20% to-black/0 to-50% absolute z-30 inset-0'></div>


            <div className="md:max-w-[75vw] md:px-6 absolute bottom-0 md:mt-0 md:top-[25%] md:right-[10%] mx-auto">
                <div className="z-10 px-3 text-center">
                    <span className={`text-4xl md:text-2xl md:block text-center ${language == 'ro' ? "md:pl-5 " : "md:pl-16"} font-light text-white mb-4`}>
                        {t('landing-page.hero.title.line1')}
                    </span>
                    <span className="text-4xl md:text-[13rem]/15 font-semibold text-white mb-8 ml-2 md:ml-0">
                        {t('landing-page.hero.title.line2')}
                    </span>
                </div>
                <div className='z-40 relative md:absolute px-3'>
                    <p className="text-xl md:text-[26px] text-center md:-mx-5 mt-4 md:mt-8 mb-8 ">
                        {t('landing-page.hero.subtitle')}
                    </p>

                    <p className="md:text-sm font-light mt-6 md:mt-16 mb-8 md:mb-4 max-w-3xl mx-auto text-[#C4CDD5]">
                        {t('landing-page.hero.description')}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 justify-center items-center">
                        <Link
                            to={data ? "/app" : "/auth/$path"}
                            params={data ? {} : { path: "sign-in" }}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 md:py-[9px] rounded-sm text-lg md:text-base hover:from-blue-600 hover:to-purple-700 transition-all transform shadow-2xl text-center"
                        >
                            {t('landing-page.hero.buttons.register')}
                        </Link>
                        <Link
                            to={data ? "/app" : "/auth/$path"}
                            params={data ? {} : { path: "sign-in" }}
                            className="outline-1 outline-white text-white px-4 py-3 md:py-2 rounded-sm text-lg md:text-base hover:outline-slate-400 hover:bg-slate-800/50 transition-all text-center">
                            {t('landing-page.hero.buttons.login')}
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};

// Benefits Section Component
const BenefitsSection: React.FC = () => {
    const { t } = useTranslation();

    const benefits = [
        {
            icon: <img src="/icons/landing/personalAssistent.png" className="w-28 h-28 object-contain" />,
            title: t('landing-page.benefits.items.personalAssistant.title'),
            description: t('landing-page.benefits.items.personalAssistant.description')
        },
        {
            icon: <img src="/icons/landing/personalizedSearch.png" className="w-28 h-28 object-contain" />,
            title: t('landing-page.benefits.items.personalizedSearch.title'),
            description: t('landing-page.benefits.items.personalizedSearch.description')
        },
        {
            icon: <img src="/icons/landing/correctPrice.png" className="w-28 h-28 object-contain" />,
            title: t('landing-page.benefits.items.correctPrice.title'),
            description: t('landing-page.benefits.items.correctPrice.description')
        },
        {
            icon: <img src="/icons/landing/betterExperience.png" className="w-28 h-28 object-contain" />,
            title: t('landing-page.benefits.items.betterExperience.title'),
            description: t('landing-page.benefits.items.betterExperience.description')
        }
    ];

    return (
        <section id="benefits" className="py-16 md:py-20 ">
            <div className="max-w-5xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-semibold text-center mx-auto text-white mb-6">
                    {t('landing-page.benefits.title')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="text-center bg-[#120826] rounded-lg p-4 mb-4">
                            <div className="p-6 rounded-full mx-auto flex items-center justify-center">
                                {benefit.icon}
                            </div>
                            <h3 className="text-xl font-normal text-white mb-4">{benefit.title}</h3>
                            <p className="text-[#919EAB] leading-relaxed">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Demo Section Component
const DemoSection: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section id="demo" className="md:py-10 ">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-semibold text-white mb-7 md:mb-12 text-center mx-auto ">{t('landing-page.demo.title')}</h2>

                <img src="/landing/demo.png" className="w-full max-w-[800px] mx-auto h-auto mb-16 relative" />
            </div>
        </section>
    );
};

// About Section Component
const AboutSection: React.FC = () => {
    const { t } = useTranslation();

    const features = [
        {
            icon: <img src="/icons/landing/protectedData.png" className="w-12 h-12" />,
            title: t('landing-page.about.features.protectedData')
        },
        {
            icon: <img src="/icons/landing/aiTechnology.png" className='w-12 h-12' />,
            title: t('landing-page.about.features.aiTechnology')
        },
        {
            icon: <img src="/icons/landing/localFocus.png" className='w-12 h-12' />,
            title: t('landing-page.about.features.localFocus')
        },
        {
            icon: <img src="/icons/landing/verifiedListings.png" className='w-12 h-12' />,
            title: t('landing-page.about.features.verifiedListings')
        }
    ];

    return (
        <section id="about" className="py-12 md:py-20 max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-stretch mx-4">
                {/* Left side - Blue card */}
                <div className="bg-gradient-to-br from-blue-500/50 to-purple-600/50 rounded-[18px] p-6 text-white">
                    <h2 className="text-3xl md:text-4xl font-medium mb-6">
                        {t('landing-page.about.title')}
                    </h2>
                    <p className="text-sm leading-relaxed mb-3">
                        {t('landing-page.about.description.paragraph1')}
                    </p>
                    <p className="text-sm leading-relaxed">
                        {t('landing-page.about.description.paragraph2')}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center bg-[#120826] rounded-lg">
                            <div className="mx-auto my-4 flex flex-col items-center">
                                {feature.icon}
                            </div>
                            <p className="text-slate-300 mx-3 text-sm leading-relaxed">
                                {feature.title}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Pricing Section Component
const PricingSection: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section id="pricing" className="py-12 md:py-20 max-w-5xl mx-auto w-full px-4">
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-medium text-white mb-6">
                    {t('landing-page.pricing.title')}
                </h2>
                <p className="text-sm text-slate-300 max-w-3xl mx-auto mb-2">
                    {t('landing-page.pricing.subtitle')}
                </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-stretch w-full gap-4 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 gap-2 md:gap-4">
                    {t('landing-page.pricing.features', { returnObjects: true }).map((text, index) => (
                        <p key={index} className="text-slate-300 text-center flex flex-row items-center justify-center px-6 py-4 rounded-lg bg-[#120826]">
                            {text}
                        </p>
                    ))}
                </div>
                <div className="rounded-lg bg-[#120826] p-8 text-center">
                    <h3 className="text-xl font-light text-white mb-4">{t('landing-page.pricing.plan.name')}</h3>
                    <span className="text-3xl font-light text-white ">{t('landing-page.pricing.plan.price')}</span>
                    <p className="text-[#919EAB] mt-3">{t('landing-page.pricing.plan.tokens')}</p>

                </div>
            </div>
        </section>
    );
};

// FAQ Section Component
const FAQSection: React.FC = () => {
    const { t } = useTranslation();
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    const faqs = [
        {
            question: t('landing-page.faq.items.tokens.question'),
            answer: t('landing-page.faq.items.tokens.answer')
        },
        {
            question: t('landing-page.faq.items.dataSafety.question'),
            answer: t('landing-page.faq.items.dataSafety.answer')
        },
        {
            question: t('landing-page.faq.items.buyerSeller.question'),
            answer: t('landing-page.faq.items.buyerSeller.answer')
        },
        {
            question: t('landing-page.faq.items.whyDoors.question'),
            answer: t('landing-page.faq.items.whyDoors.answer')
        }
    ];

    const seeAllButton = <button className="border-1 border-white text-white w-full md:w-fit px-16 py-2.5 rounded-md font-semibold text-md hover:border-purple-500 hover:bg-slate-800/50 transition-all">
        {t('landing-page.faq.seeAll')}
    </button>
    return (
        <section id="faq" className="py-12 md:py-20 mx-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-row items-center justify-center md:justify-between mb-4">
                    <h2 className="text-3xl md:text-4xl text-center font-medium text-white mb-6">
                        {t('landing-page.faq.title')}
                    </h2>
                    <div className='hidden md:block'>{seeAllButton}</div>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-[#120826] rounded-md">
                            <button
                                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                                className="w-full px-6 py-4 text-left flex items-center justify-between text-white hover:bg-slate-700/50 transition-colors rounded-md"
                            >
                                <span className="font-medium">{faq.question}</span>
                                <ChevronDown
                                    className={`w-5 h-5 transition-transform ${openFAQ === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>
                            {openFAQ === index && (
                                <div className="px-6 pb-4">
                                    <p className="text-slate-300 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className='md:hidden mx-auto flex flex-row justify-center'>{seeAllButton}</div>
                </div>

            </div>
        </section>
    );
};

// Final CTA Section Component
const FinalCTASection: React.FC = () => {
    const { data } = authClient.useSession();
    const { t } = useTranslation();

    return (
        <section className="py-5 min-h-[70dvh] md:min-h-fit relative flex flex-row bg-gradient-to-br items-center from-[#120826] to-[#32215A] from-[70%] md:to-[80%] max-w-5xl rounded-2xl mx-3 md:mx-auto mb-20 overflow-x-clip">
            <div>
                <img src="/landing/aiRealEstate.png" className="absolute left-[-10%] md:left-0 top-[0%] bottom-[10%] h-[70%] md:relative md:w-96 md:h-96 object-contain rounded-full scale-125 ml-12" />
                <div className="hidden md:block absolute top-0 left-0 w-full h-full bg-gradient-to-r rounded-2xl from-[#120826] to-transparent from-7% to-25%" />

            </div>

            <div className="max-w-4xl mx-auto px-6 text-center absolute bottom-[5%] md:relative z-10">
                <h2 className="text-4xl md:text-5xl font-medium text-white mb-6 leading-tight">
                    {t('landing-page.finalCta.title')}
                </h2>

                <p className="text-md text-slate-300 mb-2 max-w-2xl mx-auto">
                    {t('landing-page.finalCta.subtitle')}
                </p>

                <Link
                    to={data ? "/app" : "/auth/$path"}
                    params={data ? {} : { path: "sign-in" }}
                    className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-3 rounded-md font-semibold text-md hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl"
                >
                    {t('landing-page.finalCta.button')}
                </Link>
            </div>
        </section>
    );
};

// Footer Component
const Footer: React.FC = () => {
    const { t } = useTranslation();
    return (
        <footer className="bg-black relative py-5">
            <img src="/landing/footerAnimation.gif" loading='lazy' className="absolute z-0 top-0 left-0 right-0 mx-auto max-w-5xl w-full h-full object-cover object-center scale-[0.9] opacity-30" />
            <div className="max-w-5xl mx-auto px-6 relative">
                <div className="flex flex-row justify-between md:items-center mb-8">
                    {/* Logo */}
                    <div className="flex items-center space-x-2 -ml-4">
                        <img src="/doors-logo.png" className="w-28 h-16 object-cover object-center flex items-center justify-center" />
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-5">
                        {[
                            { text: t('landing-page.footer.navigation.benefits'), href: "#benefits" },
                            { text: t('landing-page.footer.navigation.demo'), href: "#demo" },
                            { text: t('landing-page.footer.navigation.pricing'), href: "#pricing" },
                            { text: t('landing-page.footer.navigation.faq'), href: "#faq" },
                        ].map(({ text, href }, index) => (
                            <a key={index} href={href} className="text-white hover:text-slate-400 text-sm transition-colors">{text}</a>
                        ))}
                    </div>
                </div>

                <h3 className="text-2xl md:text-4xl font-bold text-white mt-16 mb-12">
                    {t('landing-page.footer.slogan')}
                </h3>

                <div className="border-t border-slate-700 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-white text-xs mb-4 md:mb-0">
                            {t('landing-page.footer.copyright')}
                        </p>
                        <div className="flex space-x-6">
                            <a href="#" className="hover:text-slate-400 text-white text-xs transition-colors">{t('landing-page.footer.legal.terms')}</a>
                            <a href="#" className="hover:text-slate-400 text-white text-xs transition-colors">{t('landing-page.footer.legal.privacy')}</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

