import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  mp,
  getPneumaticCylinderDimensions,
  getCylinderMountDimensions,
  getAirFilterDimensions,
  getAirRegulatorDimensions,
  getAirLubricatorDimensions,
  getSolenoidValveDimensions,
  getPressureSwitchDimensions,
  getPressureGaugeDimensions,
  getFlowMeterDimensions,
  getVacuumCupDimensions,
  getInductiveProximitySensorDimensions,
  getPhotoelectricSensorDimensions,
  getLimitSwitchDimensions,
  getPushbuttonOperatorDimensions,
  getEmergencyStopSwitchDimensions,
  getSelectorOperatorDimensions,
  getPilotLightDimensions,
  getDinRailDimensions,
  getTerminalBlockDimensions,
  getWireDuctDimensions,
} from "@tscircuit/modelprinter"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import {
  PneumaticCylinder,
  createPneumaticCylinderGeom,
  createPneumaticCylinderMesh,
} from "../lib/models/pneumaticcylinder"
import {
  CylinderMount,
  createCylinderMountGeom,
  createCylinderMountMesh,
} from "../lib/models/cylindermount"
import {
  AirFilter,
  createAirFilterGeom,
  createAirFilterMesh,
} from "../lib/models/airfilter"
import {
  AirRegulator,
  createAirRegulatorGeom,
  createAirRegulatorMesh,
} from "../lib/models/airregulator"
import {
  AirLubricator,
  createAirLubricatorGeom,
  createAirLubricatorMesh,
} from "../lib/models/airlubricator"
import {
  SolenoidValve,
  createSolenoidValveGeom,
  createSolenoidValveMesh,
} from "../lib/models/solenoidvalve"
import {
  PressureSwitch,
  createPressureSwitchGeom,
  createPressureSwitchMesh,
} from "../lib/models/pressureswitch"
import {
  PressureGauge,
  createPressureGaugeParts,
  createPressureGaugeGeom,
  createPressureGaugeMesh,
} from "../lib/models/pressuregauge"
import {
  FlowMeter,
  createFlowMeterGeom,
  createFlowMeterMesh,
} from "../lib/models/flowmeter"
import {
  VacuumCup,
  createVacuumCupGeom,
  createVacuumCupMesh,
} from "../lib/models/vacuumcup"
import {
  InductiveProximitySensor,
  createInductiveProximitySensorGeom,
  createInductiveProximitySensorMesh,
} from "../lib/models/inductiveproximitysensor"
import {
  PhotoelectricSensor,
  createPhotoelectricSensorGeom,
  createPhotoelectricSensorMesh,
} from "../lib/models/photoelectricsensor"
import {
  LimitSwitch,
  createLimitSwitchGeom,
  createLimitSwitchMesh,
} from "../lib/models/limitswitch"
import {
  PushbuttonOperator,
  createPushbuttonOperatorGeom,
  createPushbuttonOperatorMesh,
} from "../lib/models/pushbuttonoperator"
import {
  EmergencyStopSwitch,
  createEmergencyStopSwitchGeom,
  createEmergencyStopSwitchMesh,
} from "../lib/models/emergencystopswitch"
import {
  SelectorOperator,
  createSelectorOperatorGeom,
  createSelectorOperatorMesh,
} from "../lib/models/selectoroperator"
import {
  PilotLight,
  createPilotLightGeom,
  createPilotLightMesh,
} from "../lib/models/pilotlight"
import {
  DinRail,
  createDinRailGeom,
  createDinRailMesh,
} from "../lib/models/dinrail"
import {
  TerminalBlock,
  createTerminalBlockGeom,
  createTerminalBlockMesh,
} from "../lib/models/terminalblock"
import {
  WireDuct,
  createWireDuctGeom,
  createWireDuctMesh,
} from "../lib/models/wireduct"
test("pneumaticcylinder: meaningful nominal solid, finite indexed mesh and parameter effect", () => {
  const solid = createPneumaticCylinderGeom()
  const actual = jscad.measurements.measureDimensions(solid)
  const nominal = getPneumaticCylinderDimensions().size
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(nominal[i]!, 2)
  expect(
    jscad.geometries.geom3
      .toPolygons(solid)
      .every((poly) =>
        poly.vertices.every((vertex) => vertex.every(Number.isFinite)),
      ),
  ).toBe(true)
  const volume = jscad.measurements.measureVolume(solid)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  const mesh = createPneumaticCylinderMesh()
  expect(mesh.positions.length).toBeGreaterThan(90)
  expect(mesh.indices.length).toBeGreaterThan(90)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const changed = createPneumaticCylinderGeom({ extension: 35 })
  expect(jscad.measurements.measureVolume(changed)).not.toBeCloseTo(volume, 3)
})
test("pneumaticcylinder: typed component and model-string route to the same geometry without pads", () => {
  const source =
    "pneumaticcylinder_borediameter32mm_bodylength80mm_roddiameter12mm_stroke50mm_extension25mm_endcaplength10mm_portdiameter6mm"
  const d = mp.string(source).json()
  if (d.fn !== "pneumaticcylinder") throw new Error("Unexpected model")
  const { fn, ...props } = d
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const expected = jscad.measurements.measureVolume(
    createPneumaticCylinderGeom(props),
  )
  for (const routed of [
    getComponentModel(PneumaticCylinder, props),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(routed.geometries.length).toBeGreaterThan(0)
    const volume = routed.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 4)
  }
})

test("cylindermount: meaningful nominal solid, finite indexed mesh and parameter effect", () => {
  const solid = createCylinderMountGeom()
  const actual = jscad.measurements.measureDimensions(solid)
  const nominal = getCylinderMountDimensions().size
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(nominal[i]!, 2)
  expect(
    jscad.geometries.geom3
      .toPolygons(solid)
      .every((poly) =>
        poly.vertices.every((vertex) => vertex.every(Number.isFinite)),
      ),
  ).toBe(true)
  const volume = jscad.measurements.measureVolume(solid)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  const mesh = createCylinderMountMesh()
  expect(mesh.positions.length).toBeGreaterThan(90)
  expect(mesh.indices.length).toBeGreaterThan(90)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const changed = createCylinderMountGeom({ boreDiameter: 16 })
  expect(jscad.measurements.measureVolume(changed)).not.toBeCloseTo(volume, 3)
})
test("cylindermount: typed component and model-string route to the same geometry without pads", () => {
  const source =
    "cylindermount_width50mm_depth25mm_height45mm_thickness5mm_borediameter20mm_holediameter5mm"
  const d = mp.string(source).json()
  if (d.fn !== "cylindermount") throw new Error("Unexpected model")
  const { fn, ...props } = d
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const expected = jscad.measurements.measureVolume(
    createCylinderMountGeom(props),
  )
  for (const routed of [
    getComponentModel(CylinderMount, props),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(routed.geometries.length).toBeGreaterThan(0)
    const volume = routed.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 4)
  }
})

test("airfilter: meaningful nominal solid, finite indexed mesh and parameter effect", () => {
  const solid = createAirFilterGeom()
  const actual = jscad.measurements.measureDimensions(solid)
  const nominal = getAirFilterDimensions().size
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(nominal[i]!, 2)
  expect(
    jscad.geometries.geom3
      .toPolygons(solid)
      .every((poly) =>
        poly.vertices.every((vertex) => vertex.every(Number.isFinite)),
      ),
  ).toBe(true)
  const volume = jscad.measurements.measureVolume(solid)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  const mesh = createAirFilterMesh()
  expect(mesh.positions.length).toBeGreaterThan(90)
  expect(mesh.indices.length).toBeGreaterThan(90)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const changed = createAirFilterGeom({ bowlLength: 65 })
  expect(jscad.measurements.measureVolume(changed)).not.toBeCloseTo(volume, 3)
})
test("airfilter: typed component and model-string route to the same geometry without pads", () => {
  const source =
    "airfilter_bodywidth40mm_bodydepth40mm_bodyheight30mm_bowldiameter28mm_bowllength50mm_portdiameter8mm_drainlength8mm"
  const d = mp.string(source).json()
  if (d.fn !== "airfilter") throw new Error("Unexpected model")
  const { fn, ...props } = d
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const expected = jscad.measurements.measureVolume(createAirFilterGeom(props))
  for (const routed of [
    getComponentModel(AirFilter, props),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(routed.geometries.length).toBeGreaterThan(0)
    const volume = routed.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 4)
  }
})

test("airregulator: meaningful nominal solid, finite indexed mesh and parameter effect", () => {
  const solid = createAirRegulatorGeom()
  const actual = jscad.measurements.measureDimensions(solid)
  const nominal = getAirRegulatorDimensions().size
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(nominal[i]!, 2)
  expect(
    jscad.geometries.geom3
      .toPolygons(solid)
      .every((poly) =>
        poly.vertices.every((vertex) => vertex.every(Number.isFinite)),
      ),
  ).toBe(true)
  const volume = jscad.measurements.measureVolume(solid)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  const mesh = createAirRegulatorMesh()
  expect(mesh.positions.length).toBeGreaterThan(90)
  expect(mesh.indices.length).toBeGreaterThan(90)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const changed = createAirRegulatorGeom({ knobHeight: 28 })
  expect(jscad.measurements.measureVolume(changed)).not.toBeCloseTo(volume, 3)
})
test("airregulator: typed component and model-string route to the same geometry without pads", () => {
  const source =
    "airregulator_bodywidth40mm_bodydepth36mm_bodyheight30mm_knobdiameter28mm_knobheight20mm_portdiameter8mm_gaugediameter20mm"
  const d = mp.string(source).json()
  if (d.fn !== "airregulator") throw new Error("Unexpected model")
  const { fn, ...props } = d
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const expected = jscad.measurements.measureVolume(
    createAirRegulatorGeom(props),
  )
  for (const routed of [
    getComponentModel(AirRegulator, props),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(routed.geometries.length).toBeGreaterThan(0)
    const volume = routed.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 4)
  }
})

test("airlubricator: meaningful nominal solid, finite indexed mesh and parameter effect", () => {
  const solid = createAirLubricatorGeom()
  const actual = jscad.measurements.measureDimensions(solid)
  const nominal = getAirLubricatorDimensions().size
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(nominal[i]!, 2)
  expect(
    jscad.geometries.geom3
      .toPolygons(solid)
      .every((poly) =>
        poly.vertices.every((vertex) => vertex.every(Number.isFinite)),
      ),
  ).toBe(true)
  const volume = jscad.measurements.measureVolume(solid)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  const mesh = createAirLubricatorMesh()
  expect(mesh.positions.length).toBeGreaterThan(90)
  expect(mesh.indices.length).toBeGreaterThan(90)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const changed = createAirLubricatorGeom({ fillHeight: 12 })
  expect(jscad.measurements.measureVolume(changed)).not.toBeCloseTo(volume, 3)
})
test("airlubricator: typed component and model-string route to the same geometry without pads", () => {
  const source =
    "airlubricator_bodywidth40mm_bodydepth40mm_bodyheight30mm_bowldiameter28mm_bowllength50mm_portdiameter8mm_filldiameter12mm_fillheight8mm"
  const d = mp.string(source).json()
  if (d.fn !== "airlubricator") throw new Error("Unexpected model")
  const { fn, ...props } = d
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const expected = jscad.measurements.measureVolume(
    createAirLubricatorGeom(props),
  )
  for (const routed of [
    getComponentModel(AirLubricator, props),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(routed.geometries.length).toBeGreaterThan(0)
    const volume = routed.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 4)
  }
})

test("solenoidvalve: meaningful nominal solid, finite indexed mesh and parameter effect", () => {
  const solid = createSolenoidValveGeom()
  const actual = jscad.measurements.measureDimensions(solid)
  const nominal = getSolenoidValveDimensions().size
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(nominal[i]!, 2)
  expect(
    jscad.geometries.geom3
      .toPolygons(solid)
      .every((poly) =>
        poly.vertices.every((vertex) => vertex.every(Number.isFinite)),
      ),
  ).toBe(true)
  const volume = jscad.measurements.measureVolume(solid)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  const mesh = createSolenoidValveMesh()
  expect(mesh.positions.length).toBeGreaterThan(90)
  expect(mesh.indices.length).toBeGreaterThan(90)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const changed = createSolenoidValveGeom({ coilHeight: 40 })
  expect(jscad.measurements.measureVolume(changed)).not.toBeCloseTo(volume, 3)
})
test("solenoidvalve: typed component and model-string route to the same geometry without pads", () => {
  const source =
    "solenoidvalve_length70mm_width28mm_height25mm_coilwidth24mm_coilheight30mm_portdiameter6mm"
  const d = mp.string(source).json()
  if (d.fn !== "solenoidvalve") throw new Error("Unexpected model")
  const { fn, ...props } = d
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const expected = jscad.measurements.measureVolume(
    createSolenoidValveGeom(props),
  )
  for (const routed of [
    getComponentModel(SolenoidValve, props),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(routed.geometries.length).toBeGreaterThan(0)
    const volume = routed.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 4)
  }
})

test("pressureswitch: meaningful nominal solid, finite indexed mesh and parameter effect", () => {
  const solid = createPressureSwitchGeom()
  const actual = jscad.measurements.measureDimensions(solid)
  const nominal = getPressureSwitchDimensions().size
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(nominal[i]!, 2)
  expect(
    jscad.geometries.geom3
      .toPolygons(solid)
      .every((poly) =>
        poly.vertices.every((vertex) => vertex.every(Number.isFinite)),
      ),
  ).toBe(true)
  const volume = jscad.measurements.measureVolume(solid)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  const mesh = createPressureSwitchMesh()
  expect(mesh.positions.length).toBeGreaterThan(90)
  expect(mesh.indices.length).toBeGreaterThan(90)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const changed = createPressureSwitchGeom({ portLength: 16 })
  expect(jscad.measurements.measureVolume(changed)).not.toBeCloseTo(volume, 3)
})
test("pressureswitch: typed component and model-string route to the same geometry without pads", () => {
  const source =
    "pressureswitch_width32mm_depth28mm_height38mm_portdiameter8mm_portlength10mm"
  const d = mp.string(source).json()
  if (d.fn !== "pressureswitch") throw new Error("Unexpected model")
  const { fn, ...props } = d
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const expected = jscad.measurements.measureVolume(
    createPressureSwitchGeom(props),
  )
  for (const routed of [
    getComponentModel(PressureSwitch, props),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(routed.geometries.length).toBeGreaterThan(0)
    const volume = routed.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 4)
  }
})

test("pressuregauge: meaningful nominal solid, finite indexed mesh and parameter effect", () => {
  const solid = createPressureGaugeGeom()
  const actual = jscad.measurements.measureDimensions(solid)
  const nominal = getPressureGaugeDimensions().size
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(nominal[i]!, 2)
  expect(
    jscad.geometries.geom3
      .toPolygons(solid)
      .every((poly) =>
        poly.vertices.every((vertex) => vertex.every(Number.isFinite)),
      ),
  ).toBe(true)
  const volume = jscad.measurements.measureVolume(solid)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  const mesh = createPressureGaugeMesh()
  expect(mesh.positions.length).toBeGreaterThan(90)
  expect(mesh.indices.length).toBeGreaterThan(90)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const changed = createPressureGaugeGeom({ diameter: 75 })
  expect(jscad.measurements.measureVolume(changed)).not.toBeCloseTo(volume, 3)
})
test("pressuregauge: typed component and model-string route to the same geometry without pads", () => {
  const source =
    "pressuregauge_diameter60mm_depth22mm_stemdiameter10mm_stemlength15mm"
  const d = mp.string(source).json()
  if (d.fn !== "pressuregauge") throw new Error("Unexpected model")
  const { fn, ...props } = d
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const expected = jscad.measurements.measureVolume(
    createPressureGaugeGeom(props),
  )
  for (const routed of [
    getComponentModel(PressureGauge, props),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(routed.geometries.length).toBeGreaterThan(0)
    const volume = routed.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 4)
  }
})

test("flowmeter: meaningful nominal solid, finite indexed mesh and parameter effect", () => {
  const solid = createFlowMeterGeom()
  const actual = jscad.measurements.measureDimensions(solid)
  const nominal = getFlowMeterDimensions().size
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(nominal[i]!, 2)
  expect(
    jscad.geometries.geom3
      .toPolygons(solid)
      .every((poly) =>
        poly.vertices.every((vertex) => vertex.every(Number.isFinite)),
      ),
  ).toBe(true)
  const volume = jscad.measurements.measureVolume(solid)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  const mesh = createFlowMeterMesh()
  expect(mesh.positions.length).toBeGreaterThan(90)
  expect(mesh.indices.length).toBeGreaterThan(90)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const changed = createFlowMeterGeom({ length: 150 })
  expect(jscad.measurements.measureVolume(changed)).not.toBeCloseTo(volume, 3)
})
test("flowmeter: typed component and model-string route to the same geometry without pads", () => {
  const source =
    "flowmeter_length120mm_diameter24mm_borediameter12mm_enddiameter32mm_endlength12mm_floatdiameter8mm"
  const d = mp.string(source).json()
  if (d.fn !== "flowmeter") throw new Error("Unexpected model")
  const { fn, ...props } = d
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const expected = jscad.measurements.measureVolume(createFlowMeterGeom(props))
  for (const routed of [
    getComponentModel(FlowMeter, props),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(routed.geometries.length).toBeGreaterThan(0)
    const volume = routed.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 4)
  }
})

test("vacuumcup: meaningful nominal solid, finite indexed mesh and parameter effect", () => {
  const solid = createVacuumCupGeom()
  const actual = jscad.measurements.measureDimensions(solid)
  const nominal = getVacuumCupDimensions().size
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(nominal[i]!, 2)
  expect(
    jscad.geometries.geom3
      .toPolygons(solid)
      .every((poly) =>
        poly.vertices.every((vertex) => vertex.every(Number.isFinite)),
      ),
  ).toBe(true)
  const volume = jscad.measurements.measureVolume(solid)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  const mesh = createVacuumCupMesh()
  expect(mesh.positions.length).toBeGreaterThan(90)
  expect(mesh.indices.length).toBeGreaterThan(90)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const changed = createVacuumCupGeom({ height: 28 })
  expect(jscad.measurements.measureVolume(changed)).not.toBeCloseTo(volume, 3)
})
test("vacuumcup: typed component and model-string route to the same geometry without pads", () => {
  const source =
    "vacuumcup_diameter35mm_height22mm_neckdiameter12mm_necklength12mm_wallthickness2mm_borediameter6mm"
  const d = mp.string(source).json()
  if (d.fn !== "vacuumcup") throw new Error("Unexpected model")
  const { fn, ...props } = d
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const expected = jscad.measurements.measureVolume(createVacuumCupGeom(props))
  for (const routed of [
    getComponentModel(VacuumCup, props),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(routed.geometries.length).toBeGreaterThan(0)
    const volume = routed.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 4)
  }
})

test("inductiveproximitysensor: meaningful nominal solid, finite indexed mesh and parameter effect", () => {
  const solid = createInductiveProximitySensorGeom()
  const actual = jscad.measurements.measureDimensions(solid)
  const nominal = getInductiveProximitySensorDimensions().size
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(nominal[i]!, 2)
  expect(
    jscad.geometries.geom3
      .toPolygons(solid)
      .every((poly) =>
        poly.vertices.every((vertex) => vertex.every(Number.isFinite)),
      ),
  ).toBe(true)
  const volume = jscad.measurements.measureVolume(solid)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  const mesh = createInductiveProximitySensorMesh()
  expect(mesh.positions.length).toBeGreaterThan(90)
  expect(mesh.indices.length).toBeGreaterThan(90)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const changed = createInductiveProximitySensorGeom({ barrelLength: 70 })
  expect(jscad.measurements.measureVolume(changed)).not.toBeCloseTo(volume, 3)
})
test("inductiveproximitysensor: typed component and model-string route to the same geometry without pads", () => {
  const source =
    "inductiveproximitysensor_barreldiameter18mm_barrellength55mm_facethickness2mm_cablediameter5mm_cablelength15mm_nutwidth22mm_nutthickness4mm"
  const d = mp.string(source).json()
  if (d.fn !== "inductiveproximitysensor") throw new Error("Unexpected model")
  const { fn, ...props } = d
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const expected = jscad.measurements.measureVolume(
    createInductiveProximitySensorGeom(props),
  )
  for (const routed of [
    getComponentModel(InductiveProximitySensor, props),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(routed.geometries.length).toBeGreaterThan(0)
    const volume = routed.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 4)
  }
})

test("photoelectricsensor: meaningful nominal solid, finite indexed mesh and parameter effect", () => {
  const solid = createPhotoelectricSensorGeom()
  const actual = jscad.measurements.measureDimensions(solid)
  const nominal = getPhotoelectricSensorDimensions().size
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(nominal[i]!, 2)
  expect(
    jscad.geometries.geom3
      .toPolygons(solid)
      .every((poly) =>
        poly.vertices.every((vertex) => vertex.every(Number.isFinite)),
      ),
  ).toBe(true)
  const volume = jscad.measurements.measureVolume(solid)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  const mesh = createPhotoelectricSensorMesh()
  expect(mesh.positions.length).toBeGreaterThan(90)
  expect(mesh.indices.length).toBeGreaterThan(90)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const changed = createPhotoelectricSensorGeom({ height: 70 })
  expect(jscad.measurements.measureVolume(changed)).not.toBeCloseTo(volume, 3)
})
test("photoelectricsensor: typed component and model-string route to the same geometry without pads", () => {
  const source =
    "photoelectricsensor_width20mm_depth35mm_height55mm_lensdiameter12mm_cablediameter5mm_mountholediameter4mm"
  const d = mp.string(source).json()
  if (d.fn !== "photoelectricsensor") throw new Error("Unexpected model")
  const { fn, ...props } = d
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const expected = jscad.measurements.measureVolume(
    createPhotoelectricSensorGeom(props),
  )
  for (const routed of [
    getComponentModel(PhotoelectricSensor, props),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(routed.geometries.length).toBeGreaterThan(0)
    const volume = routed.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 4)
  }
})

test("limitswitch: meaningful nominal solid, finite indexed mesh and parameter effect", () => {
  const solid = createLimitSwitchGeom()
  const actual = jscad.measurements.measureDimensions(solid)
  const nominal = getLimitSwitchDimensions().size
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(nominal[i]!, 2)
  expect(
    jscad.geometries.geom3
      .toPolygons(solid)
      .every((poly) =>
        poly.vertices.every((vertex) => vertex.every(Number.isFinite)),
      ),
  ).toBe(true)
  const volume = jscad.measurements.measureVolume(solid)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  const mesh = createLimitSwitchMesh()
  expect(mesh.positions.length).toBeGreaterThan(90)
  expect(mesh.indices.length).toBeGreaterThan(90)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const changed = createLimitSwitchGeom({ actuatorLength: 40 })
  expect(jscad.measurements.measureVolume(changed)).not.toBeCloseTo(volume, 3)
})
test("limitswitch: typed component and model-string route to the same geometry without pads", () => {
  const source =
    "limitswitch_width30mm_depth20mm_height55mm_actuatorlength30mm_rollerdiameter12mm_leverthickness3mm_holediameter4mm"
  const d = mp.string(source).json()
  if (d.fn !== "limitswitch") throw new Error("Unexpected model")
  const { fn, ...props } = d
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const expected = jscad.measurements.measureVolume(
    createLimitSwitchGeom(props),
  )
  for (const routed of [
    getComponentModel(LimitSwitch, props),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(routed.geometries.length).toBeGreaterThan(0)
    const volume = routed.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 4)
  }
})

test("pushbuttonoperator: meaningful nominal solid, finite indexed mesh and parameter effect", () => {
  const solid = createPushbuttonOperatorGeom()
  const actual = jscad.measurements.measureDimensions(solid)
  const nominal = getPushbuttonOperatorDimensions().size
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(nominal[i]!, 2)
  expect(
    jscad.geometries.geom3
      .toPolygons(solid)
      .every((poly) =>
        poly.vertices.every((vertex) => vertex.every(Number.isFinite)),
      ),
  ).toBe(true)
  const volume = jscad.measurements.measureVolume(solid)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  const mesh = createPushbuttonOperatorMesh()
  expect(mesh.positions.length).toBeGreaterThan(90)
  expect(mesh.indices.length).toBeGreaterThan(90)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const changed = createPushbuttonOperatorGeom({ buttonHeight: 12 })
  expect(jscad.measurements.measureVolume(changed)).not.toBeCloseTo(volume, 3)
})
test("pushbuttonoperator: typed component and model-string route to the same geometry without pads", () => {
  const source =
    "pushbuttonoperator_paneldiameter22mm_bezeldiameter30mm_buttondiameter22mm_bodylength35mm_buttonheight8mm"
  const d = mp.string(source).json()
  if (d.fn !== "pushbuttonoperator") throw new Error("Unexpected model")
  const { fn, ...props } = d
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const expected = jscad.measurements.measureVolume(
    createPushbuttonOperatorGeom(props),
  )
  for (const routed of [
    getComponentModel(PushbuttonOperator, props),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(routed.geometries.length).toBeGreaterThan(0)
    const volume = routed.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 4)
  }
})

test("emergencystopswitch: meaningful nominal solid, finite indexed mesh and parameter effect", () => {
  const solid = createEmergencyStopSwitchGeom()
  const actual = jscad.measurements.measureDimensions(solid)
  const nominal = getEmergencyStopSwitchDimensions().size
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(nominal[i]!, 2)
  expect(
    jscad.geometries.geom3
      .toPolygons(solid)
      .every((poly) =>
        poly.vertices.every((vertex) => vertex.every(Number.isFinite)),
      ),
  ).toBe(true)
  const volume = jscad.measurements.measureVolume(solid)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  const mesh = createEmergencyStopSwitchMesh()
  expect(mesh.positions.length).toBeGreaterThan(90)
  expect(mesh.indices.length).toBeGreaterThan(90)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const changed = createEmergencyStopSwitchGeom({ headHeight: 24 })
  expect(jscad.measurements.measureVolume(changed)).not.toBeCloseTo(volume, 3)
})
test("emergencystopswitch: typed component and model-string route to the same geometry without pads", () => {
  const source =
    "emergencystopswitch_paneldiameter22mm_headdiameter40mm_bodylength45mm_headheight18mm_collardiameter30mm"
  const d = mp.string(source).json()
  if (d.fn !== "emergencystopswitch") throw new Error("Unexpected model")
  const { fn, ...props } = d
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const expected = jscad.measurements.measureVolume(
    createEmergencyStopSwitchGeom(props),
  )
  for (const routed of [
    getComponentModel(EmergencyStopSwitch, props),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(routed.geometries.length).toBeGreaterThan(0)
    const volume = routed.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 4)
  }
})

test("selectoroperator: meaningful nominal solid, finite indexed mesh and parameter effect", () => {
  const solid = createSelectorOperatorGeom()
  const actual = jscad.measurements.measureDimensions(solid)
  const nominal = getSelectorOperatorDimensions().size
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(nominal[i]!, 2)
  expect(
    jscad.geometries.geom3
      .toPolygons(solid)
      .every((poly) =>
        poly.vertices.every((vertex) => vertex.every(Number.isFinite)),
      ),
  ).toBe(true)
  const volume = jscad.measurements.measureVolume(solid)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  const mesh = createSelectorOperatorMesh()
  expect(mesh.positions.length).toBeGreaterThan(90)
  expect(mesh.indices.length).toBeGreaterThan(90)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const changed = createSelectorOperatorGeom({ knobHeight: 20 })
  expect(jscad.measurements.measureVolume(changed)).not.toBeCloseTo(volume, 3)
})
test("selectoroperator: typed component and model-string route to the same geometry without pads", () => {
  const source =
    "selectoroperator_paneldiameter22mm_bezeldiameter30mm_bodylength35mm_knobwidth28mm_knobdepth10mm_knobheight15mm"
  const d = mp.string(source).json()
  if (d.fn !== "selectoroperator") throw new Error("Unexpected model")
  const { fn, ...props } = d
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const expected = jscad.measurements.measureVolume(
    createSelectorOperatorGeom(props),
  )
  for (const routed of [
    getComponentModel(SelectorOperator, props),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(routed.geometries.length).toBeGreaterThan(0)
    const volume = routed.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 4)
  }
})

test("pilotlight: meaningful nominal solid, finite indexed mesh and parameter effect", () => {
  const solid = createPilotLightGeom()
  const actual = jscad.measurements.measureDimensions(solid)
  const nominal = getPilotLightDimensions().size
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(nominal[i]!, 2)
  expect(
    jscad.geometries.geom3
      .toPolygons(solid)
      .every((poly) =>
        poly.vertices.every((vertex) => vertex.every(Number.isFinite)),
      ),
  ).toBe(true)
  const volume = jscad.measurements.measureVolume(solid)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  const mesh = createPilotLightMesh()
  expect(mesh.positions.length).toBeGreaterThan(90)
  expect(mesh.indices.length).toBeGreaterThan(90)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const changed = createPilotLightGeom({ lensHeight: 12 })
  expect(jscad.measurements.measureVolume(changed)).not.toBeCloseTo(volume, 3)
})
test("pilotlight: typed component and model-string route to the same geometry without pads", () => {
  const source =
    "pilotlight_paneldiameter22mm_lensdiameter28mm_bodylength28mm_lensheight8mm"
  const d = mp.string(source).json()
  if (d.fn !== "pilotlight") throw new Error("Unexpected model")
  const { fn, ...props } = d
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const expected = jscad.measurements.measureVolume(createPilotLightGeom(props))
  for (const routed of [
    getComponentModel(PilotLight, props),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(routed.geometries.length).toBeGreaterThan(0)
    const volume = routed.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 4)
  }
})

test("dinrail: meaningful nominal solid, finite indexed mesh and parameter effect", () => {
  const solid = createDinRailGeom()
  const actual = jscad.measurements.measureDimensions(solid)
  const nominal = getDinRailDimensions().size
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(nominal[i]!, 2)
  expect(
    jscad.geometries.geom3
      .toPolygons(solid)
      .every((poly) =>
        poly.vertices.every((vertex) => vertex.every(Number.isFinite)),
      ),
  ).toBe(true)
  const volume = jscad.measurements.measureVolume(solid)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  const mesh = createDinRailMesh()
  expect(mesh.positions.length).toBeGreaterThan(90)
  expect(mesh.indices.length).toBeGreaterThan(90)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const changed = createDinRailGeom({ length: 125 })
  expect(jscad.measurements.measureVolume(changed)).not.toBeCloseTo(volume, 3)
})
test("dinrail: typed component and model-string route to the same geometry without pads", () => {
  const source =
    "dinrail_width35mm_height7.5mm_thickness1mm_length100mm_holediameter5mm_slotlength10mm_slotpitch25mm"
  const d = mp.string(source).json()
  if (d.fn !== "dinrail") throw new Error("Unexpected model")
  const { fn, ...props } = d
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const expected = jscad.measurements.measureVolume(createDinRailGeom(props))
  for (const routed of [
    getComponentModel(DinRail, props),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(routed.geometries.length).toBeGreaterThan(0)
    const volume = routed.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 4)
  }
})

test("terminalblock: meaningful nominal solid, finite indexed mesh and parameter effect", () => {
  const solid = createTerminalBlockGeom()
  const actual = jscad.measurements.measureDimensions(solid)
  const nominal = getTerminalBlockDimensions().size
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(nominal[i]!, 2)
  expect(
    jscad.geometries.geom3
      .toPolygons(solid)
      .every((poly) =>
        poly.vertices.every((vertex) => vertex.every(Number.isFinite)),
      ),
  ).toBe(true)
  const volume = jscad.measurements.measureVolume(solid)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  const mesh = createTerminalBlockMesh()
  expect(mesh.positions.length).toBeGreaterThan(90)
  expect(mesh.indices.length).toBeGreaterThan(90)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const changed = createTerminalBlockGeom({ depth: 50 })
  expect(jscad.measurements.measureVolume(changed)).not.toBeCloseTo(volume, 3)
})
test("terminalblock: typed component and model-string route to the same geometry without pads", () => {
  const source =
    "terminalblock_width6mm_depth40mm_height35mm_wirediameter3mm_screwdiameter4mm"
  const d = mp.string(source).json()
  if (d.fn !== "terminalblock") throw new Error("Unexpected model")
  const { fn, ...props } = d
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const expected = jscad.measurements.measureVolume(
    createTerminalBlockGeom(props),
  )
  for (const routed of [
    getComponentModel(TerminalBlock, props),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(routed.geometries.length).toBeGreaterThan(0)
    const volume = routed.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 4)
  }
})

test("wireduct: meaningful nominal solid, finite indexed mesh and parameter effect", () => {
  const solid = createWireDuctGeom()
  const actual = jscad.measurements.measureDimensions(solid)
  const nominal = getWireDuctDimensions().size
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(nominal[i]!, 2)
  expect(
    jscad.geometries.geom3
      .toPolygons(solid)
      .every((poly) =>
        poly.vertices.every((vertex) => vertex.every(Number.isFinite)),
      ),
  ).toBe(true)
  const volume = jscad.measurements.measureVolume(solid)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  const mesh = createWireDuctMesh()
  expect(mesh.positions.length).toBeGreaterThan(90)
  expect(mesh.indices.length).toBeGreaterThan(90)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const changed = createWireDuctGeom({ height: 50 })
  expect(jscad.measurements.measureVolume(changed)).not.toBeCloseTo(volume, 3)
})
test("wireduct: typed component and model-string route to the same geometry without pads", () => {
  const source =
    "wireduct_width40mm_height40mm_length100mm_thickness2mm_slotwidth4mm_slotpitch8mm_holediameter5mm"
  const d = mp.string(source).json()
  if (d.fn !== "wireduct") throw new Error("Unexpected model")
  const { fn, ...props } = d
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const expected = jscad.measurements.measureVolume(createWireDuctGeom(props))
  for (const routed of [
    getComponentModel(WireDuct, props),
    getComponentModel(Footprinter3d, { footprint: source }),
  ]) {
    expect(routed.geometries.length).toBeGreaterThan(0)
    const volume = routed.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 4)
  }
})

test("pneumatic cylinder has open cross ports and independent corner fastener holes", () => {
  const mesh = createPneumaticCylinderMesh()
  expect(raySurfaceHits(mesh, [-30, 0, 5], [1, 0, 0])).toEqual([])
  expect(raySurfaceHits(mesh, [16.72, 16.72, -1], [0, 0, 1])).toEqual([])
  expect(raySurfaceHits(mesh, [0, 12, -1], [0, 0, 1]).length).toBeGreaterThan(0)
})
test("cylinder mounting bracket has a complete upright bore and foot bolt holes", () => {
  const mesh = createCylinderMountMesh()
  expect(raySurfaceHits(mesh, [0, -30, 27], [0, 1, 0])).toEqual([])
  expect(raySurfaceHits(mesh, [20, -6.25, -1], [0, 0, 1])).toEqual([])
  expect(
    raySurfaceHits(mesh, [0, -6.25, -1], [0, 0, 1]).length,
  ).toBeGreaterThan(0)
})
test("FRL components retain actual open air ports", () => {
  for (const [mesh, z] of [
    [createAirFilterMesh(), 73],
    [createAirRegulatorMesh(), 15],
    [createAirLubricatorMesh(), 65],
  ] as const)
    expect(raySurfaceHits(mesh, [-35, 0, z], [1, 0, 0])).toEqual([])
})
test("solenoid valve has three open manifold ports and mounting holes", () => {
  const mesh = createSolenoidValveMesh()
  for (const x of [-70 / 3, 0, 70 / 3])
    expect(raySurfaceHits(mesh, [x, -30, 12.5], [0, 1, 0])).toEqual([])
  expect(raySurfaceHits(mesh, [-30, 0, -1], [0, 0, 1])).toEqual([])
})
test("pressure switch has bored pressure connection and cable gland", () => {
  const mesh = createPressureSwitchMesh()
  const inlet = raySurfaceHits(mesh, [0, 0, -1], [0, 0, 1])
  expect(inlet[0]).toBeGreaterThan(10)
  expect(raySurfaceHits(mesh, [16.1, 0, 32.8], [1, 0, 0])).toEqual([])
})
test("pressure gauge has open stem and raised dial needle/ticks", () => {
  const mesh = createPressureGaugeMesh()
  expect(raySurfaceHits(mesh, [0, 0, -1], [0, 0, 1])[0]).toBeGreaterThan(15)
  const plainFace = raySurfaceHits(mesh, [15, -30, 45], [0, 1, 0])
  const hub = raySurfaceHits(mesh, [0, -30, 45], [0, 1, 0])
  expect(hub[0]).toBeLessThan(plainFace[0]!)
})
test("flowmeter cutaway exposes float while end bores remain open", () => {
  const mesh = createFlowMeterMesh()
  expect(raySurfaceHits(mesh, [5, 0, -1], [0, 0, 1])).toEqual([])
  const central = raySurfaceHits(mesh, [0, 0, -1], [0, 0, 1])
  expect(central).toHaveLength(2)
  expect(central[0]).toBeCloseTo(45, 3)
  expect(central[1]).toBeCloseTo(53, 3)
  const back = raySurfaceHits(mesh, [0, 0, 60], [0, 1, 0])
  expect(back[0]).toBeCloseTo(6, 3)
})
test("vacuum cup is hollow continuously from lip to neck", () => {
  const mesh = createVacuumCupMesh()
  expect(raySurfaceHits(mesh, [0, 0, -1], [0, 0, 1])).toEqual([])
  expect(raySurfaceHits(mesh, [17.9, 0, -1], [0, 0, 1]).length).toBeGreaterThan(
    0,
  )
})
test("inductive proximity sensor has a distinct projecting sensing face", () => {
  const mesh = createInductiveProximitySensorMesh()
  expect(raySurfaceHits(mesh, [0, 0, 60], [0, 0, -1])[0]).toBeCloseTo(3, 3)
  expect(raySurfaceHits(mesh, [8.5, 0, 60], [0, 0, -1])[0]).toBeCloseTo(5, 3)
})
test("photoelectric sensor has two optical lenses and open mounting bores", () => {
  const mesh = createPhotoelectricSensorMesh()
  for (const z of [27.5, 44])
    expect(raySurfaceHits(mesh, [0, -30, z], [0, 1, 0])[0]).toBeCloseTo(10, 3)
  for (const y of [-7, 7])
    expect(raySurfaceHits(mesh, [-20, y, 8.25], [1, 0, 0])).toEqual([])
})
test("limit switch has open mounting holes and an independent roller envelope", () => {
  const mesh = createLimitSwitchMesh()
  for (const x of [-8.4, 8.4])
    expect(raySurfaceHits(mesh, [x, -30, 11], [0, 1, 0])).toEqual([])
  const roller = raySurfaceHits(mesh, [30, -20, 63], [0, 1, 0])
  expect(roller).toHaveLength(2)
  expect(roller[0]).toBeCloseTo(17, 3)
  expect(roller[1]).toBeCloseTo(23, 3)
})
test("panel operator models have actuator projection and separate rear terminals", () => {
  for (const [mesh, top] of [
    [createPushbuttonOperatorMesh(), 43],
    [createEmergencyStopSwitchMesh(), 67],
    [createSelectorOperatorMesh(), 53],
    [createPilotLightMesh(), 36],
  ] as const) {
    expect(raySurfaceHits(mesh, [0, 0, 100], [0, 0, -1])[0]).toBeCloseTo(
      100 - top,
      3,
    )
    // Rear tabs are offset from the barrel axis, leaving the center free below the barrel.
    expect(raySurfaceHits(mesh, [0, 0, -10], [0, 0, 1])[0]).toBeCloseTo(10, 3)
    expect(raySurfaceHits(mesh, [5.5, 0, -10], [0, 0, 1])[0]).toBeLessThan(10)
  }
})
test("DIN rail has an open top-hat section and oblong floor mounting slots", () => {
  const mesh = createDinRailMesh()
  expect(raySurfaceHits(mesh, [-12.5, 0, -1], [0, 0, 1])).toEqual([])
  const floor = raySurfaceHits(mesh, [0, 0, -1], [0, 0, 1])
  expect(floor).toHaveLength(2)
  expect(floor[0]).toBeCloseTo(1, 3)
  expect(floor[1]).toBeCloseTo(2, 3)
  expect(raySurfaceHits(mesh, [0, 14, 8], [0, 0, -1])[0]).toBeCloseTo(0.5, 3)
})
test("terminal block has recessed wire entries and screw heads", () => {
  const mesh = createTerminalBlockMesh()
  expect(raySurfaceHits(mesh, [0, -30, 19.25], [0, 1, 0])[0]).toBeGreaterThan(
    10,
  )
  const screwSlot = raySurfaceHits(mesh, [0, 10, 50], [0, 0, -1])
  const screwShoulder = raySurfaceHits(mesh, [0, 10.8, 50], [0, 0, -1])
  expect(screwSlot[0]).toBeGreaterThan(screwShoulder[0]!)
})
test("wire duct has cut-through sidewall slots and a mounting floor", () => {
  const mesh = createWireDuctMesh()
  expect(raySurfaceHits(mesh, [-46, -30, 20], [0, 1, 0])).toEqual([])
  expect(raySurfaceHits(mesh, [-42, -30, 20], [0, 1, 0])).toHaveLength(4)
  expect(raySurfaceHits(mesh, [-35, 0, -1], [0, 0, 1])).toEqual([])
  expect(raySurfaceHits(mesh, [0, 0, -1], [0, 0, 1])).toHaveLength(2)
})

test("pressure gauge colored parts match the assembly and retain distinct dial materials", () => {
  const parts = createPressureGaugeParts()
  expect(parts.map((p) => p.name)).toEqual([
    "case and pressure connection",
    "dial face",
    "needle and scale",
  ])
  expect(new Set(parts.map((p) => p.color.join(","))).size).toBe(3)
  const sum = parts.reduce(
    (volume, p) => volume + jscad.measurements.measureVolume(p.geometry),
    0,
  )
  expect(sum).toBeCloseTo(
    jscad.measurements.measureVolume(createPressureGaugeGeom()),
    3,
  )
})
