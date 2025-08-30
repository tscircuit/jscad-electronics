import { Colorize, Cuboid, Hull, Translate, Union } from "jscad-fiber"

export const SOD523 = () => {
  // Dimensions (in mm, typical for SOD-523)
  const totalWidth = 2.15
  const bodyLength = 0.8
  const bodyHeight = 0.6
  const padLength = 0.5
  const padWidth = 0.6
  const padThickness = 0.12
  const bodyWidth = totalWidth - padLength

  // Pad offset from body (datasheet: ~0.15mm gap)
  const padGap = 0.15
  const leftPadX = -((bodyWidth + padLength) / 2 + padGap / 2)
  const rightPadX = (bodyWidth + padLength) / 2 + padGap / 2

  // Tapered top
  const taper = 0.2
  const straightHeight = bodyHeight * 0.5

  // Polarity mark
  const markWidth = 0.08
  const markLength = bodyLength * 0.7
  const markHeight = 0.01

  // Main body with taper
  const body = (
    <Colorize color="#555">
      <Union>
        {/* Lower straight section */}
        <Translate z={straightHeight / 2}>
          <Cuboid size={[bodyWidth, bodyLength, straightHeight]} />
        </Translate>
        {/* Tapered top section */}
        <Hull>
          <Translate z={straightHeight}>
            <Cuboid size={[bodyWidth, bodyLength, 0.01]} />
          </Translate>
          <Translate z={bodyHeight}>
            <Cuboid size={[bodyWidth - taper, bodyLength - taper, 0.01]} />
          </Translate>
        </Hull>
      </Union>
    </Colorize>
  )

  return (
    <>
      {/* Pads */}
      <Colorize color="#ccc">
        <Translate offset={{ x: leftPadX, y: 0, z: padThickness / 2 }}>
          <Cuboid size={[padLength, padWidth, padThickness]} />
        </Translate>
        <Translate offset={{ x: rightPadX, y: 0, z: padThickness / 2 }}>
          <Cuboid size={[padLength, padWidth, padThickness]} />
        </Translate>
      </Colorize>
      {/* Body */}
      <Translate offset={{ x: 0, y: 0, z: padThickness }}>
        {body}
        {/* Polarity marking line */}
        <Colorize color="#bbb">
          <Translate
            offset={{
              x: -bodyWidth / 2 + markWidth / 2 + 0.05,
              y: 0,
              z: bodyHeight / 2 + 0.01,
            }}
          >
            <Cuboid size={[markWidth, markLength, markHeight]} />
          </Translate>
        </Colorize>
      </Translate>
    </>
  )
}

export default SOD523
