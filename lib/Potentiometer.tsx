import { Colorize, Cuboid, Cylinder, Subtract } from "jscad-fiber"

interface PotentiometerProps {
  /** body diameter (footprinter `ca`) */
  diameter?: number
  /** body height (footprinter `h`) */
  height?: number
  /** pin pitch (footprinter `p`) */
  pitch?: number
  numPins?: number
}

/**
 * Through-hole trimmer/rotary potentiometer: cylindrical body,
 * shaft on top, pins along one edge.
 */
export const Potentiometer = ({
  diameter = 14,
  height = 4,
  pitch = 5,
  numPins = 3,
}: PotentiometerProps) => {
  const radius = diameter / 2
  const startX = -((numPins - 1) * pitch) / 2

  return (
    <>
      {/* Body */}
      <Colorize color="#2b2b2b">
        <Cylinder
          radius={radius}
          height={height}
          center={[0, 0, height / 2]}
        />
      </Colorize>

      {/* Shaft with slot */}
      <Colorize color="#c0c0c0">
        <Subtract>
          <Cylinder
            radius={radius * 0.35}
            height={height * 0.8}
            center={[0, 0, height + height * 0.3]}
          />
          <Cuboid
            size={[radius * 0.7, radius * 0.12, height * 0.3]}
            center={[0, 0, height + height * 0.65]}
          />
        </Subtract>
      </Colorize>

      {/* Pins */}
      {Array.from({ length: numPins }).map((_, i) => (
        <Colorize key={i} color="#c0c0c0">
          <Cuboid
            size={[0.8, 0.4, 4]}
            center={[startX + i * pitch, radius * 0.7, -2]}
          />
        </Colorize>
      ))}
    </>
  )
}

export default Potentiometer
