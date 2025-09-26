'use client';
import { useEffect, useState } from 'react';
import { useTheme } from './providers/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const isDark = theme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="relative inline-flex items-center w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
            aria-label="Toggle theme"
        >
            {/* Switch track */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 dark:from-indigo-600 dark:to-purple-600 transition-all duration-300 ease-in-out" />

            {/* Switch handle */}
            <div
                className={`
                    relative inline-block w-5 h-5 rounded-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out
                    ${isDark ? 'translate-x-8' : 'translate-x-1'}
                `}
            >
                {/* Icon container */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {isDark ? (
                        <Moon className="w-3 h-3 text-indigo-600" />
                    ) : (
                        <Sun className="w-3 h-3 text-amber-500" />
                    )}
                </div>
            </div>

            {/* Background icons */}
            <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
                <Sun className={`w-3 h-3 transition-opacity duration-300 ${isDark ? 'opacity-40 text-white' : 'opacity-0'}`} />
                <Moon className={`w-3 h-3 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-40 text-white'}`} />
            </div>
        </button>
    );
}
