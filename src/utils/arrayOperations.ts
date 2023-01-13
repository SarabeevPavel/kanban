import { arrayMove as dndKitArrayMove } from "@dnd-kit/sortable"
import { Task } from "./types"

export const removeAtIndex = (items: Task[], index: number) => {
  return [...items.slice(0, index), ...items.slice(index + 1)]
}

export const insertAtIndex = (items: Task[], index: number, item: Task) => {
  return [...items.slice(0, index), item, ...items.slice(index)]
}

export const arrayMove = (
  items: Task[],
  oldIndex: number,
  newIndex: number
) => {
  return dndKitArrayMove(items, oldIndex, newIndex)
}
