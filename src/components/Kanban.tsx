import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core"

import { useState } from "react"
import {
  arrayMove,
  insertAtIndex,
  removeAtIndex,
} from "../utils/arrayOperations"
import { Board } from "./Board"
import { Task } from "../utils/types"
import { TaskItem } from "./TaskItem"
import { TaskCardProps } from "./TaskCard"
import { useDefaultSensors } from "../hooks/useDefaultSensors"

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

  const handleDragStart = ({ active }: DragStartEvent) => {
    const activeBoard = active.data.current?.sortable.containerId
    const activeTaskIndex = active.data.current?.sortable.index
    setActiveTask(taskGroups[activeBoard][activeTaskIndex])
  }

  const handleDragCancel = () => {
    setActiveTask(null)
    setOverBoardId(null)
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const overId = over?.id
    if (!overId) return

    const activeContainer = active.data.current?.sortable.containerId
    const overContainer = over.data.current?.sortable.containerId || over.id
    setOverBoardId(overContainer)
    if (overContainer === activeContainer) return
    if (activeContainer !== overContainer) {
      setTaskGroups((taskGroups) => {
        const activeIndex = active.data.current?.sortable.index
        const overIndex =
          over.id in taskGroups
            ? taskGroups[overContainer].length + 1
            : over.data.current?.sortable.index
        return moveBetweenContainers(
          taskGroups,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          taskGroups[activeContainer][activeIndex]
        )
      })
    }
    onChange("Moved")
    setOverBoardId(null)
  }

  const handleDragEnd = ({ active, over }: any) => {
    if (!over) {
      setActiveTask(null)
      setOverBoardId(null)
      return
    }
    if (active.id !== over.id) {
      const activeContainer = active.data.current.sortable.containerId
      const overContainer = over.data.current?.sortable.containerId || over.id

      const activeIndex = active.data.current?.sortable.index
      const overIndex =
        over.id in taskGroups
          ? (taskGroups as Record<string, Task[]>)[overContainer].length + 1
          : over.data.current.sortable.index
      setTaskGroups((taskGroups) => {
        let newTaskGroups
        if (activeContainer === overContainer) {
          newTaskGroups = {
            ...taskGroups,
            [overContainer]: arrayMove(
              taskGroups[overContainer],
              activeIndex,
              overIndex
            ),
          }
        } else {
          newTaskGroups = moveBetweenContainers(
            taskGroups,
            activeContainer,
            activeIndex,
            overContainer,
            overIndex,
            taskGroups[activeContainer][activeIndex]
          )
        }
        return newTaskGroups
      })
    }
    setActiveTask(null)
    setOverBoardId(null)
  }

  const moveBetweenContainers = (
    items: Record<string, Task[]>,
    activeContainer: string,
    activeIndex: number,
    overContainer: string,
    overIndex: number,
    item: Task
  ) => {
    return {
      ...items,
      [activeContainer]: removeAtIndex(
        taskGroups[activeContainer],
        activeIndex
      ),
      [overContainer]: insertAtIndex(
        taskGroups[overContainer],
        overIndex,
        item
      ),
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
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
