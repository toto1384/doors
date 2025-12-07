import { createFileRoute } from "@tanstack/react-router";
import { createServerFileRoute } from "@tanstack/react-start/server";
// import { createAPIFileRoute } from "@tanstack/start/api";

import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "@/utils/uploadThing";

const handlers = createRouteHandler({ router: uploadRouter });

// export const Route = createAPIFileRoute("/api/uploadthining")({
//     GET: handlers,
//     POST: handlers,
// });
//
//

export const ServerRoute = createServerFileRoute("/api/uploadthing").methods({
	GET: handlers,
	POST: handlers,
});
