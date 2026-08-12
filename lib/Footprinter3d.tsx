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
import { SOT233P } from "./SOT-23-3P"
import { SOT23W } from "./SOT-23W"
import { A0201 } from "./A0201"
import { A01005 } from "./A01005"
import { A1206 } from "./A1206"
import { A1210 } from "./A1210"
import { A2010 } from "./A2010"
import { A2512 } from "./A2512"
import { FemaleHeaderRow } from "./FemaleHeaderRow"
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
import { SOD123 } from "./sod-123"
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
import { SOT457 } from "./SOT-457"
import { SOT963 } from "./SOT-963"
import { TO92 } from "./TO92"
import SOT363 from "./SOT-363"
import { SOT886 } from "./SOT-886"
import { SOD323 } from "./sod-323"
import { SOD323F } from "./sod-323F"
import { SOD323FL } from "./sod-323FL"
import { AxialCapacitor } from "./AxialCapacitor"
import { StampBoard } from "./stampboard"
import { MountedPcbModule } from "./MountedPcbModule"
import SOD723 from "./SOD723"
import { JSTZH1_5mm } from "./JSTZH1_5mm"
import { Crystal } from "./Crystal"
import { FPC } from "./FPC"
import { SmdPinHeader } from "./SmdPinHeader"
import { mm } from "@tscircuit/mm"
import { ParametricChip } from "./ParametricChip"
import { Led5050 } from "./Led5050"
import { RJ45 } from "./RJ45"

/**
 * Outputs a 3d model for any [footprinter string](https://github.com/tscircuit/footprinter)
 */

export const Footprinter3d = ({ footprint }: { footprint: string }) => {
  // Normalize jstzh1_5mm formats to zh format
  let normalizedFootprint = footprint
  if (footprint.startsWith("jstzh1_5mm")) {
    const pinMatch = footprint.match(/jstzh1_5mm(\d+)?/)
    const numPins = pinMatch && pinMatch[1] ? pinMatch[1] : "7"
    normalizedFootprint = `zh${numPins}`
  }

  if (footprint.startsWith("sot23_3p")) {
    return <SOT233P />
  }
  if (footprint.startsWith("sot235")) {
    return <SOT235 />
  }

  const fpJson = fp.string(normalizedFootprint).json() as unknown as {
    w: number
    p: number
    bh?: number
    h: number
    pl: number
    pw: number
    ph?: number
    px?: number
    py?: number
    num_pins: number
    fn: string
    zh?: boolean
    thermalpad?: { x: number; y: number }
    imperial: String
    male: boolean
    female: boolean
    id: number //innerDiameter
    od: number //outerDiameter
    invert?: boolean
    faceup?: boolean
    smd?: boolean
    surface_mount?: boolean
    rightangle?: boolean
    left?: number
    right?: number
    top?: number
    bottom?: number
    innerhole?: boolean
    innerholeedgedistance?: number
    nopin?: boolean
    screen?: boolean
    screenwidth?: number
    screenheight?: number
    screencenteroffsetx?: number
    screencenteroffsety?: number
    staggered?: boolean
    reverse?: boolean
    toppl?: number
    bottompl?: number
    mpx?: number
    mpy?: number
    mounttop?: boolean
    mpw?: number
    mpl?: number
    ledpins?: boolean
    firstpinleft?: boolean
    firstpintop?: boolean
    shieldx?: number
    shieldy?: number
    shieldid?: number
    shieldod?: number
    holex?: number
    holey?: number
    holed?: number
    ledx?: number
    ledp?: number
    ledy?: number
    bodyy?: number
  }

  const colorMatch = footprint.match(/_color\(([^)]+)\)/)
  const color = colorMatch ? colorMatch[1] : undefined

  switch (fpJson.fn) {
    case "crystal":
      return (
        <Crystal
          horizontalPadPitch={fpJson.px}
          verticalPadPitch={fpJson.py}
          padWidth={fpJson.pw}
          padHeight={fpJson.ph}
        />
      )
    case "dip":
      return (
        <Dip numPins={fpJson.num_pins} pitch={fpJson.p} bodyWidth={fpJson.w} />
      )
    case "axial":
      return <AxialCapacitor pitch={fpJson.p} />
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

    case "pinrow": {
      // Parse rows parameter from footprint string (e.g., "pinrow4_rows2")
      const rowsMatch = footprint.match(/_rows(\d+)/)
      const rows = rowsMatch && rowsMatch[1] ? parseInt(rowsMatch[1], 10) : 1

      if (fpJson.male)
        return (
          <PinRow
            numberOfPins={fpJson.num_pins}
            pitch={fpJson.p}
            invert={fpJson.invert}
            faceup={fpJson.faceup}
            rows={rows}
            smd={fpJson.smd || fpJson.surface_mount}
            rightangle={fpJson.rightangle}
          />
        )
      if (fpJson.female)
        return (
          <FemaleHeaderRow
            numberOfPins={fpJson.num_pins}
            pitch={fpJson.p}
            rows={rows}
          />
        )
    }
    case "smdpinheader":
      return (
        <SmdPinHeader
          numberOfPins={fpJson.num_pins}
          pitch={fpJson.p}
          bodyWidth={fpJson.bh}
        />
      )
    case "led5050":
      return <Led5050 color={color} />

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
      // No EIA size to look up: the pads are the only description of the part,
      // so fall through to the parametric chip below. Without this `break` the
      // case ran on into `sot235` and a capacitor rendered as a transistor.
      break
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
    case "jst":
      if (fpJson.zh) {
        return <JSTZH1_5mm numPins={fpJson.num_pins} />
      }
      break
    case "fpc":
      return (
        <FPC
          pinCount={fpJson.num_pins}
          pitch={fpJson.p}
          padWidth={fpJson.pw}
          padLength={fpJson.pl}
          staggered={fpJson.staggered}
          reverse={fpJson.reverse}
          rowPitch={fpJson.py}
          topPadLength={fpJson.toppl}
          bottomPadLength={fpJson.bottompl}
          mountPadPitchX={fpJson.mpx}
          mountPadOffsetY={fpJson.mpy}
          mountTop={fpJson.mounttop}
          mountPadWidth={fpJson.mpw}
          mountPadLength={fpJson.mpl}
        />
      )
    case "rj45":
      return (
        <RJ45
          bodyWidth={fpJson.w}
          bodyDepth={fpJson.h}
          bodyCenterY={fpJson.bodyy}
          ledPins={fpJson.ledpins || fpJson.num_pins === 14}
          firstPinLeft={fpJson.firstpinleft}
          firstPinTop={fpJson.firstpintop}
          signalPitch={fpJson.p}
          signalRowPitch={fpJson.py}
          signalHoleDiameter={fpJson.id}
          shieldPinX={fpJson.shieldx}
          shieldPinY={fpJson.shieldy}
          shieldHoleDiameter={fpJson.shieldid}
          locatorHoleX={fpJson.holex}
          locatorHoleY={fpJson.holey}
          locatorHoleDiameter={fpJson.holed}
          ledPinX={fpJson.ledx}
          ledPinPitch={fpJson.ledp}
          ledPinY={fpJson.ledy}
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
    case "sod723":
      return <SOD723 />
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
    case "sod123":
      return <SOD123 />
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
    case "to220":
      return <TO220 />
    case "to92":
      return <TO92 />
    case "stampboard":
    case "stampreceiver":
      return (
        <StampBoard
          bodyWidth={fpJson.w}
          leadsLeft={fpJson.left}
          leadsRight={fpJson.right}
          leadsTop={fpJson.top}
          leadsBottom={fpJson.bottom}
          leadsPitch={fpJson.p}
          leadWidth={fpJson.pw}
          leadLength={fpJson.pl}
          innerHoles={fpJson.innerhole}
          innerHoleEdgeDistance={fpJson.innerholeedgedistance}
        />
      )
    case "mountedpcbmodule": {
      const rows = (fpJson as any).rows ?? 1
      const pinRowSide = (fpJson as any).pinRowSide ?? "left"
      const holeInset = (fpJson as any).holeInset
      const width = (fpJson as any).width
      const height = (fpJson as any).height
      const pinRow = (fpJson as any).pinrow
      const pinRowHoleEdgeToEdgeDist = (fpJson as any).pinRowHoleEdgeToEdgeDist
      const holes = Array.isArray((fpJson as any).holes)
        ? (fpJson as any).holes
        : []

      return (
        <MountedPcbModule
          numPins={pinRow}
          rows={rows}
          p={fpJson.p}
          id={fpJson.id}
          od={fpJson.od}
          width={width}
          height={height}
          pinRowSide={pinRowSide}
          holes={holes}
          holeInset={holeInset}
          pinRowHoleEdgeToEdgeDist={pinRowHoleEdgeToEdgeDist}
          nopin={fpJson.nopin}
          female={fpJson.female}
          screen={fpJson.screen}
          screenWidth={fpJson.screenwidth}
          screenHeight={fpJson.screenheight}
          screenCenterOffsetX={fpJson.screencenteroffsetx}
          screenCenterOffsetY={fpJson.screencenteroffsety}
        />
      )
    }
  }

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

  // A chip named by its pads rather than by an EIA size: `res_p0.8656mm_...`
  // and `cap_p0.8402mm_...` carry no `imperial`, so neither switch above can
  // match, and both used to end at `return null` -- an empty model, which
  // downstream renderers drop silently, taking the component off the board.
  //
  // Restricted to the two-terminal chip functions on purpose. Plenty of other
  // footprints carry a `p`, and a pin header is not a chip.
  if (
    (fpJson.fn === "res" || fpJson.fn === "cap") &&
    fpJson.p !== undefined &&
    fpJson.ph !== undefined
  ) {
    // `mm` is the parser footprinter itself uses on these same strings, so the
    // body agrees with the pads by construction -- including the inch forms
    // (`res_p0.1in_...`), which footprinter passes through unconverted.
    const padPitch = mm(fpJson.p)
    const padHeight = mm(fpJson.ph)
    if (Number.isFinite(padPitch) && Number.isFinite(padHeight)) {
      return (
        <ParametricChip
          padPitch={padPitch}
          padHeight={padHeight}
          color={color ?? (fpJson.fn === "cap" ? "#856c4d" : undefined)}
        />
      )
    }
  }

  return null
}
