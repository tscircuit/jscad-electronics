import jscad from "@jscad/modeling"
import { createNemaMotorSections } from "./utils/nemaMotorGeometry"
import {
  resolveNemaMotorProps,
  type NemaMotorModelPropsInput,
} from "./utils/nemaMotorParameters"
import { createHexSocketBoltGeom } from "./HexSocketBolt"
import { Colorize, Custom } from "jscad-fiber"

export type NemaMotorProps = NemaMotorModelPropsInput & {
  bodyColor?: string
  capColor?: string
  shaftColor?: string
  screwColor?: string
}
export type NemaFrameMotorProps = Omit<NemaMotorProps, "nemaSize">

/** Mounting face at Z=0, body along -Z, shaft along +Z; all lengths in mm.
 * Parameters follow the modelprinter NEMA contract; JSCAD builds all geometry.
 */
export function NemaMotor({
  bodyColor = "#242830",
  capColor = "#aeb5bd",
  shaftColor = "#b8bec6",
  screwColor = "#626b78",
  ...props
}: NemaMotorProps) {
  const p = resolveNemaMotorProps(props)
  const screw =
    p.backFace === "screws"
      ? jscad.transforms.rotateX(
          Math.PI,
          createHexSocketBoltGeom({
            metricSize: p.backFaceScrewSize,
            length: p.backFaceHoleDepth,
            showThreads: false,
          }),
        )
      : undefined
  const halfPitch = p.backFaceHoleSpacing / 2
  return (
    <>
      {createNemaMotorSections(p).map((section, index) => {
        const outline = jscad.geometries.geom2.fromPoints(section.outline)
        const profile = section.holes.length
          ? jscad.booleans.subtract(
              outline,
              ...section.holes.map((h) => jscad.geometries.geom2.fromPoints(h)),
            )
          : outline
        const geometry = jscad.transforms.translate(
          [0, 0, section.zMin],
          jscad.extrusions.extrudeLinear(
            { height: section.zMax - section.zMin },
            profile,
          ),
        )
        return (
          <Colorize
            key={`${section.name}-${index}`}
            color={
              section.name === "body"
                ? bodyColor
                : section.name === "shaft"
                  ? shaftColor
                  : capColor
            }
          >
            <Custom geometry={geometry} />
          </Colorize>
        )
      })}
      {screw &&
        [-halfPitch, halfPitch].flatMap((x) =>
          [-halfPitch, halfPitch].map((y) => (
            <Colorize key={`rear-screw-${x}-${y}`} color={screwColor}>
              {/* HexSocketBolt's +Z head is rotated to face -Z; its bearing plane
              is then placed on the motor's rear face, in the same mm frame. */}
              <Custom
                geometry={jscad.transforms.translate(
                  [x, y, -p.bodyLength],
                  screw,
                )}
              />
            </Colorize>
          )),
        )}
    </>
  )
}
export const NEMA8 = (props: NemaFrameMotorProps) => (
  <NemaMotor {...props} nemaSize={8} />
)
export const NEMA17 = (props: NemaFrameMotorProps) => (
  <NemaMotor {...props} nemaSize={17} />
)
export const NEMA23 = (props: NemaFrameMotorProps) => (
  <NemaMotor {...props} nemaSize={23} />
)
