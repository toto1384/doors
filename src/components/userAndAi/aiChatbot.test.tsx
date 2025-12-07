import { act, cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useConversation } from "@/utils/hooks/mockElevenlabsHook";
import { renderWithRouter } from "../../../setupTests.tsx";
import { Route as PropertyAddRoute } from "@/src/routes/app/properties/add";
import AppRouteWrapper from "../appWrapper.tsx";

vi.mock("@elevenlabs/react", async (original) => {
	const originalImport: any = await original();

	return {
		...originalImport,
		useConversation: vi.fn(useConversation({ flow: "seller" })),
	};
});

vi.mock("utils/auth-client", () => ({
	authClient: {
		useSession: vi.fn(() => ({
			data: {
				user: {
					id: "test-user-id",
					name: "Test User",
					email: "test@example.com",
					userType: "buyer",
				},
			},
			isPending: false,
		})),
	},
}));

const PropertyAdd = PropertyAddRoute.options.component as () => ReactNode;

describe("AI Chatbot", () => {
	let file: File;

	beforeEach(() => {
		file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });
	});

	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});
	it.skip("should render the AI Chatbot component", async () => {
		await renderWithRouter(
			<>
				<AppRouteWrapper token="test">
					<PropertyAdd />
				</AppRouteWrapper>
			</>,
			{
				initialLocation: "/app/properties/add",
				mockRoute: {
					path: "/app/properties/add", // restricted to available route paths
					loaderData: undefined, // fully typed
				},
			},
		);

		const startButton = screen.queryByText("Start Conversation");

		await waitFor(() => {
			expect(startButton).toBeInTheDocument();
		});

		await act(async () => {
			startButton?.click();
		});

		const houseButton = screen.queryByText("House", { selector: "button" });

		expect(houseButton).toBeInTheDocument();

		await act(async () => {
			houseButton?.click();
		});

		console.log("screen", screen.getAllByText("Electric"));
		const electricButton = screen.queryByText("Electric");

		expect(electricButton).toBeInTheDocument();

		await act(async () => {
			electricButton?.click();
		});

		const facilityButtons = ["Parking", "Air Conditioning", "Central Heating", "Furnished"];

		for (const buttonText of facilityButtons) {
			const button = screen.queryByText(buttonText);
			expect(button).toBeInTheDocument();
			await act(async () => {
				button?.click();
			});
		}

		const doneButton = screen.queryByText("Done");

		expect(doneButton).toBeInTheDocument();

		await act(async () => {
			doneButton?.click();
		});

		const doneButton2 = screen.queryByTestId("submit-done");

		console.log("doneButton2", doneButton2);

		expect(doneButton2).toBeInTheDocument();

		await act(async () => {
			doneButton2?.click();
		});

		const browseButtom = screen.queryByText("Browse");
		expect(browseButtom).toBeInTheDocument();

		const uploader = screen.getByTestId("image-upload-input");

		// simulate upload event and wait until finish
		await waitFor(() =>
			fireEvent.change(uploader, {
				target: { files: [file] },
			}),
		);

		// check if the file is there
		expect(uploader).toBeInTheDocument();
		expect((uploader as any)?.files?.[0].name).toBe("chucknorris.png");
		expect((uploader as any)?.files?.length).toBe(1);

		const doneButton3 = screen.queryByTestId("done-image-button");

		expect(doneButton3).toBeInTheDocument();

		await act(async () => {
			doneButton3?.click();
		});
	});
});
