import { useState } from "react"
import { Kanban } from "./components/Kanban"
import { TaskCard } from "./components/TaskCard"
import { boardsData } from "./utils/data"
import { Task } from "./utils/types"

function App() {
  const [itemField, setItemField] = useState("status")

  const boards = boardsData.map((item) =>
    (item as any)[itemField] ? (item as any)[itemField] : (item as Task).status
  )

  return (
    <>
      <Kanban
        boards={Array.from(new Set(boards))}
        itemField={itemField}
        itemComponent={TaskCard}
        items={boardsData}
        onChange={(message: string) => {
          console.log(message)
        }}
      />
    </>
  )
}

export default App
