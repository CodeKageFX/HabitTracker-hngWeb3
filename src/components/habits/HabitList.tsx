import { Habit } from "@/types/habit"
import HabitCard from "./HabitCard"

interface HabitListProps {
  habits: Habit[]
}

const HabitList = ({habits}: HabitListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {habits.map((habit)=> {
        return (
          <HabitCard key={habit.id} habit={habit} />
        )
      })}
    </div>
  )
}

export default HabitList