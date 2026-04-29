export interface Habit {
    id: string,
    userId: string,
    name: string,
    description: string,
    frequency: "daily",
    createdAt: string,
    completions: string[]
}