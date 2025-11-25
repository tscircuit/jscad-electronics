import { fp } from "@tscircuit/footprinter"
import { Dip } from "./DualInlinePackage"
import { Tssop } from "./Tssop"
import { MSOP } from "./MSOP"
import { A0402 } from "./A0402"
import { A0603 } from "./A0603"
import { A0805 } from "./A0805"
import { QFP } from "./qfp"
import { PinRow } from "./PinRow"
import QFN from "./qfn"
import SOT235 from "./SOT-235"
import { SOT23W } from "./SOT-23W"
import { A0201 } from "./A0201"
import { A01005 } from "./A01005"
import { A1206 } from "./A1206"
import { A1210 } from "./A1210"
import { A2010 } from "./A2010"
import { A2512 } from "./A2512"
import { FemaleHeader } from "./FemaleHeader"
import { PushButton } from "./PushButton"
import { SOIC } from "./SOIC"
import { VSSOP } from "./VSSOP"
import { SOD523 } from "./SOD523"
import { SOD882 } from "./SOD882"
import { SMA } from "./SMA"
import { SMB } from "./SMB"
import { SMC } from "./SMC"
import { SMF } from "./SMF"
import { SOD123F } from "./sod-123F"
import { SOD123FL } from "./sod-123FL"
import { SOD123W } from "./sod-123W"
import { SOD128 } from "./sod-128"
import { SOD923 } from "./SOD-923"
import { SOT223 } from "./SOT-223"
import TQFP from "./tqfp"
import { SOT323 } from "./SOT-323"
import { LQFP } from "./lqfp"
import { SOT723 } from "./SOT-723"
import { DFN } from "./dfn"
import { HC49 } from "./hc49"
import { MicroMELF } from "./MicroMELF"
import { MINIMELF } from "./MINIMELF"
import { MELF } from "./MELF"
import { MS012 } from "./ms012"
import { MS013 } from "./ms013"
import { TO220 } from "./TO220"
import { SOT89 } from "./SOT-89"
import { SOT457 } from "./SOT-457"
import { SOT963 } from "./SOT-963"
import { TO92 } from "./TO92"
import SOT363 from "./SOT-363"
import { SOT886 } from "./SOT-886"
import { SOD323 } from "./sod-323"
import { SOD323F } from "./sod-323F"
import { SOD323FL } from "./sod-323FL"

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
    thermalpad?: { x: number; y: number }
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
    case "msop":
      return (
        <MSOP
          pinCount={fpJson.num_pins}
          padContactLength={fpJson.pl}
          leadWidth={fpJson.pw}
          pitch={fpJson.p}
          bodyWidth={fpJson.w}
        />
      )
    case "vssop":
      return (
        <VSSOP
          pinCount={fpJson.num_pins as 8 | 10}
          leadLength={fpJson.pl}
          leadWidth={fpJson.pw}
          pitch={fpJson.p}
          bodyWidth={fpJson.w}
          bodyLength={fpJson.h}
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
    case "tqfp":
      return <TQFP />
    case "lqfp":
      return <LQFP pinCount={fpJson.num_pins} />
    case "qfn": {
      const hasThermalPad =
        typeof fpJson.thermalpad?.x === "number" &&
        typeof fpJson.thermalpad?.y === "number"
      return (
        <QFN
          num_pins={fpJson.num_pins}
          bodyWidth={fpJson.w}
          bodyLength={fpJson.h}
          pitch={fpJson.p}
          padLength={fpJson.pl}
          padWidth={fpJson.pw}
          thermalPadSize={
            hasThermalPad
              ? {
                  width: fpJson.thermalpad!.x,
                  length: fpJson.thermalpad!.y,
                }
              : undefined
          }
        />
      )
    }

    case "dfn": {
      const hasThermalPad =
        typeof fpJson.thermalpad?.x === "number" &&
        typeof fpJson.thermalpad?.y === "number"
      return (
        <DFN
          num_pins={fpJson.num_pins}
          bodyWidth={fpJson.w}
          bodyLength={fpJson.h}
          pitch={fpJson.p}
          padLength={fpJson.pl}
          padWidth={fpJson.pw}
          thermalPadSize={
            hasThermalPad
              ? {
                  width: fpJson.thermalpad!.x,
                  length: fpJson.thermalpad!.y,
                }
              : undefined
          }
        />
      )
    }

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
    case "sot457":
      return <SOT457 />
    case "sot223":
      return <SOT223 />
    case "sot23w":
      return <SOT23W />
    case "sot323":
      return <SOT323 />
    case "sod323f":
      return <SOD323F />
    case "sod323fl":
      return <SOD323FL />
    case "sot363":
      return <SOT363 />
    case "sot886":
      return <SOT886 />
    case "sot963":
      return <SOT963 />
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
        <SOIC
          pinCount={fpJson.num_pins}
          leadLength={fpJson.pl}
          leadWidth={fpJson.pw}
          pitch={fpJson.p}
          bodyWidth={fpJson.w}
        />
      )
    case "sod523":
      return <SOD523 />
    case "sod882":
      return <SOD882 />
    case "sma":
      return <SMA />
    case "smb":
      return <SMB />
    case "smc":
      return <SMC />
    case "smf":
      return <SMF />
    case "sod123f":
      return <SOD123F />
    case "sod123fl":
      return <SOD123FL />
    case "sod123w":
      return <SOD123W />
    case "sod128":
      return <SOD128 />
    case "sod323":
      return <SOD323 />
    case "sod923":
      return <SOD923 />
    case "hc49":
      return <HC49 />
    case "micromelf":
      return <MicroMELF />
    case "minimelf":
      return <MINIMELF />
    case "melf":
      return <MELF />
    case "ms012":
      return (
        <MS012
          pinCount={fpJson.num_pins}
          padContactLength={fpJson.pl}
          leadWidth={fpJson.pw}
          pitch={fpJson.p}
        />
      )
    case "ms013":
      return (
        <MS013
          pinCount={fpJson.num_pins}
          padContactLength={fpJson.pl}
          leadWidth={fpJson.pw}
          pitch={fpJson.p}
        />
      )
    case "sot723":
      return <SOT723 />
    case "sot89":
      return <SOT89 />
    case "to220":
      return <TO220 />
    case "to92":
      return <TO92 />
  }

  const colorMatch = footprint.match(/_color\(([^)]+)\)/)
  const color = colorMatch ? colorMatch[1] : undefined

  switch (fpJson.imperial) {
    case "0402":
      return <A0402 color={color} />
    case "0603":
      return <A0603 color={color} />
    case "0805":
      return <A0805 color={color} />
    case "0201":
      return <A0201 color={color} />
    case "01005":
      return <A01005 color={color} />
    case "1206":
      return <A1206 color={color} />
    case "1210":
      return <A1210 color={color} />
    case "2010":
      return <A2010 color={color} />
    case "2512":
      return <A2512 color={color} />
  }
  return null
}
