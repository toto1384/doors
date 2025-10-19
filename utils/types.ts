import { LocationSchema, } from "./validation/location";

import { z } from 'zod/v3'


export type LocationObject = z.infer<typeof LocationSchema>;


