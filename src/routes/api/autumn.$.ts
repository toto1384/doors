import { createFileRoute } from "@tanstack/react-router";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { autumnHandler } from "autumn-js/tanstack";
import { auth } from "utils/auth";

const handler = autumnHandler({
	identify: async ({ request }) => {
		// get the user from your auth provider (example: better-auth)
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		return {
			customerId: session?.user.id,
			customerData: {
				name: session?.user.name,
				email: session?.user.email,
			},
		};
	},
});

export const ServerRoute = createServerFileRoute("/api/autumn/$").methods({
	GET: ({ request }) => {
		return handler.GET({ request, params: {} });
	},
	POST: ({ request }) => {
		return handler.POST({ request, params: {} });
	},
	PATCH: ({ request }) => {
		return handler.PATCH({ request, params: {} });
	},
	DELETE: ({ request }) => {
		return handler.DELETE({ request, params: {} });
	},
	PUT: ({ request }) => {
		return handler.PUT({ request, params: {} });
	},
});
