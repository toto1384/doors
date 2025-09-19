'use client';

import { Button } from 'components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { cn } from 'lib/utils';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';

interface LanguageToggleProps {
    className?: string;
    variant?: 'default' | 'outline' | 'ghost' | 'minimal';
}

export function LanguageToggle({ className, variant = 'ghost' }: LanguageToggleProps) {
    const { t } = useTranslation('translation', { keyPrefix: 'profile-page.language' });
    const locale = i18n.language

    const handleLanguageChange = (newLocale: string) => {
        i18n.changeLanguage(newLocale);
    };

    const currentLanguageName = locale === 'en' ? t('english') : t('romanian');

    if (variant === 'minimal') {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "h-8 px-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800",
                            className
                        )}
                    >
                        {locale.toUpperCase()}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[120px]">
                    <DropdownMenuItem
                        onClick={() => handleLanguageChange('ro')}
                        className={cn(
                            "cursor-pointer",
                            locale === 'ro' && "bg-slate-100 dark:bg-slate-800"
                        )}
                    >
                        🇷🇴 {t('romanian')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleLanguageChange('en')}
                        className={cn(
                            "cursor-pointer",
                            locale === 'en' && "bg-slate-100 dark:bg-slate-800"
                        )}
                    >
                        🇺🇸 {t('english')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={variant}
                    className={cn("flex items-center gap-2", className)}
                >
                    <Languages className="h-4 w-4" />
                    <span className="hidden sm:inline">{currentLanguageName}</span>
                    <span className="sm:hidden">{locale.toUpperCase()}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
                <DropdownMenuItem
                    onClick={() => handleLanguageChange('ro')}
                    className={cn(
                        "cursor-pointer flex items-center gap-2",
                        locale === 'ro' && "bg-slate-100 dark:bg-slate-800"
                    )}
                >
                    <span className="text-lg">🇷🇴</span>
                    <span>{t('romanian')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleLanguageChange('en')}
                    className={cn(
                        "cursor-pointer flex items-center gap-2",
                        locale === 'en' && "bg-slate-100 dark:bg-slate-800"
                    )}
                >
                    <span className="text-lg">🇺🇸</span>
                    <span>{t('english')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
