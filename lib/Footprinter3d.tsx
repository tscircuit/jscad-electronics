import { fp } from "@tscircuit/footprinter"
import { Dip } from "./DualInlinePackage"
import { Tssop } from "./Tssop"
import { A0402 } from "./A0402"
import { A0603 } from "./A0603"
import { A0805 } from "./A0805"
import { QFP } from "./qfp"
import { PinRow } from "./PinRow"
import QFN from "./qfn"
import SOT235 from "./SOT-235"
import { A0201 } from "./A0201"
import { A01005 } from "./A01005"
import { A1206 } from "./A1206"
import { A1210 } from "./A1210"
import { A2010 } from "./A2010"
import { A2512 } from "./A2512"
import { FemaleHeader } from "./FemaleHeader"
import { PushButton } from "./PushButton"

/**
 * Outputs a 3d model for any [footprinter string](https://github.com/tscircuit/footprinter)
 */

export const Footprinter3d = ({ footprint }: { footprint: string }) => {
  const fpJson = fp.string(footprint).json() as unknown as {
    w: number
    p: number
    h: number
    pl: number
    pw: number
    num_pins: number
    fn: string
    thermalpad: { x: number; y: number }
    imperial: String
    male: boolean
    female: boolean
    id: number //innerDiameter
    od: number //outerDiameter
  }

  switch (fpJson.fn) {
    case "dip":
      return (
        <Dip numPins={fpJson.num_pins} pitch={fpJson.p} bodyWidth={fpJson.w} />
      )
    case "tssop":
      return (
        <Tssop
          pinCount={fpJson.num_pins}
          leadLength={fpJson.pl}
          leadWidth={fpJson.pw}
          pitch={fpJson.p}
          bodyWidth={fpJson.w}
        />
      )
    case "qfp":
      return (
        <QFP
          pinCount={fpJson.num_pins}
          pitch={fpJson.p}
          leadWidth={fpJson.pw}
          padContactLength={fpJson.pl}
          bodyWidth={fpJson.w}
        />
      )
    case "qfn":
      return (
        <QFN
          num_pins={fpJson.num_pins}
          bodyWidth={fpJson.w}
          bodyLength={fpJson.h}
          pitch={fpJson.p}
          padLength={fpJson.pl}
          padWidth={fpJson.pw}
          thermalPadSize={{
            width: fpJson.thermalpad.x,
            length: fpJson.thermalpad.y,
          }}
        />
      )
    case "pinrow":
      if (fpJson.male)
        return <PinRow numberOfPins={fpJson.num_pins} pitch={fpJson.p} />
      if (fpJson.female)
        return <FemaleHeader numberOfPins={fpJson.num_pins} pitch={fpJson.p} />

    case "cap": {
      switch (fpJson.imperial) {
        case "0402":
          return <A0402 color="#856c4d" />
        case "0603":
          return <A0603 color="#856c4d" />
        case "0805":
          return <A0805 color="#856c4d" />
        case "0201":
          return <A0201 color="#856c4d" />
        case "01005":
          return <A01005 color="#856c4d" />
        case "1206":
          return <A1206 color="#856c4d" />
        case "1210":
          return <A1210 color="#856c4d" />
        case "2010":
          return <A2010 color="#856c4d" />
        case "2512":
          return <A2512 color="#856c4d" />
      }
    }
    case "sot235":
      return <SOT235 />
    case "pushbutton":
      return (
        <PushButton
          width={fpJson.w}
          length={fpJson.h}
          innerDiameter={fpJson.id}
        />
      )
    case "soic":
      return (
        <Tssop
          pinCount={fpJson.num_pins}
          leadLength={fpJson.pl}
          leadWidth={fpJson.pw}
          pitch={fpJson.p}
          bodyWidth={fpJson.w}
        />
      ) // TODO switch to SOIC
  }

  switch (fpJson.imperial) {
    case "0402":
      return <A0402 />
    case "0603":
      return <A0603 />
    case "0805":
      return <A0805 />
    case "0201":
      return <A0201 />
    case "01005":
      return <A01005 />
    case "1206":
      return <A1206 />
    case "1210":
      return <A1210 />
    case "2010":
      return <A2010 />
    case "2512":
      return <A2512 />
  }
  return null
}
