import { useEffect, useMemo, useState } from "react";

export type Size = "sm" | "md" | "lg" | "xl" | 'xs'

export const useSizeAlt = <T extends boolean | undefined>(rich?: T): (T extends true ? {
    size: Size, lmd: boolean, llg: boolean, gmd: boolean, gsm: boolean,
} : Size) => {
    function getResize() {
        if (typeof window === 'undefined') return 'sm'
        if (window.innerWidth >= 1280) {
            return ('xl')
        } else if (window.innerWidth >= 1024) {
            return ('lg')
        } else if (window.innerWidth >= 768) {
            return ('md')
        } else if (window.innerWidth >= 600) {
            return ('sm')
        } else {
            return ('xs')
        }
    }
    const [size, setWindowDimensions] = useState<Size>(getResize);
    useEffect(() => {
        const handleResize = () => { setWindowDimensions(getResize()) }
        window.addEventListener('resize', handleResize);
        return (): void => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount

    return (rich ? {
        size,
        lmd: size === 'xs' || size === 'sm',
        llg: size === 'xs' || size === 'sm' || size === 'md',
        gmd: size === 'lg' || size === 'xl',
        gsm: size !== 'xs' && size !== 'sm'
    } : size) as any;
};

export const useSize = <T extends boolean | undefined>(rich?: T): (T extends true ? {
    size: Size, lmd: boolean, llg: boolean, gmd: boolean, gsm: boolean,
} : Size) => {
    const [size, setWindowDimensions] = useState<Size>('sm');

    useEffect(() => {
        function handleResize(): void {
            if (window.innerWidth >= 1280) setWindowDimensions('xl');
            else if (window.innerWidth >= 1024) setWindowDimensions('lg');
            else if (window.innerWidth >= 768) setWindowDimensions('md');
            else if (window.innerWidth >= 600) setWindowDimensions('sm');
            else setWindowDimensions('xs');
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return useMemo(() => {
        if (rich) {
            return {
                size,
                lmd: size === 'xs' || size === 'sm',
                llg: size === 'xs' || size === 'sm' || size === 'md',
                gmd: size === 'lg' || size === 'xl',
                gsm: size !== 'xs' && size !== 'sm'
            } as any;
        }
        return size as any;
    }, [size, rich]);
};

