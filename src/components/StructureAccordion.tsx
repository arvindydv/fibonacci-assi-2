import { Dispatch, FC, SetStateAction, useRef, useState } from "react"
import { Heading } from "../utils/parseDocument"
import { Box, Grid2, Typography } from "@mui/material"
import { useDrop } from "react-dnd"
import { DraggableAccordion } from "./DraggableAccordion"

export interface DraggableHeading extends Heading {
  parent?: string | null // To keep track of the parent heading for nested structures
}

export const StructureAccordion: FC<{ structure: Heading[] }> = ({
  structure,
}) => {
  const [restructured, setRestructured] = useState<Heading[]>([])
  const [expandedOg, setExpandedOg] = useState<string[]>([])
  const [expandedRestructured, setExpandedRestructured] = useState<string[]>([])

  return (
    <div>
      <Grid2 container spacing={8}>
        <Grid2 size={4}>
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Structure
          </Typography>
          {structure.map((heading, index) => (
            <DraggableAccordion
              key={index}
              heading={heading}
              expanded={expandedOg}
              isDraggable
              setExpanded={setExpandedOg}
              setAllHeadings={setRestructured}
              isDroppable={false}
            />
          ))}
        </Grid2>
        <Grid2 size={8}>
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Drag and drop headings here 
          </Typography>

          <Box sx={{ border: "2px dashed gray", padding: "16px" }}>
            {restructured.map((heading, index) => (
              <>
                <DraggableAccordion
                  key={index}
                  heading={heading}
                  expanded={expandedRestructured}
                  isDraggable={true}
                  setExpanded={setExpandedRestructured}
                  setAllHeadings={setRestructured}
                  isDroppable={true}
                />
                <DroppableContainer
                  setAllHeadings={setRestructured}
                  showInfo={restructured.length === 0}
                  allHeadings={restructured}
                  short
                  dropIndex={index + 1}
                />
              </>
            ))}

            {restructured.length === 0 ? (
              <DroppableContainer setAllHeadings={setRestructured} showInfo />
            ) : null}
          </Box>
        </Grid2>
      </Grid2>
    </div>
  )
}

const DroppableContainer: FC<{
  setAllHeadings: Dispatch<SetStateAction<DraggableHeading[]>>
  showInfo: boolean
  allHeadings?: DraggableHeading[]
  short?: boolean
  dropIndex?: number
}> = ({ setAllHeadings, showInfo, allHeadings, short, dropIndex }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "HEADING",
    drop: (draggedItem: DraggableHeading) => {
      setAllHeadings((prev) => {
        if (
          showInfo ||
          !allHeadings?.find((h) => h.randomKey === draggedItem.randomKey)
        ) {
          const newHeadings = [...prev, draggedItem]
          return newHeadings
        } else {
          const newHeadings = [...prev]
          const draggedIndex = newHeadings.findIndex(
            (h) => h.randomKey === draggedItem.randomKey
          )

          newHeadings.splice(draggedIndex, 1)
          if (dropIndex !== undefined) {
            newHeadings.splice(dropIndex, 0, draggedItem)
          } else {
            newHeadings.push(draggedItem)
          }

          return newHeadings
        }
      })
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  const dropRef = useRef(null)

  drop(dropRef)

  return (
    <Box
      ref={dropRef}
      sx={{
        height: short ? "10px" : "100px",
        backgroundColor: isOver ? "lightblue" : "white",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!showInfo ? undefined : (
        <Typography>Drop here to start rearranging</Typography>
      )}
    </Box>
  )
}
