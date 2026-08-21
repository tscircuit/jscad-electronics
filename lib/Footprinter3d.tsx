import { fp } from "@tscircuit/footprinter"
import { mp } from "@tscircuit/modelprinter"
import { Rotate, Translate } from "jscad-fiber"
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
import { JSTPH2_0mm } from "./JSTPH2_0mm"
import { Crystal } from "./Crystal"
import { FPC } from "./FPC"
import { SmdPinHeader } from "./SmdPinHeader"
import { mm } from "@tscircuit/mm"
import { getPlatedHoleCenters } from "./utils/getPlatedHoleCenters"
import { getSmtPadRects } from "./utils/getSmtPadRects"
import { GullWingBody } from "./GullWingBody"
import { ParametricChip } from "./ParametricChip"
import { Led5050 } from "./Led5050"
import { Led2835 } from "./Led2835"
import { RJ45 } from "./RJ45"
import { DPAK } from "./DPAK"
import { ElectrolyticCapacitor } from "./ElectrolyticCapacitor"
import { Potentiometer } from "./Potentiometer"
import { SmdPushButton } from "./SmdPushButton"
import { SOT563 } from "./SOT-563"
import { BGA } from "./BGA"
import { FlexScreen } from "./FlexScreen"

/**
 * Outputs a 3d model for any [footprinter string](https://github.com/tscircuit/footprinter)
 */

export const Footprinter3d = ({ footprint }: { footprint: string }) => {
  const modelFn = mp.string(footprint.split("_", 1)[0]!).params().fn
  if (mp.getModelNames().includes(modelFn)) {
    const model = mp.string(footprint).json()
    switch (model.fn) {
      case "flexscreen": {
        const { fn: _, ...flexScreenProps } = model
        return <FlexScreen {...flexScreenProps} />
      }
    }
  }

  // Normalize jstzh1_5mm formats to zh format
  let normalizedFootprint = footprint
  if (footprint.startsWith("jstzh1_5mm")) {
    const pinMatch = footprint.match(/jstzh1_5mm(\d+)?/)
    const numPins = pinMatch && pinMatch[1] ? pinMatch[1] : "7"
    normalizedFootprint = `zh${numPins}`
  } else if (footprint.startsWith("jstph2_0mm")) {
    const pinMatch = footprint.match(/jstph2_0mm(\d+)?/)
    const numPins = pinMatch && pinMatch[1] ? pinMatch[1] : "2"
    normalizedFootprint = `jst${numPins}_ph`
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
    // TO-252 / TO-263: the exposed tab pad, and the lead-pad-to-tab-pad span
    tabw?: number
    tabh?: number
    span?: number
    // radial / electrolytic can
    d?: number
    // potentiometer body length along Y
    ca?: number
    // no-lead packages: exposed thermal pad, and whether leads sit outside
    // the body outline (QFP) or flush under it (QFN)
    ep?: boolean | { x: number; y: number }
    epw?: number
    eph?: number
    legsoutside?: boolean
    // grid packages (bga, lga, vson): pads by row/column
    grid?: { x: number; y: number }
    // led2835's two differently-sized pads
    p1w?: number
    p2w?: number
    p1x?: number
    p2x?: number
  }

  const colorMatch = footprint.match(/_color\(([^)]+)\)/)
  const color = colorMatch ? colorMatch[1] : undefined

  /**
   * footprinter reports a dimension as either a number or a string with a
   * unit (`"4.20mm"`), and omits it entirely when the footprint does not
   * define one. `mm` is the parser footprinter itself uses, so a body agrees
   * with its pads by construction; this only adds the missing case, because
   * `mm(undefined)` throws.
   */
  const dim = (value: unknown, fallback: number): number => {
    if (value === undefined || value === null) return fallback
    const parsed = mm(value as any)
    return Number.isFinite(parsed) ? parsed : fallback
  }

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
    case "sot23":
      switch (fpJson.num_pins) {
        case 3:
          return <SOT233P color={color} />
        case 5:
          return <SOT235 />
      }
      break
    case "sot25":
      // SOT-23-5: the same 2.9 x 1.6 body as `sot23` with five pins.
      return <SOT235 />
    case "sot":
    case "sot343": {
      // Two packages whose LEAD COUNT does not match the body they would
      // otherwise be aliased to: footprinter's bare `sot` is a six-pin SOT-23
      // (SOT235 draws five) and `sot343` is SC-70-4 (SOT363 draws six). A
      // render makes that obvious — six pads under five leads — so both build
      // their leads from the pads instead.
      //
      // The BODY, though, is the designation's, not the pads': SOT-23-6 is
      // 1.60 x 2.90 and SC-70-4 is 1.25 x 2.00, per KiCad's F.Fab outlines
      // (`SOT-23-6`, `SOT-343_SC-70-4`) — the same reference footprinter's
      // kicad-parity tests use. Deriving those from the pad span instead put
      // SC-70-4 10% under size.
      const isSc70 = fpJson.fn === "sot343"
      return (
        <GullWingBody
          pads={getSmtPadRects(normalizedFootprint)}
          bodyWidth={isSc70 ? 1.25 : 1.6}
          bodyLength={isSc70 ? 2.0 : 2.9}
          bodyHeight={isSc70 ? 1.1 : 1.3}
        />
      )
    }
    case "sot563":
      return <SOT563 />
    case "sot89": {
      // SOT-89 is a SOT-223 at roughly a third of the volume: three leads one
      // side, one wide tab lead the other. Aliasing it to SOT-223 outright
      // would report a 6.5 x 3.5 body where there is a 4.5 x 2.5 one.
      const padSpan = dim(fpJson.w, 4.2)
      return (
        <SOT223
          fullWidth={padSpan}
          bodyWidth={padSpan * 0.6}
          bodyLength={dim(fpJson.h, 4.8) * 0.94}
          bodyHeight={1.5}
          leadWidth={dim(fpJson.pw, 0.48)}
          tabLeadWidth={dim(fpJson.pw, 0.48) * 2}
          padPitch={dim(fpJson.p, 1.5)}
          leadHeight={0.66}
        />
      )
    }
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
      if (fpJson.ph) {
        return <JSTPH2_0mm numPins={fpJson.num_pins} />
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
    case "sop8":
    case "ssop":
      // SOP and SSOP are SOIC with different lead spans, and SOIC is already
      // driven entirely by the footprint's own numbers.
      return (
        <SOIC
          pinCount={fpJson.num_pins}
          leadLength={fpJson.pl}
          leadWidth={fpJson.pw}
          pitch={fpJson.p}
          bodyWidth={fpJson.w}
        />
      )
    case "son":
    case "wson":
    case "vson": {
      // Small-outline no-lead: terminals on two opposite edges, which is a
      // DFN. `vson` is the odd one: it describes its body outline as `grid`
      // (a SIZE, e.g. grid2x3mm) while `w` is the row span. `son` and `wson`
      // give w/h directly.
      const bodyWidth =
        fpJson.fn === "vson" ? dim(fpJson.grid?.x, 3) : dim(fpJson.w, 3)
      const bodyLength =
        fpJson.fn === "vson" ? dim(fpJson.grid?.y, 3) : dim(fpJson.h, 3)
      const thermalPadWidth = dim(fpJson.epw, 0)
      const thermalPadLength = dim(fpJson.eph, 0)
      const padLength = fpJson.pl !== undefined ? dim(fpJson.pl, 0) : undefined
      const padWidth = fpJson.pw !== undefined ? dim(fpJson.pw, 0) : undefined

      // WHICH edges the terminals sit on is a property of the footprint, not
      // of the family: `son` and `vson` put their two rows left and right,
      // `wson` puts them top and bottom. DFN always builds left and right, so
      // a `wson` came out turned 90 degrees from its own pads, with terminals
      // along the two edges the footprint has none on. Read the axis from the
      // pads, ignoring the thermal pad, which is not a row member.
      const signalPads = getSmtPadRects(normalizedFootprint).filter(
        (pad) => Number(pad.pin ?? 0) <= fpJson.num_pins,
      )
      const distinct = (values: number[]) =>
        new Set(values.map((value) => value.toFixed(3))).size
      const rowsAlongY =
        signalPads.length > 2 &&
        distinct(signalPads.map((pad) => pad.y)) === 2 &&
        distinct(signalPads.map((pad) => pad.x)) > 2

      const dfn = (
        <DFN
          num_pins={fpJson.num_pins}
          // Built in DFN's own frame and then turned to match the footprint,
          // so the body's X and Y swap with it, and the thermal pad's too.
          bodyWidth={rowsAlongY ? bodyLength : bodyWidth}
          bodyLength={rowsAlongY ? bodyWidth : bodyLength}
          pitch={dim(fpJson.p, 0.5)}
          padLength={padLength}
          padWidth={padWidth}
          thermalPadSize={
            fpJson.ep && thermalPadWidth > 0 && thermalPadLength > 0
              ? {
                  width: rowsAlongY ? thermalPadLength : thermalPadWidth,
                  length: rowsAlongY ? thermalPadWidth : thermalPadLength,
                }
              : undefined
          }
        />
      )
      return rowsAlongY ? (
        <Rotate rotation={[0, 0, "90deg"]}>{dfn}</Rotate>
      ) : (
        dfn
      )
    }
    case "mlp":
    case "lga":
    case "quad": {
      // Quad packages whose leads sit under the body are QFNs; footprinter's
      // `legsoutside` says when they stick out, which is a QFP. `lga` has no
      // leads at all, so its flush lands render as the smallest QFN pads.
      if (fpJson.legsoutside) {
        return (
          <QFP
            pinCount={fpJson.num_pins}
            pitch={dim(fpJson.p, 0.5)}
            leadWidth={dim(fpJson.pw, 0.25)}
            padContactLength={dim(fpJson.pl, 0.25)}
            bodyWidth={dim(fpJson.w, 6)}
          />
        )
      }
      // NOT `grid`: for these it is a pad COUNT per side (lga14 is 4x3 pads),
      // not a size. Reading it as millimetres gave a 4 x 3 body for a part
      // that is 2.4 x 2.9 — wrong by 60%, and invisible in a render.
      return (
        <QFN
          num_pins={fpJson.num_pins}
          bodyWidth={dim(fpJson.w, 6)}
          bodyLength={dim(fpJson.h, 6)}
          pitch={dim(fpJson.p, 0.5)}
          padLength={dim(fpJson.pl, 0.25)}
          padWidth={dim(fpJson.pw, 0.25)}
        />
      )
    }
    case "bga": {
      // BGA.tsx has been in this repo, unreferenced, the whole time.
      const pitch = dim(fpJson.p, 0.8)
      const columns = fpJson.grid?.x ?? 8
      const rows = fpJson.grid?.y ?? 8
      return (
        <BGA
          ballPitch={pitch}
          ballColumns={columns}
          ballRows={rows}
          ballDiameter={pitch * 0.625}
          packageWidth={columns * pitch}
          packageLength={rows * pitch}
        />
      )
    }
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
    case "sod110":
      // SOD-110 is NOT a SOD-123W: 2.10 x 1.40 against 2.60 x 1.70 (KiCad
      // F.Fab, D_SOD-110 and Nexperia_CFP3_SOD-123W). Same construction, so
      // the same component — at its own size.
      return <SOD123W bodyWidth={2.1} bodyLength={1.4} />
    case "sod128":
      return <SOD128 />
    case "sod323":
      return <SOD323 />
    case "sod323w":
      return <SOD323 />
    case "sod80":
      // SOD-80 is the MiniMELF glass body: 3.5 long, 1.5 across.
      return <MINIMELF />
    case "sod882d":
      return <SOD882 />
    case "smbf":
      // SMBF is SMB's flat (low-profile) variant; same outline.
      return <SMB />
    case "led2835":
      return (
        <Led2835
          color={color}
          bodyWidth={dim(fpJson.w, 3.5)}
          bodyLength={dim(fpJson.h, 2.8)}
          pad1X={dim(fpJson.p1x, -0.9)}
          pad1Width={dim(fpJson.p1w, 2.2)}
          pad2X={dim(fpJson.p2x, 1.375)}
          pad2Width={dim(fpJson.p2w, 1.25)}
          padLength={dim(fpJson.ph, 2.2)}
        />
      )
    case "electrolytic":
    case "radial": {
      // A radial can. The diameter is the one dimension that matters for an
      // enclosure cavity and it is not always in the json: `electrolytic`
      // reports `d`, `radial` puts it in the NAME (radial_d5_p2.5). Falling
      // back to twice the lead pitch matches both of footprinter's own
      // defaults, and the height is derived — see ElectrolyticCapacitor.
      const pitch = dim(fpJson.p, 2.5)
      const namedDiameter = footprint.match(/_d([\d.]+)/)
      const diameter =
        fpJson.d !== undefined
          ? dim(fpJson.d, pitch * 2)
          : namedDiameter
            ? Number(namedDiameter[1])
            : pitch * 2
      return <ElectrolyticCapacitor diameter={diameter} leadPitch={pitch} />
    }
    case "potentiometer":
      return (
        <Potentiometer
          bodyWidth={dim(fpJson.w, 5.35)}
          bodyLength={dim(fpJson.ca, 14)}
          bodyHeight={dim(fpJson.h, 4)}
          leads={getPlatedHoleCenters(normalizedFootprint)}
        />
      )
    case "smdpushbutton":
      return (
        <SmdPushButton
          padSpanX={dim(fpJson.px, 4.2)}
          padSpanY={dim(fpJson.py, 2.15)}
          padWidth={dim(fpJson.pw, 1.05)}
          padLength={dim(fpJson.ph, 0.7)}
        />
      )
    case "breakoutheaders": {
      // A breakout board carries a through-hole header down each side; the
      // headers are the tall part, and PinRow already models one.
      const pitch = dim(fpJson.p, 2.54)
      const halfWidth = dim(fpJson.w, 10) / 2
      const sides: Array<{ x: number; pins: number; key: string }> = [
        { x: -halfWidth, pins: fpJson.left ?? 0, key: "left" },
        { x: halfWidth, pins: fpJson.right ?? 0, key: "right" },
      ]
      return (
        <>
          {sides
            .filter(({ pins }) => pins > 0)
            .map(({ x, pins, key }) => (
              <Translate center={[x, 0, 0]} key={key}>
                <Rotate rotation={[0, 0, "90deg"]}>
                  <PinRow numberOfPins={pins} pitch={pitch} />
                </Rotate>
              </Translate>
            ))}
        </>
      )
    }
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
      return <TO220 leads={getPlatedHoleCenters(normalizedFootprint)} />
    case "to220f":
      // TO-220F is the fully-moulded (isolated) variant: same outline, tab
      // encapsulated rather than exposed.
      return (
        <TO220 mouldedTab leads={getPlatedHoleCenters(normalizedFootprint)} />
      )
    case "to92":
      return <TO92 leads={getPlatedHoleCenters(normalizedFootprint)} />
    case "to92l":
    case "to92s": {
      // Both are TO-92 at a different size, and the size is the whole reason
      // they are separate footprints: `to92l` is 4.8mm across, `to92s` 2.5mm.
      // The footprint's two extents are the cylinder and the flat-cut face.
      //
      // The lead PATTERN differs too, and is not in the json: `to92s` is
      // inline where `to92` is staggered, and `to92l` puts pin 1 at the
      // origin rather than centring the group. Taking the holes themselves is
      // the only way all three line up.
      const across = dim(fpJson.w, 4.8)
      const along = dim(fpJson.h, 4.0)
      const diameter = Math.max(across, along)
      return (
        <TO92
          bodyDiameter={diameter}
          flatCut={Math.max(diameter - Math.min(across, along), 0.4)}
          leads={getPlatedHoleCenters(normalizedFootprint)}
        />
      )
    }
    case "to252":
    case "dpak":
    case "to263":
    case "d2pak": {
      // TO-252/DPAK and TO-263/D2PAK are one construction at two sizes: a
      // moulded body on a large exposed tab, leads leaving the far face. The
      // footprint is asymmetric (leads at -span/2, tab at +span/2), so the
      // body sits over the TAB, not over the origin.
      const isD2Pak = fpJson.fn === "to263" || fpJson.fn === "d2pak"
      const tabWidth = dim(fpJson.tabw, isD2Pak ? 8.38 : 6.2)
      // The tab's own size, not the tab PAD's: footprinter draws a 10.7mm pad
      // for a TO-263 whose package is 10.0 across (KiCad TO-263-2 F.Fab), and
      // a body may not inherit a land's solder allowance.
      const tabLength = Math.min(
        dim(fpJson.tabh, isD2Pak ? 10 : 5.8),
        isD2Pak ? 10 : 6.5,
      )
      return (
        <DPAK
          bodyWidth={tabWidth}
          bodyLength={dim(fpJson.w, isD2Pak ? 10.1 : 6.6)}
          bodyHeight={isD2Pak ? 4.4 : 2.3}
          tabWidth={tabWidth}
          tabLength={tabLength}
          span={dim(fpJson.span, isD2Pak ? 10.21 : 6.85)}
          pitch={dim(fpJson.p, isD2Pak ? 2.54 : 2.29)}
          leadWidth={dim(fpJson.pw, 1.5)}
          leadContactLength={dim(fpJson.pl, 3)}
        />
      )
    }
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
