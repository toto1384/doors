import * as React from "react";
import { cn } from "@/lib/utils";

export interface FloatingInputProps
    extends Omit<React.ComponentProps<"input">, "placeholder"> {
    label: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
    ({ className, label, id, ...props }, ref) => {
        const inputId = id || `floating-${label.replace(/\s+/g, '-').toLowerCase()}`;

        return (
            <div className="group relative w-full">
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        "px-4 pt-5 h-[50px]",
                        "focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                        "peer block w-full appearance-none border-0 bg-[#241540] rounded-md text-base text-white ",
                        className
                    )}
                    placeholder=" "
                    {...props}
                />
                <label
                    htmlFor={inputId}
                    className={cn(
                        "text-sm text-[#637381] absolute top-4 left-4 origin-[0]",
                        " -translate-y-2 scale-75 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2 peer-focus:scale-75 "
                    )}
                >
                    {label}
                </label>
            </div>
        );
    }
);
FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
