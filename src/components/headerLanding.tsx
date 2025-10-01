'use client';

import React, { useState, useEffect } from 'react';
import { Home, Menu, X } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useTRPC } from 'trpc/react';
import { SignedIn, SignedOut } from '@daveyplate/better-auth-ui';
import { authClient } from 'utils/auth-client';
import { LanguageToggle, LanguageToggleVariant } from './language-toggle';

// Header Component
export const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const trpc = useTRPC()

    const { t } = useTranslation('translation', { keyPrefix: 'landing-page' });

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const { data } = authClient.useSession()

    return (
        <header className={`fixed top-0 w-screen z-50 transition-all duration-300 ${isScrolled
            ? 'bg-[#120826] backdrop-blur-md border-b border-slate-700/50'
            : 'bg-transparent'
            }`}>
            <div className="max-w-[1000px] mx-auto md:px-6 py-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <img src="/doors-logo.png" className="w-28 h-16 object-cover object-center flex items-center justify-center" />
                    </div>

                    <nav className='space-x-7 hidden md:block'>
                        <Link to={"#beneficii" as any} className="hover:text-slate-300 transition-colors">Beneficii</Link>
                        <Link to={"#demo" as any} className="hover:text-slate-300 transition-colors">Demo</Link>
                        <Link to={"#prețuri" as any} className="hover:text-slate-300 transition-colors">Prețuri</Link>
                        <Link to={"#întrebări" as any} className="hover:text-slate-300 transition-colors">Întrebări</Link>

                    </nav>

                    <nav className="hidden md:flex items-center space-x-8">
                        <LanguageToggleVariant />
                    </nav>

                    <button
                        className="md:hidden text-white mr-4"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-slate-700 bg-[#120826]/50 backdrop-blur-md p-3 rounded">
                        <div className="flex flex-col space-y-4 mt-4">
                            <Link to={"#beneficii" as any} className="hover:text-slate-300 transition-colors">Beneficii</Link>
                            <Link to={"#demo" as any} className="hover:text-slate-300 transition-colors">Demo</Link>
                            <Link to={"#prețuri" as any} className="hover:text-slate-300 transition-colors">Prețuri</Link>
                            <Link to={"#întrebări" as any} className="hover:text-slate-300 transition-colors">Întrebări</Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

