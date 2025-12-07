import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/src/components/ui/button";

export interface FloatingPasswordInputProps extends Omit<React.ComponentProps<"input">, "type" | "placeholder"> {
	label: string;
	error?: string;
	showPasswordToggle?: boolean;
}

const FloatingPasswordInput = React.forwardRef<HTMLInputElement, FloatingPasswordInputProps>(
	({ className, label, id, showPasswordToggle = true, ...props }, ref) => {
		const [showPassword, setShowPassword] = React.useState(false);
		const inputId = id || `floating-${label.replace(/\s+/g, "-").toLowerCase()}`;

		return (
			<div className="flex flex-col">
				<div className="group relative w-full">
					<input
						ref={ref}
						id={inputId}
						type={showPassword ? "text" : "password"}
						className={cn(
							"px-4 pt-5 h-[50px]",
							"focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
							"peer block w-full appearance-none border-0 bg-[#241540] rounded-md text-base text-white",
							showPasswordToggle && "pr-12",
							className,
						)}
						placeholder=" "
						{...props}
					/>
					<label
						htmlFor={inputId}
						className={cn(
							"text-sm text-[#637381] absolute top-4 left-4 origin-[0]",
							"-translate-y-2 scale-75 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2 peer-focus:scale-75",
						)}
					>
						{label}
					</label>
					{showPasswordToggle && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 px-0 py-0 hover:bg-transparent text-[#637381] hover:text-white"
							onClick={() => setShowPassword((prev) => !prev)}
							disabled={props.disabled}
						>
							{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
							<span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
						</Button>
					)}
				</div>

				{props.error && <p className="mt-1 text-sm text-red-500">{props.error}</p>}
			</div>
		);
	},
);
FloatingPasswordInput.displayName = "FloatingPasswordInput";

export { FloatingPasswordInput };
