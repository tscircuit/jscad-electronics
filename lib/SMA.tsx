import { Colorize, Cuboid, Hull, Translate, Union } from "jscad-fiber"

export const SMA = () => {
  const fullWidth = 4
  const bodyLength = 2.3
  const bodyHeight = 2

  const padWidth = 1.3
  const padLength = 1.5
  const padThickness = 0.12

  const bodyWidth = fullWidth - padLength
  const leftPadCenterX = bodyLength / 2
  const rightPadCenterX = -bodyLength / 2

  // top taper happens only in last quarter
  const taperOffset = 0.4
  const straightHeight = bodyHeight * 0.5

  const Body = (
    <Colorize color="#222">
      <Union>
        <Hull>
          <Translate z={padThickness + 0.01}>
            <Cuboid
              size={[bodyWidth - taperOffset, bodyLength - taperOffset, 0.03]}
            />
          </Translate>

          <Translate z={straightHeight}>
            <Cuboid size={[bodyWidth, bodyLength, 0.01]} />
          </Translate>
        </Hull>
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
      {Body}
    </>
  )
}

export default SMA
