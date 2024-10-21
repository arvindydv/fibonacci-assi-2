import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material"
import { FC, Dispatch, SetStateAction, useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { DraggableHeading } from "./StructureAccordion"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

export const DraggableAccordion: FC<{
  heading: DraggableHeading
  isDroppable: boolean
  isDraggable: boolean
  expanded: string[]
  setExpanded: Dispatch<SetStateAction<string[]>>

  setAllHeadings: Dispatch<SetStateAction<DraggableHeading[]>>
}> = ({
  heading,
  isDroppable,
  isDraggable,
  expanded,
  setExpanded,
  setAllHeadings,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "HEADING",
    item: { ...heading, parent: heading.parent || null },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => isDraggable, // Only draggable if allowed
  })

  const [{ isOver }, drop] = useDrop({
    accept: "HEADING",
    drop: (draggedItem: DraggableHeading) => {
      setAllHeadings((prev) => {
        const newHeadings = [...prev]
        const draggedIndex = newHeadings.findIndex(
          (h) => h.randomKey === draggedItem.randomKey
        )

        newHeadings.splice(draggedIndex, 1)
        const dropIndex = newHeadings.findIndex(
          (h) => h.randomKey === heading.randomKey
        )
        newHeadings.splice(dropIndex, 0, draggedItem)
        return newHeadings
      })
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    canDrop: () => isDroppable, // Only droppable if allowed
  })

  const dragRef = useRef(null)
  const dropRef = useRef(null)

  if (isDraggable) drag(dragRef)
  if (isDroppable) drop(dropRef)

  const handleAccordionChange =
    (randomKey: string) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded((prev) => {
        if (isExpanded) {
          return [...prev, randomKey]
        } else {
          return prev.filter((t) => t !== randomKey)
        }
      })
    }

  return (
    <Accordion
      ref={dropRef}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isOver ? "lightblue" : "white",
      }}
      expanded={expanded.includes(heading.randomKey)}
      onChange={handleAccordionChange(heading.randomKey)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} ref={dragRef}>
        {heading.title}
      </AccordionSummary>
      <AccordionDetails>
        <p className="p-2">{heading.content}</p>
        {heading.subheadings?.map((sh, index) => (
          <DraggableAccordion
            expanded={expanded}
            heading={sh}
            isDraggable={isDraggable}
            isDroppable={isDroppable}
            setAllHeadings={setAllHeadings}
            setExpanded={setExpanded}
            key={index}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  )
}
