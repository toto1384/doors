import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export interface PasswordInputProps extends Omit<React.ComponentProps<"input">, "type"> {
	showPasswordToggle?: boolean;
	label: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
	({ className, showPasswordToggle = true, id, label, ...props }, ref) => {
		const [showPassword, setShowPassword] = React.useState(false);

		const inputId = id || `floating-${label.replace(/\s+/g, "-").toLowerCase()}`;

		return (
			<div className="relative">
				<input
					ref={ref}
					id={inputId}
					className={cn(
						"px-4 pt-5 h-[50px]",
						"focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
						"peer block w-full appearance-none border-0 bg-[#241540] rounded-md text-base text-white ",
						className,
					)}
					placeholder=" "
					{...props}
				/>
				{/* <Input */}
				{/*   type={showPassword ? "text" : "password"} */}
				{/*   className={cn("pr-10", className)} */}
				{/*   ref={ref} */}
				{/*   {...props} */}
				{/* /> */}
				{showPasswordToggle && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="absolute right-0 top-0 h-full px-3 pt-2 hover:bg-transparent"
						onClick={() => setShowPassword((prev) => !prev)}
						disabled={props.disabled}
					>
						{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
						<span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
					</Button>
				)}
			</div>
		);
	},
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
