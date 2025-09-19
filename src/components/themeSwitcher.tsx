'use client';
import { useEffect, useState } from 'react';
import { useTheme } from './providers/ThemeProvider';

export default function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }
    return (
        <div>
            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="mx-5 my-5 text-3xl"
            >
                {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
        </div>
    );
}
