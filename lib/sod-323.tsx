import { ChipBody } from "./ChipBody"
import { Colorize, Cuboid, Hull, Translate, Union } from "jscad-fiber"
import { SmdChipLead } from "./SmdChipLead"

export const SOD323 = () => {
  const fullWidth = 2.5
  const bodyLength = 1.25

  const bodyWidth = 1.7
  const bodyHeight = 0.95

  const leadWidth = 0.3
  const leadThickness = 0.175

  const padContactLength = 0.3

  const padCenterX = bodyWidth / 2

  const bodyDistance = 0.45
  const leadHeight = 0.7
  return (
    <>
      <SmdChipLead
        key={1}
        position={{
          x: -fullWidth / 2,
          y: 0,
          z: leadThickness / 2,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={bodyDistance}
        height={leadHeight}
      />

      <SmdChipLead
        key={1}
        rotation={Math.PI}
        position={{
          x: fullWidth / 2,
          y: 0,
          z: leadThickness / 2,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={bodyDistance}
        height={leadHeight}
      />

      {/* Body */}
      <Colorize color="#222">
        <ChipBody
          center={{ x: 0, y: 0, z: 0 }}
          width={bodyWidth}
          length={bodyLength}
          height={bodyHeight}
          includeNotch={false}
          taperRatio={0.06}
          straightHeightRatio={0.7}
          heightAboveSurface={0.05}
        />
      </Colorize>

      {/* Grey polarity/top strip */}
      <Cuboid
        color="#777"
        size={[bodyWidth / 3, bodyLength - 0.075, 0.02]}
        center={[(-padCenterX * 2) / 3 + 0.035, 0, bodyHeight + 0.05]}
      />
    </>
  )
}

export default SOD323
