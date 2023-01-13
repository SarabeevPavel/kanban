import { useDroppable } from "@dnd-kit/core"
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable"
import { Task } from "../utils/types"

interface BoardProps {
  id: string
  items: Task[]
  ItemComponent: any
  overBoardId: string | null
}

export const Board = ({
  id,
  items,
  ItemComponent,
  overBoardId,
}: BoardProps) => {
  const { setNodeRef } = useDroppable({ id })

  return (
    <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
      <div
        ref={setNodeRef}
        className={`${
          overBoardId === id ? "bg-blue-500" : ""
        }  p-3 pb-7  w-full relative m-3 outline outline-black/30 rounded-md `}
      >
        <h2 className="drop-shadow-lg uppercase mb-10 text-center text-xl font-semibold text-white">
          {id}
        </h2>

        <div>
          {items.length ? (
            items.map((item, i) => <ItemComponent key={i} item={item} />)
          ) : (
            <p className="text-black/50">This board is empty.</p>
          )}
        </div>
      </div>
    </SortableContext>
  )
}
