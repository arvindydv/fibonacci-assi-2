export interface Heading {
  type: "h1" | "h2" | "h3"
  title: string
  subheadings?: Heading[]
  content?: string
  randomKey: string
}

export const parseDocument = (text: string): Heading[] => {
  const lines = text.split("\n")
  const structure: Heading[] = []
  let currentH1: Heading | undefined
  let currentH2: Heading | undefined
  let currentH3: Heading | undefined

  console.log({ lines })

  lines.forEach((line) => {
    if (line === "") return
    if (line.startsWith("###")) {
      currentH3 = {
        type: "h3",
        title: line.replace("###", "").trim(),
        randomKey: (Math.random() * 100).toString(),
      }
      currentH2?.subheadings?.push(currentH3)
    } else if (line.startsWith("##")) {
      currentH2 = {
        type: "h2",
        title: line.replace("##", "").trim(),
        subheadings: [],
        randomKey: (Math.random() * 100).toString(),
      }
      currentH1?.subheadings?.push(currentH2)
    } else if (line.startsWith("#")) {
      currentH1 = {
        type: "h1",
        title: line.replace("#", "").trim(),
        subheadings: [],
        randomKey: (Math.random() * 100).toString(),
      }
      structure.push(currentH1)
    } else {
      console.log({ line, currentH1, currentH2, currentH3 })
      if (currentH3) currentH3.content = line
      else if (currentH2) currentH2.content = line
      else if (currentH1) currentH1.content = line
    }
  })
  console.log({ structure })
  return structure
}
