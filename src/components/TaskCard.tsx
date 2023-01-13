import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { TaskItem } from "./TaskItem"
import { Task } from "../utils/types"

export interface TaskCardProps {
  item: Task
}

export const TaskCard = ({ item }: TaskCardProps) => {
  const { id } = item
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="item py-3 mx-3 flex justify-between items-center p-2 hover:cursor-move"
    >
      <TaskItem item={item} />
    </div>
  )
}
