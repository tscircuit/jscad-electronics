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
import { SOD123 } from "./sod-123"
import { AxialCapacitor } from "./AxialCapacitor"
import { StampBoard } from "./stampboard"
import { MountedPcbModule } from "./MountedPcbModule"
import SOD723 from "./SOD723"
import { JSTZH1_5mm } from "./JSTZH1_5mm"
import { JST } from "./JST"
import { FPC } from "./FPC"
import { SmdPinHeader } from "./SmdPinHeader"
import { RJ45 } from "./RJ45"
import { BGA } from "./BGA"
import { SOT233P } from "./SOT-23-3P"
import { SOT563 } from "./SOT-563"
import { SOT89 } from "./SOT89"
import { SOT343 } from "./SOT343"
import { SmdDiode } from "./SmdDiode"
import { DPAK } from "./DPAK"
import { RadialCapacitor } from "./RadialCapacitor"
import { ElectrolyticCapacitor } from "./ElectrolyticCapacitor"
import { Potentiometer } from "./Potentiometer"
import { Crystal } from "./Crystal"
import { SmdPushButton } from "./SmdPushButton"
import { LED2835 } from "./LED2835"
import { LED5050 } from "./LED5050"
import { SolderJumper } from "./SolderJumper"
import { M2Host } from "./M2Host"
import { USB_C } from "./USB-C"
import { FootprintPad } from "./FootprintPad"
import { FootprintPlatedHole } from "./FootprintPlatedHole"
import type { PcbPlatedHole, PcbSmtPad } from "circuit-json"

/** Parse footprinter values that may be numbers or strings like "3mm" */
const fpNum = (v: unknown, fallback = 0): number => {
  const n = typeof v === "number" ? v : Number.parseFloat(String(v))
  return Number.isFinite(n) ? n : fallback
}

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

  const fpJson = fp.string(normalizedFootprint).json() as unknown as {
    w: number
    p: number
    bh?: number
    h: number
    pl: number
    pw: number
    num_pins: number
    fn: string
    zh?: boolean
    sh?: boolean
    ph?: boolean
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
    py?: number
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
    // Allow any additional footprinter fields (grid, tabw, epw, ...)
    [key: string]: unknown
  }

  switch (fpJson.fn) {
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
    case "jst": {
      const series = fpJson.zh ? "zh" : fpJson.sh ? "sh" : "ph"
      return <JST numPins={fpJson.num_pins} series={series} />
    }
    case "bga":
    case "lga":
      return <BGA footprintString={normalizedFootprint} />
    case "quad":
    case "mlp": {
      const hasThermalPad = fpJson.fn === "mlp" || !!fpJson.thermalpad
      return (
        <QFN
          num_pins={fpJson.num_pins}
          bodyWidth={fpNum(fpJson.w, 10)}
          bodyLength={fpNum(fpJson.h, 10)}
          pitch={fpNum(fpJson.p, 0.5)}
          padLength={fpNum(fpJson.pl, 0.25)}
          padWidth={fpNum(fpJson.pw, 0.25)}
          thermalPadSize={hasThermalPad ? { width: 5, length: 5 } : undefined}
        />
      )
    }
    case "son":
    case "vson":
    case "wson": {
      const epw = fpNum(fpJson.epw, 0)
      const eph = fpNum(fpJson.eph, 0)
      const hasThermalPad = epw > 0 && eph > 0
      return (
        <QFN
          num_pins={fpJson.num_pins}
          bodyWidth={fpNum(fpJson.w, 3)}
          bodyLength={fpNum(fpJson.h, 3)}
          pitch={fpNum(fpJson.p, 0.5)}
          padLength={fpNum(fpJson.pl, 0.5)}
          padWidth={fpNum(fpJson.pw, 0.3)}
          thermalPadSize={
            hasThermalPad ? { width: epw, length: eph } : undefined
          }
        />
      )
    }
    case "sop8":
    case "ssop":
      return (
        <SOIC
          pinCount={fpJson.num_pins}
          leadLength={fpJson.pl}
          leadWidth={fpJson.pw}
          pitch={fpJson.p}
          bodyWidth={fpJson.w}
        />
      )
    case "sot":
    case "sot363":
      return <SOT363 />
    case "sot23":
      return <SOT233P />
    case "sot25":
      return <SOT235 />
    case "sot563":
      return <SOT563 />
    case "sot343":
      return <SOT343 />
    case "sot89":
      return <SOT89 />
    case "dpak":
    case "to252":
      return (
        <DPAK
          numPins={fpJson.num_pins}
          bodyWidth={fpNum(fpJson.w, 6.6)}
          bodyLength={fpNum(fpJson.h, 6.5)}
          pitch={fpNum(fpJson.p, 2.29)}
          leadWidth={fpNum(fpJson.pw, 0.9)}
          tabWidth={fpNum(fpJson.tabw, 6.2)}
        />
      )
    case "d2pak":
    case "to263":
      return (
        <DPAK
          numPins={fpJson.num_pins}
          bodyWidth={fpNum(fpJson.w, 10.1)}
          bodyLength={fpNum(fpJson.h, 10.1)}
          bodyHeight={3.5}
          pitch={fpNum(fpJson.p, 2.54)}
          leadWidth={fpNum(fpJson.pw, 1.2)}
          tabWidth={fpNum(fpJson.tabw, 8.38)}
        />
      )
    case "to220f":
      return <TO220 />
    case "to92l":
    case "to92s":
      return <TO92 />
    case "radial":
      return <RadialCapacitor pitch={fpNum(fpJson.p, 5)} />
    case "electrolytic":
      return (
        <ElectrolyticCapacitor
          diameter={fpNum(fpJson.d, 10.5)}
          pitch={fpNum(fpJson.p, 7.5)}
        />
      )
    case "potentiometer":
      return (
        <Potentiometer
          diameter={fpNum(fpJson.ca, 14)}
          height={fpNum(fpJson.h, 4)}
          pitch={fpNum(fpJson.p, 5)}
          numPins={fpJson.num_pins}
        />
      )
    case "crystal":
      return (
        <Crystal
          padPitchX={fpNum(fpJson.px, 2.2)}
          padPitchY={fpNum(fpJson.py, 1.7)}
          padWidth={fpNum(fpJson.pw, 1.4)}
          padLength={fpNum(fpJson.ph, 1.2)}
        />
      )
    case "smdpushbutton":
      return (
        <SmdPushButton
          padPitchX={fpNum(fpJson.px, 4.2)}
          padPitchY={fpNum(fpJson.py, 2.15)}
          padWidth={fpNum(fpJson.pw, 1.05)}
          padLength={fpNum(fpJson.ph, 0.7)}
        />
      )
    case "led2835":
      return <LED2835 />
    case "led5050":
      return (
        <LED5050
          pitch={fpNum(fpJson.p, 1.7)}
          rowSpan={fpNum(fpJson.rowspan, 4.8)}
        />
      )
    case "solderjumper":
      return <SolderJumper />
    case "m2host":
      return <M2Host />
    case "usbcmidmount":
      return <USB_C />
    case "breakoutheaders":
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
    case "smbf":
      return (
        <SmdDiode
          fullWidth={fpNum(fpJson.w, 6.5)}
          bodyLength={fpNum(fpJson.h, 3)}
          leadWidth={fpNum(fpJson.pw, 1.2)}
          padContactLength={fpNum(fpJson.pl, 1) * 0.5}
        />
      )
    case "sod110":
      return (
        <SmdDiode
          fullWidth={fpNum(fpJson.w, 3.3)}
          bodyLength={fpNum(fpJson.h, 1.7)}
          leadWidth={fpNum(fpJson.pw, 1)}
        />
      )
    case "sod80":
      return (
        <SmdDiode
          fullWidth={fpNum(fpJson.w, 5.0)}
          bodyLength={fpNum(fpJson.h, 2.3)}
          leadWidth={fpNum(fpJson.pw, 2)}
        />
      )
    case "sod323w":
      return (
        <SmdDiode
          fullWidth={fpNum(fpJson.w, 3.8)}
          bodyLength={fpNum(fpJson.h, 1.65)}
          leadWidth={fpNum(fpJson.pw, 0.9)}
        />
      )
    case "sod882d":
      return (
        <SmdDiode
          fullWidth={fpNum(fpJson.w, 1.9)}
          bodyLength={fpNum(fpJson.h, 1.33)}
          leadWidth={fpNum(fpJson.pw, 0.7)}
          leadThickness={0.08}
          leadHeight={0.35}
        />
      )
    case "sod123":
      return <SOD123 />
    case "smtpad":
    case "pad": {
      const pad: PcbSmtPad = {
        type: "pcb_smtpad",
        pcb_smtpad_id: "smtpad_0",
        shape: "rect",
        x: 0,
        y: 0,
        width: fpNum(fpJson.width ?? fpJson.pw, 1),
        height: fpNum(fpJson.height ?? fpJson.ph, 1),
        layer: "top",
      }
      return <FootprintPad pad={pad} />
    }
    case "platedhole": {
      const hole: PcbPlatedHole = {
        type: "pcb_plated_hole",
        pcb_plated_hole_id: "platedhole_0",
        shape: "circle",
        x: 0,
        y: 0,
        hole_diameter: fpNum(fpJson.d, 1),
        outer_diameter: fpNum(fpJson.pd, 1.5),
        layers: ["top", "bottom"],
      }
      return <FootprintPlatedHole hole={hole} />
    }
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
