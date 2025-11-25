import { expect, it } from "vitest"
import { bypassLimitations } from "./constants"
import { describe } from "vitest"



describe('utils', () => {
    it('should not be under testing', () => {
        expect(bypassLimitations).toBe(false)
    })
})
