export type CablePoint = [number, number, number]
export type CableColor = [number, number, number, number]

type ConnectorBody = {
  bodyWidth: number
  bodyHeight: number
  bodyDepth: number
}
export type CableConnectorSpec = ConnectorBody &
  (
    | {
        kind: "usb_c_plug"
        shellWidth: number
        shellHeight: number
        shellDepth: number
      }
    | {
        kind: "jst_sh_housing" | "jst_ph_housing"
        pinCount: number
        pitch: number
      }
    | { kind: "nema_5_15p" | "iec_c13" }
    | {
        kind: "bullet_male" | "bullet_female"
        diameter: number
        contactDepth: number
        pinCount: number
        pitch: number
      }
  )

/** Structural subset of a cableprinter definition; no runtime spec dependency. */
export type CableGeometryDefinition = {
  connectorA: CableConnectorSpec
  connectorB: CableConnectorSpec
  crossSection:
    | { kind: "round_jacket"; diameter: number; color: string }
    | {
        kind: "wire_bundle"
        wirePitch: number
        wires: { diameter: number; color: string }[]
      }
}

export type CableMesh = {
  name: string
  positions: number[]
  indices: number[]
  color: CableColor
  smooth: boolean
}

export type CableFrame = {
  point: CablePoint
  normal: CablePoint
  binormal: CablePoint
  tangent: CablePoint
}
