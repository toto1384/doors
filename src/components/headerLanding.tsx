'use client';

import React, { useState } from 'react';
import { Home, Menu, X } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useTRPC } from 'trpc/react';
import { SignedIn, SignedOut } from '@daveyplate/better-auth-ui';

// Header Component
export const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const trpc = useTRPC()

    const { t } = useTranslation('translation', { keyPrefix: 'landing-page' });

    return (
        <header className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                            <Home className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">{t('footer.brand')}</span>
                    </div>

                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to={"#features" as any} className="text-slate-300 hover:text-white transition-colors">{t('navigation.features')}</Link>
                        <Link to={"#demo" as any} className="text-slate-300 hover:text-white transition-colors">{t('navigation.demo')}</Link>
                        <Link to={"#pricing" as any} className="text-slate-300 hover:text-white transition-colors">{t('navigation.pricing')}</Link>
                        <SignedOut>
                            <Link
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                                to={"/auth/sign-in" as any}
                            >
                                {t('hero.buttons.getStarted')}
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <Link
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                                to={"/app" as any}
                            >
                                Go to App
                            </Link>
                        </SignedIn>
                    </nav>

                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-slate-700">
                        <div className="flex flex-col space-y-4 mt-4">
                            <Link to={"#features" as any} className="text-slate-300 hover:text-white transition-colors">{t('navigation.features')}</Link>
                            <Link to={"#demo" as any} className="text-slate-300 hover:text-white transition-colors">{t('navigation.demo')}</Link>
                            <Link to={"#pricing" as any} className="text-slate-300 hover:text-white transition-colors">{t('navigation.pricing')}</Link>
                            <SignedOut>
                                <Link
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                                    to={"/auth/$path"} params={{ path: "sign-in" }}
                                >
                                    {t('hero.buttons.getStarted')}
                                </Link>
                            </SignedOut>
                            <SignedIn>
                                <Link
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                                    to={"/app" as any}
                                >
                                    Go to App
                                </Link>
                            </SignedIn>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

