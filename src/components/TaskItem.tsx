import { Task } from "../utils/types"

interface TaskItemProps {
  item: Task
  dragOverlay?: boolean
}
export const TaskItem = ({ item, dragOverlay }: TaskItemProps) => {
  const { title, description, priority } = item
  return (
    <div
      className={`${
        dragOverlay && "cursor-grabbing drop-shadow-lg "
      } w-full bg-gray-100 p-3 rounded-md outline-none hover:ring ring-pink-500`}
    >
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="font-base mb-3">{description}</p>
      <span className="text-sm text-black/40">Priority: {priority}</span>
    </div>
  )
}
