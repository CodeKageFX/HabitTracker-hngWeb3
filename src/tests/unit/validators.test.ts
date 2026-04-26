import { describe, it, expect } from "vitest";
import { validateHabitName } from "../../lib/validators";

describe("validateHabitName", ()=> {
    it("returns an error when habit name is empty", ()=> {
        expect(validateHabitName("")).toEqual({
            "error": "Habit name is required",
            "valid": false,
            "value": ""
        })
    })
    it("returns an error when habit name exceeds 60 characters", ()=> {
        const longName = "a".repeat(61)
        expect(validateHabitName(longName)).toEqual({
            "error": "Habit name must be 60 characters or fewer",
            "valid": false,
            "value": longName
        })
    })
    it("returns a trimmed value when habit name is valid", ()=> {
        expect(validateHabitName("Drink Water ")).toEqual({
            "error": null,
            "valid": true,
            "value": "Drink Water"
        })
    })
})