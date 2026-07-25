import { Cuboid, Cylinder, RoundedCuboid } from "jscad-fiber"

export interface LGAProps {
  grid?: { x: number; y: number }
  pitch?: number
  bodyWidth?: number
  bodyLength?: number
  padWidth?: number
  padLength?: number
  bodyHeight?: number
}

export const LGA = ({
  grid = { x: 4, y: 3 },
  pitch = 0.5,
  bodyWidth = 3,
  bodyLength = 3,
  padWidth = 0.28,
  padLength = 0.7,
  bodyHeight = 0.8,
}: LGAProps) => {
  const contactHeight = 0.05
  const leftRightX = (bodyWidth - padLength) / 2
  const topBottomY = (bodyLength - padLength) / 2
  const cornerRadius = Math.min(0.12, bodyWidth / 8, bodyLength / 8)
  const contacts: Array<{
    center: [number, number, number]
    size: [number, number, number]
  }> = []

  for (let index = 0; index < grid.x; index += 1) {
    const y = ((grid.x - 1) / 2 - index) * pitch
    contacts.push({
      center: [-leftRightX, y, contactHeight / 2],
      size: [padLength, padWidth, contactHeight],
    })
    contacts.push({
      center: [leftRightX, -y, contactHeight / 2],
      size: [padLength, padWidth, contactHeight],
    })
  }

  for (let index = 0; index < grid.y; index += 1) {
    const x = (index - (grid.y - 1) / 2) * pitch
    contacts.push({
      center: [x, -topBottomY, contactHeight / 2],
      size: [padWidth, padLength, contactHeight],
    })
    contacts.push({
      center: [-x, topBottomY, contactHeight / 2],
      size: [padWidth, padLength, contactHeight],
    })
  }

  return (
    <>
      {contacts.map((contact, index) => (
        <Cuboid
          key={index}
          color="#c8a84e"
          center={contact.center}
          size={contact.size}
        />
      ))}
      <RoundedCuboid
        color="#303236"
        center={[0, 0, contactHeight + bodyHeight / 2]}
        size={[bodyWidth, bodyLength, bodyHeight]}
        roundRadius={cornerRadius}
      />
      <Cylinder
        color="#777a7f"
        center={[
          -bodyWidth * 0.35,
          bodyLength * 0.35,
          contactHeight + bodyHeight + 0.012,
        ]}
        height={0.024}
        radius={Math.min(bodyWidth, bodyLength) * 0.045}
      />
    </>
  )
}
