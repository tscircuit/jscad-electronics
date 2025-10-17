import { Colorize, Cuboid, Cylinder, Hull, Translate, Union } from "jscad-fiber"

export const SMA = ({ fullWidth = 7.1, fullLength = 3.4, pitch = 4.05 }) => {
  const bodyWidth = 4.4
  const bodyLength = fullLength
  const bodyHeight = 2.3

  const padLength = 2.45
  const padWidth = 1.8
  const padThickness = 0.15

  const leftPadCenterX = -pitch / 2
  const rightPadCenterX = pitch / 2

  const leadThickness = 0.12
  const leadHeight = 0.6

  const bandWidth = 0.4
  const bandPosition = -bodyWidth / 2 + bandWidth / 2 + 0.3

  const Body = (
    <Union>
      {/* Main black molded body */}
      <Colorize color="#1a1a1a">
        <Hull>
          {/* Bottom corners */}
          <Translate x={-bodyWidth / 2 + 0.2} y={-bodyLength / 2 + 0.2} z={0.2}>
            <Cylinder radius={0.2} height={0.01} />
          </Translate>
          <Translate x={bodyWidth / 2 - 0.2} y={-bodyLength / 2 + 0.2} z={0.2}>
            <Cylinder radius={0.2} height={0.01} />
          </Translate>
          <Translate x={-bodyWidth / 2 + 0.2} y={bodyLength / 2 - 0.2} z={0.2}>
            <Cylinder radius={0.2} height={0.01} />
          </Translate>
          <Translate x={bodyWidth / 2 - 0.2} y={bodyLength / 2 - 0.2} z={0.2}>
            <Cylinder radius={0.2} height={0.01} />
          </Translate>

          {/* Top corners (slightly smaller for taper) */}
          <Translate
            x={-bodyWidth / 2 + 0.3}
            y={-bodyLength / 2 + 0.3}
            z={bodyHeight}
          >
            <Cylinder radius={0.2} height={0.01} />
          </Translate>
          <Translate
            x={bodyWidth / 2 - 0.3}
            y={-bodyLength / 2 + 0.3}
            z={bodyHeight}
          >
            <Cylinder radius={0.2} height={0.01} />
          </Translate>
          <Translate
            x={-bodyWidth / 2 + 0.3}
            y={bodyLength / 2 - 0.3}
            z={bodyHeight}
          >
            <Cylinder radius={0.2} height={0.01} />
          </Translate>
          <Translate
            x={bodyWidth / 2 - 0.3}
            y={bodyLength / 2 - 0.3}
            z={bodyHeight}
          >
            <Cylinder radius={0.2} height={0.01} />
          </Translate>
        </Hull>
      </Colorize>

      {/* Cathode band (white/silver marking) */}
      <Colorize color="#d0d0d0">
        <Translate x={bandPosition} z={bodyHeight / 2 + 0.5}>
          <Cuboid size={[bandWidth, bodyLength - 0.4, bodyHeight - 0.5]} />
        </Translate>
      </Colorize>
    </Union>
  )

  const Lead = ({ xPos }: { xPos: number }) => (
    <Colorize color="#c0c0c0">
      <Union>
        {/* Vertical part connecting pad to body */}
        <Translate x={xPos} z={leadHeight / 2 + padThickness}>
          <Cuboid size={[padWidth, padWidth, leadHeight]} />
        </Translate>
        {/* Horizontal part going under body */}
        <Translate x={xPos * 0.6} z={leadThickness / 2 + padThickness}>
          <Cuboid size={[Math.abs(xPos) * 0.8, padWidth, leadThickness]} />
        </Translate>
      </Union>
    </Colorize>
  )

  return (
    <>
      {/* Left pad (anode) */}
      <Cuboid
        color="#ccc"
        size={[padLength, padWidth, padThickness]}
        center={[leftPadCenterX, 0, padThickness / 2]}
      />

      {/* Right pad (cathode) */}
      <Cuboid
        color="#ccc"
        size={[padLength, padWidth, padThickness]}
        center={[rightPadCenterX, 0, padThickness / 2]}
      />

      {/* Metal leads */}
      <Lead xPos={leftPadCenterX} />
      <Lead xPos={rightPadCenterX} />

      {/* Molded plastic body */}
      {Body}
    </>
  )
}
