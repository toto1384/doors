
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Search, Bot, Zap, Eye, DollarSign, Home, Star, ArrowRight, Menu, X } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from "src/components/headerLanding";
import { useTRPC } from 'trpc/react';
import { authClient } from 'utils/auth-client';


export const Route = createFileRoute('/')({
    component: HomePage,
})


function HomePage() {

    return (
        <>
            <Header />
            <HeroSection />
            <FeaturesSection />
            <DemoSection />
            <PricingSection />
            <Footer />
        </>
    );
}




// Hero Section Component
const HeroSection: React.FC = () => {
    const { t: heroT } = useTranslation('translation', { keyPrefix: 'landing-page.hero', });

    const trpc = useTRPC()

    const response = useQuery(trpc.guitars.list.queryOptions())


    const { data } = authClient.useSession()


    return (
        <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20 text-center relative z-10">
                <div className="mb-8 inline-block">
                    <span className="bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text text-sm font-semibold uppercase tracking-wider">
                        {heroT('badge')}
                        {response.status}
                        {response.data ?? 10000}
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    {heroT('title.line1')}
                    <span className="bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text"> {heroT('title.line2')}</span>
                </h1>

                <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                    {heroT('description')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">

                    {data ? <Link
                        to="/app"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl"
                    >
                        Go to App
                    </Link> : <Link
                        to="/auth/$path"
                        params={{ path: "sign-in" }}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl"
                    >
                        {heroT('buttons.getStarted')}
                    </Link>}
                    <button className="border-2 border-slate-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:border-slate-400 hover:bg-slate-800/50 transition-all">
                        {heroT('buttons.watchDemo')}
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-2">{heroT('stats.properties')}</div>
                        <div className="text-slate-400">{heroT('stats.propertiesLabel')}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-2">{heroT('stats.satisfaction')}</div>
                        <div className="text-slate-400">{heroT('stats.satisfactionLabel')}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-2">{heroT('stats.support')}</div>
                        <div className="text-slate-400">{heroT('stats.supportLabel')}</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Features/Pitch Section Component
const FeaturesSection: React.FC = () => {
    const { t: featuresT } = useTranslation('translation', { keyPrefix: 'landing-page.features' });

    const features = [
        {
            icon: <Bot className="w-8 h-8" />,
            title: featuresT('items.aiAssistant.title'),
            description: featuresT('items.aiAssistant.description')
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: featuresT('items.lightningSearch.title'),
            description: featuresT('items.lightningSearch.description')
        },
        {
            icon: <Star className="w-8 h-8" />,
            title: featuresT('items.personalizedListings.title'),
            description: featuresT('items.personalizedListings.description')
        },
        {
            icon: <Eye className="w-8 h-8" />,
            title: featuresT('items.transparentPricing.title'),
            description: featuresT('items.transparentPricing.description')
        }
    ];

    return (
        <section id="features" className="py-20 bg-slate-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {featuresT('title.prefix')}
                        <span className="bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">{featuresT('title.brand')}</span>
                        {featuresT('title.suffix')}
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        {featuresT('subtitle')}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="group relative">
                            <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 h-full hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
                                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4 rounded-xl mb-6 w-fit group-hover:shadow-2xl group-hover:shadow-purple-500/25 transition-all">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Demo Preview Section Component
const DemoSection: React.FC = () => {
    const { t: demoT } = useTranslation('translation', { keyPrefix: 'landing-page.demo' });
    return (
        <section id="demo" className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {demoT('title.prefix')}<span className="bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">{demoT('title.highlight')}</span>
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        {demoT('subtitle')}
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Demo Content */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8">
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-slate-700 rounded-2xl rounded-tl-sm p-4 max-w-md">
                                    <p className="text-white">{demoT('conversation.aiGreeting')}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 flex-row-reverse">
                                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-sm">U</span>
                                </div>
                                <div className="bg-blue-600 rounded-2xl rounded-tr-sm p-4 max-w-md">
                                    <p className="text-white">{demoT('conversation.userRequest')}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-slate-700 rounded-2xl rounded-tl-sm p-4 max-w-md">
                                    <p className="text-white">{demoT('conversation.aiResponse')}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 flex-row-reverse">
                                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-sm">U</span>
                                </div>
                                <div className="bg-blue-600 rounded-2xl rounded-tr-sm p-4 max-w-md">
                                    <p className="text-white">{demoT('conversation.userFollowup')}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-slate-700 rounded-2xl rounded-tl-sm p-4 max-w-md">
                                    <p className="text-white">{demoT('conversation.aiFinal')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Pricing Section Component
const PricingSection: React.FC = () => {
    const { t: pricingT } = useTranslation('translation', { keyPrefix: 'landing-page.pricing' });
    const pricingTiers = [
        {
            name: pricingT('plans.explorer.name'),
            price: pricingT('plans.explorer.price'),
            tokens: pricingT('plans.explorer.tokens'),
            features: pricingT('plans.explorer.features', { returnObjects: true })
        },
        {
            name: pricingT('plans.professional.name'),
            price: pricingT('plans.professional.price'),
            tokens: pricingT('plans.professional.tokens'),
            features: pricingT('plans.professional.features', { returnObjects: true }),
            popular: true,
            badge: pricingT('plans.professional.badge')
        },
        {
            name: pricingT('plans.premium.name'),
            price: pricingT('plans.premium.price'),
            tokens: pricingT('plans.premium.tokens'),
            features: pricingT('plans.premium.features', { returnObjects: true })
        }
    ];

    return (
        <section id="pricing" className="py-20 bg-slate-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {pricingT('title.simple')}<span className="bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">{pricingT('title.transparent')}</span>{pricingT('title.suffix')}
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        {pricingT('subtitle')}
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {pricingTiers.map((tier, index) => (
                        <div key={index} className={`relative group ${tier.popular ? 'scale-105' : ''}`}>
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                                        {tier.badge}
                                    </span>
                                </div>
                            )}
                            <div className={`bg-slate-700/50 backdrop-blur-sm border rounded-2xl p-8 h-full hover:transform hover:scale-105 transition-all duration-300 ${tier.popular ? 'border-purple-500/50 shadow-2xl shadow-purple-500/10' : 'border-slate-600/50 hover:border-purple-500/50'
                                }`}>
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold text-white">{tier.price}</span>
                                        {tier.price !== "Free" && <span className="text-slate-400">/month</span>}
                                    </div>
                                    <p className="text-slate-300">{tier.tokens}</p>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {(tier.features as any).map((feature: any, featureIndex: number) => (
                                        <li key={featureIndex} className="flex items-center text-slate-300">
                                            <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                                                <ArrowRight className="w-3 h-3 text-white" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button className={`w-full py-4 rounded-xl font-semibold transition-all ${tier.popular
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg'
                                    : 'border-2 border-slate-600 text-white hover:border-purple-500 hover:bg-slate-800/50'
                                    }`}>
                                    {pricingT('button')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-slate-400">
                        {pricingT('contact.text')}<a href="#" className="text-purple-400 hover:text-purple-300 underline">{pricingT('contact.link')}</a>
                    </p>
                </div>
            </div>
        </section>
    );
};

// Footer Component
const Footer: React.FC = () => {
    const { t: footerT } = useTranslation('translation', { keyPrefix: 'landing-page.footer' });
    return (
        <footer className="bg-slate-900 border-t border-slate-700/50 py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                                <Home className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">{footerT('brand')}</span>
                        </div>
                        <p className="text-slate-300 mb-6 max-w-md">
                            {footerT('description')}
                        </p>
                        <div className="flex space-x-4">
                            <div className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                                <span className="text-white text-sm">tw</span>
                            </div>
                            <div className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                                <span className="text-white text-sm">li</span>
                            </div>
                            <div className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                                <span className="text-white text-sm">fb</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">{footerT('sections.about.title')}</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-slate-300 hover:text-white transition-colors">{footerT('sections.about.links.story')}</a></li>
                            <li><a href="#" className="text-slate-300 hover:text-white transition-colors">{footerT('sections.about.links.team')}</a></li>
                            <li><a href="#" className="text-slate-300 hover:text-white transition-colors">{footerT('sections.about.links.careers')}</a></li>
                            <li><a href="#" className="text-slate-300 hover:text-white transition-colors">{footerT('sections.about.links.press')}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">{footerT('sections.support.title')}</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-slate-300 hover:text-white transition-colors">{footerT('sections.support.links.contact')}</a></li>
                            <li><a href="#" className="text-slate-300 hover:text-white transition-colors">{footerT('sections.support.links.help')}</a></li>
                            <li><a href="#" className="text-slate-300 hover:text-white transition-colors">{footerT('sections.support.links.privacy')}</a></li>
                            <li><a href="#" className="text-slate-300 hover:text-white transition-colors">{footerT('sections.support.links.terms')}</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-700 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-slate-400 text-sm">
                            {footerT('copyright')}
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">{footerT('legal.legal')}</a>
                            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">{footerT('legal.privacy')}</a>
                            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">{footerT('legal.cookies')}</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

