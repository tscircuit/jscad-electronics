import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  PillowBlockBearing,
  createPillowBlockBearingGeom,
  createPillowBlockBearingMesh,
} from "../lib/models/pillowblockbearing"
import {
  FlangeBearing,
  createFlangeBearingGeom,
  createFlangeBearingMesh,
} from "../lib/models/flangebearing"
import {
  NeedleBearing,
  createNeedleBearingGeom,
  createNeedleBearingMesh,
} from "../lib/models/needlebearing"
import {
  CylindricalRollerBearing,
  createCylindricalRollerBearingGeom,
  createCylindricalRollerBearingMesh,
} from "../lib/models/cylindricalrollerbearing"
import {
  CamFollower,
  createCamFollowerGeom,
  createCamFollowerMesh,
} from "../lib/models/camfollower"
import {
  VGrooveWheel,
  createVGrooveWheelGeom,
  createVGrooveWheelMesh,
} from "../lib/models/vgroovewheel"
import {
  RodEnd,
  createRodEndGeom,
  createRodEndMesh,
} from "../lib/models/rodend"
import {
  SphericalBearing,
  createSphericalBearingGeom,
  createSphericalBearingMesh,
} from "../lib/models/sphericalbearing"
import {
  Clevis,
  createClevisGeom,
  createClevisMesh,
} from "../lib/models/clevis"
import {
  GearRack,
  createGearRackGeom,
  createGearRackMesh,
} from "../lib/models/gearrack"
import {
  Sprocket,
  createSprocketGeom,
  createSprocketMesh,
} from "../lib/models/sprocket"
import {
  RollerChain,
  createRollerChainGeom,
  createRollerChainMesh,
} from "../lib/models/rollerchain"
import {
  VBeltSheave,
  createVBeltSheaveGeom,
  createVBeltSheaveMesh,
} from "../lib/models/vbeltsheave"
import {
  ConveyorRoller,
  createConveyorRollerGeom,
  createConveyorRollerMesh,
} from "../lib/models/conveyorroller"
import {
  ShaftSupport,
  createShaftSupportGeom,
  createShaftSupportMesh,
} from "../lib/models/shaftsupport"

test("pillowblockbearing: direct component and model-string routing have matching geometry and no pads", () => {
  const source =
    "pillowblockbearing_bore20mm_bw80mm_bd30mm_bt8mm_hd46mm_ch30mm_ms60mm_mh6mm"
  const definition = mp.string(source).json()
  if (definition.fn !== "pillowblockbearing")
    throw new Error("Unexpected model")
  const { fn, ...p } = definition
  const reference = jscad.measurements.measureVolume(
    createPillowBlockBearingGeom(p),
  )
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  for (const result of [
    getComponentModel(PillowBlockBearing, p),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(result.geometries.length).toBeGreaterThan(0)
    expect(
      result.geometries.reduce(
        (sum, entry) => sum + jscad.measurements.measureVolume(entry.geom),
        0,
      ),
    ).toBeCloseTo(reference, 3)
  }
  expect(() => Footprinter3d({ footprint: source + "_typo1mm" })).toThrow()
})

test("flangebearing: direct component and model-string routing have matching geometry and no pads", () => {
  const source =
    "flangebearing_bore20mm_fw64mm_ft6mm_hd44mm_hh20mm_ms46mm_mh6mm"
  const definition = mp.string(source).json()
  if (definition.fn !== "flangebearing") throw new Error("Unexpected model")
  const { fn, ...p } = definition
  const reference = jscad.measurements.measureVolume(createFlangeBearingGeom(p))
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  for (const result of [
    getComponentModel(FlangeBearing, p),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(result.geometries.length).toBeGreaterThan(0)
    expect(
      result.geometries.reduce(
        (sum, entry) => sum + jscad.measurements.measureVolume(entry.geom),
        0,
      ),
    ).toBeCloseTo(reference, 3)
  }
  expect(() => Footprinter3d({ footprint: source + "_typo1mm" })).toThrow()
})

test("needlebearing: direct component and model-string routing have matching geometry and no pads", () => {
  const source = "needlebearing_id20mm_od30mm_w20mm_race1.5mm_rollers18"
  const definition = mp.string(source).json()
  if (definition.fn !== "needlebearing") throw new Error("Unexpected model")
  const { fn, ...p } = definition
  const reference = jscad.measurements.measureVolume(createNeedleBearingGeom(p))
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  for (const result of [
    getComponentModel(NeedleBearing, p),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(result.geometries.length).toBeGreaterThan(0)
    expect(
      result.geometries.reduce(
        (sum, entry) => sum + jscad.measurements.measureVolume(entry.geom),
        0,
      ),
    ).toBeCloseTo(reference, 3)
  }
  expect(() => Footprinter3d({ footprint: source + "_typo1mm" })).toThrow()
})

test("cylindricalrollerbearing: direct component and model-string routing have matching geometry and no pads", () => {
  const source =
    "cylindricalrollerbearing_id20mm_od42mm_w16mm_race3mm_rollers12"
  const definition = mp.string(source).json()
  if (definition.fn !== "cylindricalrollerbearing")
    throw new Error("Unexpected model")
  const { fn, ...p } = definition
  const reference = jscad.measurements.measureVolume(
    createCylindricalRollerBearingGeom(p),
  )
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  for (const result of [
    getComponentModel(CylindricalRollerBearing, p),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(result.geometries.length).toBeGreaterThan(0)
    expect(
      result.geometries.reduce(
        (sum, entry) => sum + jscad.measurements.measureVolume(entry.geom),
        0,
      ),
    ).toBeCloseTo(reference, 3)
  }
  expect(() => Footprinter3d({ footprint: source + "_typo1mm" })).toThrow()
})

test("camfollower: direct component and model-string routing have matching geometry and no pads", () => {
  const source = "camfollower_od32mm_w14mm_stud10mm_sl26mm_socket5mm_rollers10"
  const definition = mp.string(source).json()
  if (definition.fn !== "camfollower") throw new Error("Unexpected model")
  const { fn, ...p } = definition
  const reference = jscad.measurements.measureVolume(createCamFollowerGeom(p))
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  for (const result of [
    getComponentModel(CamFollower, p),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(result.geometries.length).toBeGreaterThan(0)
    expect(
      result.geometries.reduce(
        (sum, entry) => sum + jscad.measurements.measureVolume(entry.geom),
        0,
      ),
    ).toBeCloseTo(reference, 3)
  }
  expect(() => Footprinter3d({ footprint: source + "_typo1mm" })).toThrow()
})

test("vgroovewheel: direct component and model-string routing have matching geometry and no pads", () => {
  const source = "vgroovewheel_od40mm_root28mm_bore8mm_w12mm"
  const definition = mp.string(source).json()
  if (definition.fn !== "vgroovewheel") throw new Error("Unexpected model")
  const { fn, ...p } = definition
  const reference = jscad.measurements.measureVolume(createVGrooveWheelGeom(p))
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  for (const result of [
    getComponentModel(VGrooveWheel, p),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(result.geometries.length).toBeGreaterThan(0)
    expect(
      result.geometries.reduce(
        (sum, entry) => sum + jscad.measurements.measureVolume(entry.geom),
        0,
      ),
    ).toBeCloseTo(reference, 3)
  }
  expect(() => Footprinter3d({ footprint: source + "_typo1mm" })).toThrow()
})

test("rodend: direct component and model-string routing have matching geometry and no pads", () => {
  const source = "rodend_hd28mm_bore12mm_w12mm_stem10mm_sl30mm"
  const definition = mp.string(source).json()
  if (definition.fn !== "rodend") throw new Error("Unexpected model")
  const { fn, ...p } = definition
  const reference = jscad.measurements.measureVolume(createRodEndGeom(p))
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  for (const result of [
    getComponentModel(RodEnd, p),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(result.geometries.length).toBeGreaterThan(0)
    expect(
      result.geometries.reduce(
        (sum, entry) => sum + jscad.measurements.measureVolume(entry.geom),
        0,
      ),
    ).toBeCloseTo(reference, 3)
  }
  expect(() => Footprinter3d({ footprint: source + "_typo1mm" })).toThrow()
})

test("sphericalbearing: direct component and model-string routing have matching geometry and no pads", () => {
  const source = "sphericalbearing_od30mm_bore12mm_w14mm_ball22mm"
  const definition = mp.string(source).json()
  if (definition.fn !== "sphericalbearing") throw new Error("Unexpected model")
  const { fn, ...p } = definition
  const reference = jscad.measurements.measureVolume(
    createSphericalBearingGeom(p),
  )
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  for (const result of [
    getComponentModel(SphericalBearing, p),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(result.geometries.length).toBeGreaterThan(0)
    expect(
      result.geometries.reduce(
        (sum, entry) => sum + jscad.measurements.measureVolume(entry.geom),
        0,
      ),
    ).toBeCloseTo(reference, 3)
  }
  expect(() => Footprinter3d({ footprint: source + "_typo1mm" })).toThrow()
})

test("clevis: direct component and model-string routing have matching geometry and no pads", () => {
  const source = "clevis_w30mm_l45mm_h20mm_gap14mm_back10mm_pin8mm_mount10mm"
  const definition = mp.string(source).json()
  if (definition.fn !== "clevis") throw new Error("Unexpected model")
  const { fn, ...p } = definition
  const reference = jscad.measurements.measureVolume(createClevisGeom(p))
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  for (const result of [
    getComponentModel(Clevis, p),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(result.geometries.length).toBeGreaterThan(0)
    expect(
      result.geometries.reduce(
        (sum, entry) => sum + jscad.measurements.measureVolume(entry.geom),
        0,
      ),
    ).toBeCloseTo(reference, 3)
  }
  expect(() => Footprinter3d({ footprint: source + "_typo1mm" })).toThrow()
})

test("gearrack: direct component and model-string routing have matching geometry and no pads", () => {
  const source = "gearrack_pitch8mm_teeth12_w12mm_h8mm_th4mm_mh3.5mm"
  const definition = mp.string(source).json()
  if (definition.fn !== "gearrack") throw new Error("Unexpected model")
  const { fn, ...p } = definition
  const reference = jscad.measurements.measureVolume(createGearRackGeom(p))
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  for (const result of [
    getComponentModel(GearRack, p),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(result.geometries.length).toBeGreaterThan(0)
    expect(
      result.geometries.reduce(
        (sum, entry) => sum + jscad.measurements.measureVolume(entry.geom),
        0,
      ),
    ).toBeCloseTo(reference, 3)
  }
  expect(() => Footprinter3d({ footprint: source + "_typo1mm" })).toThrow()
})

test("sprocket: direct component and model-string routing have matching geometry and no pads", () => {
  const source = "sprocket_od60mm_root48mm_w8mm_bore12mm_teeth16_hub26mm_hh10mm"
  const definition = mp.string(source).json()
  if (definition.fn !== "sprocket") throw new Error("Unexpected model")
  const { fn, ...p } = definition
  const reference = jscad.measurements.measureVolume(createSprocketGeom(p))
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  for (const result of [
    getComponentModel(Sprocket, p),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(result.geometries.length).toBeGreaterThan(0)
    expect(
      result.geometries.reduce(
        (sum, entry) => sum + jscad.measurements.measureVolume(entry.geom),
        0,
      ),
    ).toBeCloseTo(reference, 3)
  }
  expect(() => Footprinter3d({ footprint: source + "_typo1mm" })).toThrow()
})

test("rollerchain: direct component and model-string routing have matching geometry and no pads", () => {
  const source =
    "rollerchain_pitch12.7mm_links6_roller7.9mm_w8mm_pin4mm_plate1.2mm"
  const definition = mp.string(source).json()
  if (definition.fn !== "rollerchain") throw new Error("Unexpected model")
  const { fn, ...p } = definition
  const reference = jscad.measurements.measureVolume(createRollerChainGeom(p))
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  for (const result of [
    getComponentModel(RollerChain, p),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(result.geometries.length).toBeGreaterThan(0)
    expect(
      result.geometries.reduce(
        (sum, entry) => sum + jscad.measurements.measureVolume(entry.geom),
        0,
      ),
    ).toBeCloseTo(reference, 3)
  }
  expect(() => Footprinter3d({ footprint: source + "_typo1mm" })).toThrow()
})

test("vbeltsheave: direct component and model-string routing have matching geometry and no pads", () => {
  const source =
    "vbeltsheave_od60mm_bore12mm_w24mm_grooves2_depth8mm_gw9mm_hub26mm_hh8mm"
  const definition = mp.string(source).json()
  if (definition.fn !== "vbeltsheave") throw new Error("Unexpected model")
  const { fn, ...p } = definition
  const reference = jscad.measurements.measureVolume(createVBeltSheaveGeom(p))
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  for (const result of [
    getComponentModel(VBeltSheave, p),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(result.geometries.length).toBeGreaterThan(0)
    expect(
      result.geometries.reduce(
        (sum, entry) => sum + jscad.measurements.measureVolume(entry.geom),
        0,
      ),
    ).toBeCloseTo(reference, 3)
  }
  expect(() => Footprinter3d({ footprint: source + "_typo1mm" })).toThrow()
})

test("conveyorroller: direct component and model-string routing have matching geometry and no pads", () => {
  const source = "conveyorroller_od50mm_l150mm_wall3mm_shaft10mm_ext15mm_end4mm"
  const definition = mp.string(source).json()
  if (definition.fn !== "conveyorroller") throw new Error("Unexpected model")
  const { fn, ...p } = definition
  const reference = jscad.measurements.measureVolume(
    createConveyorRollerGeom(p),
  )
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  for (const result of [
    getComponentModel(ConveyorRoller, p),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(result.geometries.length).toBeGreaterThan(0)
    expect(
      result.geometries.reduce(
        (sum, entry) => sum + jscad.measurements.measureVolume(entry.geom),
        0,
      ),
    ).toBeCloseTo(reference, 3)
  }
  expect(() => Footprinter3d({ footprint: source + "_typo1mm" })).toThrow()
})

test("shaftsupport: direct component and model-string routing have matching geometry and no pads", () => {
  const source =
    "shaftsupport_bore16mm_bw55mm_bd32mm_bt7mm_hw26mm_hd20mm_hh34mm_ch26mm_ms40mm_mh5mm_slit1.5mm_clamp4mm"
  const definition = mp.string(source).json()
  if (definition.fn !== "shaftsupport") throw new Error("Unexpected model")
  const { fn, ...p } = definition
  const reference = jscad.measurements.measureVolume(createShaftSupportGeom(p))
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  for (const result of [
    getComponentModel(ShaftSupport, p),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(result.geometries.length).toBeGreaterThan(0)
    expect(
      result.geometries.reduce(
        (sum, entry) => sum + jscad.measurements.measureVolume(entry.geom),
        0,
      ),
    ).toBeCloseTo(reference, 3)
  }
  expect(() => Footprinter3d({ footprint: source + "_typo1mm" })).toThrow()
})

test("motion models: all built vanilla factories and model-string routes agree", async () => {
  const vanilla = await importVanilla()
  {
    const source =
      "pillowblockbearing_bore20mm_bw80mm_bd30mm_bt8mm_hd46mm_ch30mm_ms60mm_mh6mm"
    expect(vanilla.createPillowBlockBearingMesh()).toEqual(
      createPillowBlockBearingMesh(),
    )
    const rendered = vanilla.getJscadModelForFootprintWithPads(source, jscad)
    expect(rendered.geometries.length).toBeGreaterThan(0)
    const total = rendered.geometries.reduce(
      (sum: number, entry: { geom: jscad.geometries.geom3.Geom3 }) =>
        sum + jscad.measurements.measureVolume(entry.geom),
      0,
    )
    expect(total).toBeCloseTo(
      jscad.measurements.measureVolume(createPillowBlockBearingGeom()),
      3,
    )
  }
  {
    const source =
      "flangebearing_bore20mm_fw64mm_ft6mm_hd44mm_hh20mm_ms46mm_mh6mm"
    expect(vanilla.createFlangeBearingMesh()).toEqual(createFlangeBearingMesh())
    const rendered = vanilla.getJscadModelForFootprintWithPads(source, jscad)
    expect(rendered.geometries.length).toBeGreaterThan(0)
    const total = rendered.geometries.reduce(
      (sum: number, entry: { geom: jscad.geometries.geom3.Geom3 }) =>
        sum + jscad.measurements.measureVolume(entry.geom),
      0,
    )
    expect(total).toBeCloseTo(
      jscad.measurements.measureVolume(createFlangeBearingGeom()),
      3,
    )
  }
  {
    const source = "needlebearing_id20mm_od30mm_w20mm_race1.5mm_rollers18"
    expect(vanilla.createNeedleBearingMesh()).toEqual(createNeedleBearingMesh())
    const rendered = vanilla.getJscadModelForFootprintWithPads(source, jscad)
    expect(rendered.geometries.length).toBeGreaterThan(0)
    const total = rendered.geometries.reduce(
      (sum: number, entry: { geom: jscad.geometries.geom3.Geom3 }) =>
        sum + jscad.measurements.measureVolume(entry.geom),
      0,
    )
    expect(total).toBeCloseTo(
      jscad.measurements.measureVolume(createNeedleBearingGeom()),
      3,
    )
  }
  {
    const source =
      "cylindricalrollerbearing_id20mm_od42mm_w16mm_race3mm_rollers12"
    expect(vanilla.createCylindricalRollerBearingMesh()).toEqual(
      createCylindricalRollerBearingMesh(),
    )
    const rendered = vanilla.getJscadModelForFootprintWithPads(source, jscad)
    expect(rendered.geometries.length).toBeGreaterThan(0)
    const total = rendered.geometries.reduce(
      (sum: number, entry: { geom: jscad.geometries.geom3.Geom3 }) =>
        sum + jscad.measurements.measureVolume(entry.geom),
      0,
    )
    expect(total).toBeCloseTo(
      jscad.measurements.measureVolume(createCylindricalRollerBearingGeom()),
      3,
    )
  }
  {
    const source =
      "camfollower_od32mm_w14mm_stud10mm_sl26mm_socket5mm_rollers10"
    expect(vanilla.createCamFollowerMesh()).toEqual(createCamFollowerMesh())
    const rendered = vanilla.getJscadModelForFootprintWithPads(source, jscad)
    expect(rendered.geometries.length).toBeGreaterThan(0)
    const total = rendered.geometries.reduce(
      (sum: number, entry: { geom: jscad.geometries.geom3.Geom3 }) =>
        sum + jscad.measurements.measureVolume(entry.geom),
      0,
    )
    expect(total).toBeCloseTo(
      jscad.measurements.measureVolume(createCamFollowerGeom()),
      3,
    )
  }
  {
    const source = "vgroovewheel_od40mm_root28mm_bore8mm_w12mm"
    expect(vanilla.createVGrooveWheelMesh()).toEqual(createVGrooveWheelMesh())
    const rendered = vanilla.getJscadModelForFootprintWithPads(source, jscad)
    expect(rendered.geometries.length).toBeGreaterThan(0)
    const total = rendered.geometries.reduce(
      (sum: number, entry: { geom: jscad.geometries.geom3.Geom3 }) =>
        sum + jscad.measurements.measureVolume(entry.geom),
      0,
    )
    expect(total).toBeCloseTo(
      jscad.measurements.measureVolume(createVGrooveWheelGeom()),
      3,
    )
  }
  {
    const source = "rodend_hd28mm_bore12mm_w12mm_stem10mm_sl30mm"
    expect(vanilla.createRodEndMesh()).toEqual(createRodEndMesh())
    const rendered = vanilla.getJscadModelForFootprintWithPads(source, jscad)
    expect(rendered.geometries.length).toBeGreaterThan(0)
    const total = rendered.geometries.reduce(
      (sum: number, entry: { geom: jscad.geometries.geom3.Geom3 }) =>
        sum + jscad.measurements.measureVolume(entry.geom),
      0,
    )
    expect(total).toBeCloseTo(
      jscad.measurements.measureVolume(createRodEndGeom()),
      3,
    )
  }
  {
    const source = "sphericalbearing_od30mm_bore12mm_w14mm_ball22mm"
    expect(vanilla.createSphericalBearingMesh()).toEqual(
      createSphericalBearingMesh(),
    )
    const rendered = vanilla.getJscadModelForFootprintWithPads(source, jscad)
    expect(rendered.geometries.length).toBeGreaterThan(0)
    const total = rendered.geometries.reduce(
      (sum: number, entry: { geom: jscad.geometries.geom3.Geom3 }) =>
        sum + jscad.measurements.measureVolume(entry.geom),
      0,
    )
    expect(total).toBeCloseTo(
      jscad.measurements.measureVolume(createSphericalBearingGeom()),
      3,
    )
  }
  {
    const source = "clevis_w30mm_l45mm_h20mm_gap14mm_back10mm_pin8mm_mount10mm"
    expect(vanilla.createClevisMesh()).toEqual(createClevisMesh())
    const rendered = vanilla.getJscadModelForFootprintWithPads(source, jscad)
    expect(rendered.geometries.length).toBeGreaterThan(0)
    const total = rendered.geometries.reduce(
      (sum: number, entry: { geom: jscad.geometries.geom3.Geom3 }) =>
        sum + jscad.measurements.measureVolume(entry.geom),
      0,
    )
    expect(total).toBeCloseTo(
      jscad.measurements.measureVolume(createClevisGeom()),
      3,
    )
  }
  {
    const source = "gearrack_pitch8mm_teeth12_w12mm_h8mm_th4mm_mh3.5mm"
    expect(vanilla.createGearRackMesh()).toEqual(createGearRackMesh())
    const rendered = vanilla.getJscadModelForFootprintWithPads(source, jscad)
    expect(rendered.geometries.length).toBeGreaterThan(0)
    const total = rendered.geometries.reduce(
      (sum: number, entry: { geom: jscad.geometries.geom3.Geom3 }) =>
        sum + jscad.measurements.measureVolume(entry.geom),
      0,
    )
    expect(total).toBeCloseTo(
      jscad.measurements.measureVolume(createGearRackGeom()),
      3,
    )
  }
  {
    const source =
      "sprocket_od60mm_root48mm_w8mm_bore12mm_teeth16_hub26mm_hh10mm"
    expect(vanilla.createSprocketMesh()).toEqual(createSprocketMesh())
    const rendered = vanilla.getJscadModelForFootprintWithPads(source, jscad)
    expect(rendered.geometries.length).toBeGreaterThan(0)
    const total = rendered.geometries.reduce(
      (sum: number, entry: { geom: jscad.geometries.geom3.Geom3 }) =>
        sum + jscad.measurements.measureVolume(entry.geom),
      0,
    )
    expect(total).toBeCloseTo(
      jscad.measurements.measureVolume(createSprocketGeom()),
      3,
    )
  }
  {
    const source =
      "rollerchain_pitch12.7mm_links6_roller7.9mm_w8mm_pin4mm_plate1.2mm"
    expect(vanilla.createRollerChainMesh()).toEqual(createRollerChainMesh())
    const rendered = vanilla.getJscadModelForFootprintWithPads(source, jscad)
    expect(rendered.geometries.length).toBeGreaterThan(0)
    const total = rendered.geometries.reduce(
      (sum: number, entry: { geom: jscad.geometries.geom3.Geom3 }) =>
        sum + jscad.measurements.measureVolume(entry.geom),
      0,
    )
    expect(total).toBeCloseTo(
      jscad.measurements.measureVolume(createRollerChainGeom()),
      3,
    )
  }
  {
    const source =
      "vbeltsheave_od60mm_bore12mm_w24mm_grooves2_depth8mm_gw9mm_hub26mm_hh8mm"
    expect(vanilla.createVBeltSheaveMesh()).toEqual(createVBeltSheaveMesh())
    const rendered = vanilla.getJscadModelForFootprintWithPads(source, jscad)
    expect(rendered.geometries.length).toBeGreaterThan(0)
    const total = rendered.geometries.reduce(
      (sum: number, entry: { geom: jscad.geometries.geom3.Geom3 }) =>
        sum + jscad.measurements.measureVolume(entry.geom),
      0,
    )
    expect(total).toBeCloseTo(
      jscad.measurements.measureVolume(createVBeltSheaveGeom()),
      3,
    )
  }
  {
    const source =
      "conveyorroller_od50mm_l150mm_wall3mm_shaft10mm_ext15mm_end4mm"
    expect(vanilla.createConveyorRollerMesh()).toEqual(
      createConveyorRollerMesh(),
    )
    const rendered = vanilla.getJscadModelForFootprintWithPads(source, jscad)
    expect(rendered.geometries.length).toBeGreaterThan(0)
    const total = rendered.geometries.reduce(
      (sum: number, entry: { geom: jscad.geometries.geom3.Geom3 }) =>
        sum + jscad.measurements.measureVolume(entry.geom),
      0,
    )
    expect(total).toBeCloseTo(
      jscad.measurements.measureVolume(createConveyorRollerGeom()),
      3,
    )
  }
  {
    const source =
      "shaftsupport_bore16mm_bw55mm_bd32mm_bt7mm_hw26mm_hd20mm_hh34mm_ch26mm_ms40mm_mh5mm_slit1.5mm_clamp4mm"
    expect(vanilla.createShaftSupportMesh()).toEqual(createShaftSupportMesh())
    const rendered = vanilla.getJscadModelForFootprintWithPads(source, jscad)
    expect(rendered.geometries.length).toBeGreaterThan(0)
    const total = rendered.geometries.reduce(
      (sum: number, entry: { geom: jscad.geometries.geom3.Geom3 }) =>
        sum + jscad.measurements.measureVolume(entry.geom),
      0,
    )
    expect(total).toBeCloseTo(
      jscad.measurements.measureVolume(createShaftSupportGeom()),
      3,
    )
  }
}, 60000)
