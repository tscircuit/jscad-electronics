import {
  Colorize,
  Cuboid,
  Hull,
  Translate,
  Cylinder,
  Subtract,
} from "jscad-fiber"

export const TO92 = () => {
  // === TO-92 Dimensions (mm) ===
  const bodyRadius = 2.25
  const bodyHeight = 4.5
  const flatCut = 1.2 // depth of flat side cut

  const legWidth = 0.4
  const legThickness = 0.25

  const bodyColor = "#222"
  const leadColor = "#ccc"

  // Footprint pad positions (from footprinter to92.ts):
  // Pin 1: x=-1.27, y=0.98
  // Pin 2: x=0,     y=2.25
  // Pin 3: x=1.27,  y=0.98
  const pin1X = -1.27
  const pin2X = 0
  const pin3X = 1.27
  const pin1Y = 0.98
  const pin2Y = 2.25
  const pin3Y = 0.98

  // Body center in XY should be at the semicircle center of the footprint
  const bodyCenterX = 0
  const bodyCenterY = pin2Y // semicircle center matches pin 2 Y
  const bodyCenterZ = bodyHeight / 2 // body sits on the board surface

  // Lead dimensions
  const leadAboveBoard = 0.5 // small stub visible above board
  const leadBelowBoard = 3.0 // extends below board

  return (
    <>
      {/* Body - semicircular (cylinder with flat cut) */}
      <Colorize color={bodyColor}>
        <Subtract>
          <Translate center={[bodyCenterX, bodyCenterY, bodyCenterZ]}>
            <Cylinder radius={bodyRadius} height={bodyHeight} />
          </Translate>
          {/* Cut the flat side - flat is on the side closest to pins 1 and 3 */}
          <Translate
            center={[
              bodyCenterX,
              bodyCenterY - (bodyRadius - flatCut / 2),
              bodyCenterZ,
            ]}
          >
            <Cuboid
              size={[bodyRadius * 2 + 0.2, flatCut, bodyHeight + 0.2]}
            />
          </Translate>
        </Subtract>
      </Colorize>

      {/* Lead for Pin 1 (left) */}
      <Colorize color={leadColor}>
        <Translate
          center={[pin1X, pin1Y, -leadBelowBoard / 2 + leadAboveBoard / 2]}
        >
          <Cuboid
            size={[legWidth, legThickness, leadBelowBoard + leadAboveBoard]}
          />
        </Translate>
      </Colorize>

      {/* Lead for Pin 2 (center) */}
      <Colorize color={leadColor}>
        <Translate
          center={[pin2X, pin2Y, -leadBelowBoard / 2 + leadAboveBoard / 2]}
        >
          <Cuboid
            size={[legWidth, legThickness, leadBelowBoard + leadAboveBoard]}
          />
        </Translate>
      </Colorize>

      {/* Lead for Pin 3 (right) */}
      <Colorize color={leadColor}>
        <Translate
          center={[pin3X, pin3Y, -leadBelowBoard / 2 + leadAboveBoard / 2]}
        >
          <Cuboid
            size={[legWidth, legThickness, leadBelowBoard + leadAboveBoard]}
          />
        </Translate>
      </Colorize>
    </>
  )
}
