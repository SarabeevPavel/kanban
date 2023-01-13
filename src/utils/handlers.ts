import { DragOverEvent, DragStartEvent } from "@dnd-kit/core"
import { Task } from "./types"
import { arrayMove, insertAtIndex, removeAtIndex } from "./arrayOperations"
export const handleDragStart = (
  { active }: DragStartEvent,
  taskGroups: Record<string, Task[]>,
  setActiveTask: React.Dispatch<React.SetStateAction<Task | null>>
) => {
  const activeBoard = active.data.current?.sortable.containerId
  const activeTaskIndex = active.data.current?.sortable.index
  setActiveTask(taskGroups[activeBoard][activeTaskIndex])
}

export const handleDragCancel = (
  setActiveTask: React.Dispatch<React.SetStateAction<Task | null>>,
  setOverBoardId: React.Dispatch<React.SetStateAction<string | null>>
) => {
  setActiveTask(null)
  setOverBoardId(null)
}

export const handleDragOver = (
  { active, over }: DragOverEvent,
  setOverBoardId: React.Dispatch<React.SetStateAction<string | null>>,
  setTaskGroups: React.Dispatch<React.SetStateAction<Record<string, Task[]>>>,
  onChange: (message: string) => void
) => {
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

export const handleDragEnd = (
  { active, over }: any,
  setActiveTask: React.Dispatch<React.SetStateAction<Task | null>>,
  setOverBoardId: React.Dispatch<React.SetStateAction<string | null>>,
  setTaskGroups: React.Dispatch<React.SetStateAction<Record<string, Task[]>>>,
  taskGroups: Record<string, Task[]>
) => {
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

export const moveBetweenContainers = (
  items: Record<string, Task[]>,
  activeContainer: string,
  activeIndex: number,
  overContainer: string,
  overIndex: number,
  item: Task
) => {
  return {
    ...items,
    [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
    [overContainer]: insertAtIndex(items[overContainer], overIndex, item),
  }
}
