import { DndContext, DragOverlay } from "@dnd-kit/core"

import { useState } from "react"
import { Board } from "./Board"
import { Task } from "../utils/types"
import { TaskItem } from "./TaskItem"
import { TaskCardProps } from "./TaskCard"
import { useDefaultSensors } from "../hooks/useDefaultSensors"
import {
  handleDragCancel,
  handleDragEnd,
  handleDragOver,
  handleDragStart,
} from "../utils/handlers"

interface KanbanProps {
  boards: string[]
  itemField: string
  itemComponent: React.FC<TaskCardProps>
  items: Task[]
  onChange: (message: string) => void
}

export const Kanban = ({
  boards,
  itemField,
  itemComponent,
  items,
  onChange,
}: KanbanProps) => {
  let defaultItems = {}
  for (const key of boards) {
    ;(defaultItems as Record<string, Task[]>)[key] = items.filter(
      (item) => key === (item as any)[itemField]
    )
  }
  const [taskGroups, setTaskGroups] =
    useState<Record<string, Task[]>>(defaultItems)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [overBoardId, setOverBoardId] = useState<string | null>(null)

  const sensors = useDefaultSensors()

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => handleDragStart(e, taskGroups, setActiveTask)}
      onDragCancel={() => handleDragCancel(setActiveTask, setOverBoardId)}
      onDragOver={(e) =>
        handleDragOver(e, setOverBoardId, setTaskGroups, onChange)
      }
      onDragEnd={(e) =>
        handleDragEnd(
          e,
          setActiveTask,
          setOverBoardId,
          setTaskGroups,
          taskGroups
        )
      }
    >
      <div className="w-screen  min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 ">
        <div className="flex p-8 ">
          <div className="w-full m-2 flex justify-between ">
            {Object.entries(taskGroups).map(([name, items]) => {
              return (
                <Board
                  key={name}
                  id={name}
                  items={items}
                  ItemComponent={itemComponent}
                  overBoardId={overBoardId}
                />
              )
            })}
          </div>
        </div>
      </div>
      <DragOverlay>
        {activeTask ? <TaskItem item={activeTask} dragOverlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}
