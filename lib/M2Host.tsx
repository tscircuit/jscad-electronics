import { Colorize, Cuboid, Subtract } from "jscad-fiber"

interface M2HostProps {
  bodyWidth?: number
  bodyDepth?: number
  bodyHeight?: number
  pinCount?: number
  pinPitch?: number
}

/**
 * M.2 (NGFF) host connector: low elongated body with a card slot.
 */
export const M2Host = ({
  bodyWidth = 22,
  bodyDepth = 8.7,
  bodyHeight = 3.2,
  pinCount = 67,
  pinPitch = 0.5,
}: M2HostProps) => {
  const slotDepth = bodyDepth * 0.55

  return (
    <>
      {/* Body with card slot */}
      <Colorize color="#1a1a1a">
        <Subtract>
          <Cuboid
            size={[bodyWidth, bodyDepth, bodyHeight]}
            center={[0, 0, bodyHeight / 2]}
          />
          {/* card slot opening on the front face */}
          <Cuboid
            size={[bodyWidth * 0.85, slotDepth, 1.2]}
            center={[0, -bodyDepth / 2 + slotDepth / 2, bodyHeight * 0.55]}
          />
        </Subtract>
      </Colorize>

      {/* Contact fingers inside the slot */}
      {Array.from({ length: Math.min(pinCount, 32) }).map((_, i) => (
        <Colorize key={i} color="#c8a028">
          <Cuboid
            size={[0.2, slotDepth * 0.8, 0.15]}
            center={[
              -bodyWidth * 0.4 + i * pinPitch * 1.6,
              -bodyDepth / 2 + slotDepth / 2,
              bodyHeight * 0.55 + 0.6,
            ]}
          />
        </Colorize>
      ))}

      {/* Mounting posts at both ends */}
      {[-1, 1].map((s) => (
        <Colorize key={s} color="#808080">
          <Cuboid
            size={[2.5, bodyDepth * 0.5, bodyHeight * 0.4]}
            center={[s * (bodyWidth / 2 + 1), 0, bodyHeight * 0.2]}
          />
        </Colorize>
      ))}
    </>
  )
}

export default M2Host
