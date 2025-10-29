import { cn } from "@/lib/utils";


export function ImageFallback({ src, className, ...props }: { src: string, className?: string } & any) {
    return <img
        src={src}
        onError={(e) => {
            (e.target as any).src = '/icons/homeIcon.svg';
            (e.target as any).classList.remove('object-cover');
            (e.target as any).classList.add('object-contain')
        }}
        className={cn(className, src ? '' : 'object-contain')}
        {...props}
    />
}
