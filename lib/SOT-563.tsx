import { Cuboid, Translate, Rotate, Colorize } from "jscad-fiber"

export const SOT563 = ({ fullWidth = 2.0, fullLength = 1.6 }) => {
  const bodyWidth = 1.6
  const bodyLength = 1.6
  const bodyHeight = 0.55
  const leadWidth = 0.3
  const leadLength = 0.2
  const leadHeight = 0.1
  const leadSpacing = 0.5
  const bodyYOffset = leadHeight / 2
  const bodyZOffset = -0.3

  return (
    <>
      {/* Main body - rotated 90 degrees around X-axis */}
      <Rotate rotation={[(90 / 180) * Math.PI, 0, 0]}>
        <Translate center={[0, bodyYOffset, bodyZOffset]}>
          <Colorize color="grey">
            <Cuboid size={[bodyWidth, bodyLength, bodyHeight]} />
          </Colorize>
        </Translate>
      </Rotate>

      {/* Leads */}
      {[-1, 0, 1].flatMap((yOffset, index) => [
        // Left lead
        <Translate
          key={`left-${index}`}
          center={[-fullWidth / 2 + leadWidth / 2, 0, yOffset * leadSpacing]}
        >
          <Cuboid size={[leadWidth, leadHeight, leadLength]} />
        </Translate>,
        // Right lead
        <Translate
          key={`right-${index}`}
          center={[fullWidth / 2 - leadWidth / 2, 0, yOffset * leadSpacing]}
        >
          <Cuboid size={[leadWidth, leadHeight, leadLength]} />
        </Translate>,
      ])}
    </>
  )
}

export default SOT563
