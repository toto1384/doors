import { z } from 'zod/v3';
import { extendZod } from "@zodyac/zod-mongoose";

extendZod(z as any);


export const zDate = z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
    if (arg == undefined) return arg
}, z.date())


