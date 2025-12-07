import { cleanup, RenderOptions, render, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, expect } from "vitest";
import "@testing-library/jest-dom/vitest";

import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	RegisteredRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { TRPCWrapper } from "@/src/components/providers/TrpcWrapper.tsx";
import i18n from "./src/components/i18n";

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
	cleanup();
});

beforeEach(() => {
	i18n.changeLanguage("en");
});

// Mock authClient
import { vi } from "vitest";
import { ThemeProvider } from "@/src/components/providers/ThemeProvider";

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

// Mock useUploadThingCompressed
vi.mock("utils/uploadthingUtils", () => ({
	useUploadThingCompressed: vi.fn(() => ({
		startUpload: vi
			.fn()
			.mockResolvedValue([{ ufsUrl: "https://example.com/image1.jpg" }, { ufsUrl: "https://example.com/image2.jpg" }]),
		isUploading: false,
	})),
}));

beforeAll(() => {
	global.ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	};

	// Mock navigator.mediaDevices.getUserMedia
	Object.defineProperty(global.navigator, "mediaDevices", {
		writable: true,
		value: {
			getUserMedia: vi.fn().mockResolvedValue({
				getTracks: () => [],
				getVideoTracks: () => [],
				getAudioTracks: () => [],
			}),
		},
	});

	// Mock URL.createObjectURL
	global.URL.createObjectURL = vi.fn(() => "mocked-object-url");
	global.URL.revokeObjectURL = vi.fn();
});

type Routes = RegisteredRouter["routesByPath"];

interface MockedRouterProps<T extends keyof Routes = keyof Routes> {
	initialLocation?: string;
	mockRoute?: MockRoute<T>;
	children: React.ReactNode;
}

export type MockRoute<T extends keyof Routes> = {
	path: T;
	loaderData?: Routes[T] extends { types: { loaderData: infer LoaderData } } ? LoaderData : never;
	context?: Routes[T] extends { types: { routeContext: infer Context } } ? Context : never;
};

/**
 * Router wrapper component for use with renderHook and testing
 */
export const MockedRouter: React.FC<MockedRouterProps> = ({ initialLocation = "/", mockRoute, children }) => {
	const memoryHistory = createMemoryHistory({
		initialEntries: [initialLocation],
	});

	const testRouteTree = createRootRoute({
		component: () => (mockRoute ? <Outlet /> : children),
	});

	if (mockRoute) {
		testRouteTree.addChildren([
			createRoute({
				getParentRoute: () => testRouteTree,
				path: mockRoute.path,
				component: () => children,
				beforeLoad: () => mockRoute.context,
				loader: () => mockRoute.loaderData,
				notFoundComponent(props) {
					return <div>Not found {JSON.stringify(props.data)}</div>;
				},
			}),
		]);
	}

	const router = createRouter({
		routeTree: testRouteTree,
		defaultPendingMs: 0,
		history: memoryHistory,
	});

	return <RouterProvider router={router} />;
};

export const renderWithRouter = async <R extends keyof Routes>(
	component: React.ReactElement,
	{
		initialLocation = "/",
		mockRoute,
		...options
	}: { initialLocation?: string; mockRoute?: MockRoute<R> } & RenderOptions = {},
): Promise<void> => {
	render(
		<MockedRouter initialLocation={initialLocation} mockRoute={mockRoute}>
			<ThemeProvider theme={"dark"}>
				<TRPCWrapper>{component}</TRPCWrapper>
			</ThemeProvider>
		</MockedRouter>,
		options,
	);

	await waitFor(() => {
		// TSR renders async, so we wait for it here
		expect(document.body).toBeInTheDocument();
	});
};
