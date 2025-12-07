import { usePaywall } from "autumn-js/react";
import { cn } from "@/lib/utils";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/src/components/ui/dialog";
import { getPaywallContent } from "@/src/lib/autumn/paywall-content";

export interface PaywallDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	featureId: string;
	entityId?: string;
	onClick?: () => void;
	title?: string;
	message?: string;
	buttonText?: string;
}

export default function PaywallDialog(params?: PaywallDialogProps) {
	const { data: preview } = usePaywall({
		featureId: params?.featureId,
		entityId: params?.entityId,
	});

	if (!params || !preview) {
		return <></>;
	}

	const { open, setOpen } = params;
	const { title, message } = getPaywallContent(preview);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="p-0 pt-4 gap-0 text-foreground overflow-hidden text-sm bg-[#1A0F33]">
				<DialogTitle className={cn("font-bold text-xl px-6")}>{params.title ?? title}</DialogTitle>
				<div className="px-6 my-2">{params.message ?? message}</div>
				<DialogFooter className="flex flex-col sm:flex-row justify-between gap-x-4 py-2 mt-4 pl-6 pr-3 border-t">
					<Button
						size="lg"
						className="font-medium shadow transition min-w-20 bg-gradient-to-br from-[#4C7CED] to-[#7B31DC] text-white rounded-[6px]"
						onClick={async () => {
							setOpen(false);
							if (params?.onClick) params.onClick();
						}}
					>
						{params?.buttonText ?? "Confirm"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
