export function calculateCurrentStreak(completions: string[], currentDate?: string): number {
    const today = currentDate ?? new Date().toISOString().split("T")[0]
    const unique = [...new Set(completions)]

    if (!completions.includes(today)) return 0

    let streak = 0
    const [y, m, d] = today.split("-").map(Number)
    const current = new Date(y, m - 1, d)

    while (true) {
        const formatted = [
            current.getFullYear(),
            String(current.getMonth() + 1).padStart(2, "0"),
            String(current.getDate()).padStart(2, "0")
        ].join("-")

        if (!unique.includes(formatted)) break

        streak++
        current.setDate(current.getDate() - 1)
    }

    return streak
}