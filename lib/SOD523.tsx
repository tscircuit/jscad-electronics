import { Colorize, Cuboid, Hull, Translate, Union } from "jscad-fiber"

export const SOD523 = () => {
  const fullWidth = 2.15
  const bodyLength = 0.8
  const bodyHeight = 0.6

  const padWidth = 0.6
  const padLength = 0.5
  const padThickness = 0.12

  const bodyWidth = fullWidth - padLength
  const leftPadCenterX = -bodyWidth / 2 + padLength / 2 - 0.15 // 0.15 is the distance between the pad and the body as datasheet
  const rightPadCenterX = bodyWidth / 2 - padLength / 2 + 0.15 // 0.15 is the distance between the pad and the body as datasheet

  // top taper happens only in last quarter
  const taperOffset = 0.2
  const straightHeight = bodyHeight * 0.5

  const Body = (
    <Colorize color="#222">
      <Union>
        {/* Straight bottom section */}
        <Translate z={straightHeight / 2}>
          <Cuboid size={[bodyWidth, bodyLength, straightHeight]} />
        </Translate>

        {/* Tapered top quarter */}
        <Hull>
          {/* bottom of taper (same size as straight section top) */}
          <Translate z={straightHeight}>
            <Cuboid size={[bodyWidth, bodyLength, 0.01]} />
          </Translate>

          {/* top of taper (smaller) */}
          <Translate z={bodyHeight}>
            <Cuboid
              size={[bodyWidth - taperOffset, bodyLength - taperOffset, 0.01]}
            />
          </Translate>
        </Hull>
      </Union>
    </Colorize>
  )

  return (
    <>
      {/* Pads */}
      <Cuboid
        color="#ccc"
        size={[padLength, padWidth, padThickness]}
        center={[leftPadCenterX, 0, padThickness / 2]}
      />
      <Cuboid
        color="#ccc"
        size={[padLength, padWidth, padThickness]}
        center={[rightPadCenterX, 0, padThickness / 2]}
      />

      {/* Body (lifted above pads) */}
      {Body}
    </>
  )
}

export default SOD523
