import { Cuboid, Sphere, Translate, Colorize, Rotate } from "jscad-fiber"
import { fp } from "@tscircuit/footprinter"
import { useMemo } from "react"

interface BGAProps {
  packageWidth?: number
  packageLength?: number
  packageHeight?: number
  standoffHeight?: number
  ballPitch?: number
  ballDiameter?: number
  ballRows?: number
  ballColumns?: number
  missingBalls?: number[]

  footprintString?: string
}

export const BGA = ({
  packageWidth = 10,
  packageLength = 10,
  packageHeight = 1.2,
  standoffHeight = 0.2,
  ballPitch = 0.8,
  ballDiameter = 0.5,
  ballRows = 8,
  ballColumns = 8,
  missingBalls = [],
  footprintString,
}: BGAProps) => {
  const bodyHeight = packageHeight - standoffHeight

  const ballsSoup = useMemo(() => {
    if (!footprintString) return null

    const result = fp.string(footprintString)

    return result.soup()
  }, [footprintString])

  return (
    <>
      {/* Package body */}
      <Colorize color="#555">
        {/* <Rotate rotation={[0, 0, 90]}> */}
        <Cuboid
          size={[packageWidth, packageLength, bodyHeight]}
          center={[0, 0, standoffHeight + bodyHeight / 2]}
        />
        {/* </Rotate> */}
      </Colorize>

      {/* Balls via ball parameters */}
      {!footprintString &&
        Array.from({ length: ballRows * ballColumns }).map((_, index) => {
          if (missingBalls.includes(index + 1)) return null

          const row = Math.floor(index / ballColumns)
          const col = index % ballColumns
          const x = (col - (ballColumns - 1) / 2) * ballPitch
          const y = (row - (ballRows - 1) / 2) * ballPitch

          return (
            <Translate key={index} center={[x, y, standoffHeight / 2]}>
              <Sphere radius={ballDiameter / 2} />
            </Translate>
          )
        })}

      {/* Balls via footprint string */}
      {ballsSoup &&
        ballsSoup.map((elm) => {
          if (elm.type === "pcb_smtpad") {
            return (
              <Translate
                key={elm.pcb_smtpad_id}
                center={[elm.x, elm.y, standoffHeight / 2]}
              >
                <Sphere radius={ballDiameter / 2} />
              </Translate>
            )
          }
          return null
        })}
    </>
  )
}
