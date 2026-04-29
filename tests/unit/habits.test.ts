import { describe, it, expect } from "vitest";
import { toggleHabitCompletion } from "../../src/lib/habits";


const habit = {
    id: "1",
    userId: "anything",
    name: "Drink Water",
    description: "just drink water",
    frequency: "daily" as const,
    createdAt: "2026-04-26",
    completions: ["2026-04-25"]
}
describe("toggleHabitCompletion", ()=> {
    it("adds a completion date when the date is not present", ()=> {
        expect(toggleHabitCompletion({
            id: "1",
            userId: "anything",
            name: "Drink Water",
            description: "just drink water",
            frequency: "daily",
            createdAt: "2026-04-26",
            completions: []
        }, "2026-04-26")).toEqual({
            id: "1",
            userId: "anything",
            name: "Drink Water",
            description: "just drink water",
            frequency: "daily",
            createdAt: "2026-04-26",
            completions: ["2026-04-26"]
        })
    })
    it("removes a completion date when the date already exists", ()=> {
        expect(toggleHabitCompletion({
            id: "1",
            userId: "anything",
            name: "Drink Water",
            description: "just drink water",
            frequency: "daily",
            createdAt: "2026-04-26",
            completions: ["2026-04-26"]
        }, "2026-04-26")).toEqual({
            id: "1",
            userId: "anything",
            name: "Drink Water",
            description: "just drink water",
            frequency: "daily",
            createdAt: "2026-04-26",
            completions: []
        })
    })
    it("does not mutate the original habit object", ()=> {
        const result = toggleHabitCompletion(habit, "2026-04-26")
        expect(habit.completions).toEqual(["2026-04-25"])
        expect(result.completions).toEqual(["2026-04-25", "2026-04-26"])
    })
    it("does not return duplicate completion dates", ()=> {
        const duplicates = {...habit, completions: ["2026-04-25", "2026-04-25"]}
        const result = toggleHabitCompletion(duplicates, "2026-04-26")
        expect(result.completions).toEqual(["2026-04-25", "2026-04-26"])
    })
})