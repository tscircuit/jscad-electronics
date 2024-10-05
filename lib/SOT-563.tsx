import { Cuboid, Translate, Rotate, Colorize } from "jscad-fiber"

export const SOT563 = ({ fullWidth = 1.94, fullLength = 1.6 }) => {
  const bodyWidth = 1.2
  const bodyLength = 1.6
  const bodyHeight = 0.55
  const leadWidth = 0.3
  const leadLength = 0.67
  const leadHeight = 0.13
  const leadSpacing = 0.5
  const bodyZOffset = -0.3

  return (
    <>
      {/* Main body - rotated 90 degrees around X-axis */}
      <Rotate rotation={[45 * Math.PI, 0, 0]}>
        <Translate center={[0, 0, bodyZOffset]}>
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
          center={[-bodyWidth / 2 - 0.03, yOffset * leadSpacing, 0]}
        >
          <Cuboid size={[leadLength, leadWidth, leadHeight]} />
        </Translate>,
        // Right lead
        <Translate
          key={`right-${index}`}
          center={[bodyWidth / 2 + 0.03, yOffset * leadSpacing, 0]}
        >
          <Cuboid size={[leadLength, leadWidth, leadHeight]} />
        </Translate>,
      ])}
    </>
  )
}

export default SOT563
