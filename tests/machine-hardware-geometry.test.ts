import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import { ModelRendererRegistry } from "../lib/model-registry"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { machineHardwareModels } from "./fixtures/machine-hardware-models"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"

for (const item of machineHardwareModels) {
  test(`${item.name}: finite positive parametric geometry and React/string routing`, () => {
    const geometry = item.geometry(),
      mesh = item.mesh()
    expect(jscad.measurements.measureVolume(geometry)).toBeGreaterThan(0)
    expect(mesh.positions.length).toBeGreaterThan(24)
    expect(mesh.indices.length).toBeGreaterThan(36)
    expect(mesh.indices.length % 3).toBe(0)
    expect(mesh.positions.every(Number.isFinite)).toBe(true)
    expect(
      mesh.indices.every(
        (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
      ),
    ).toBe(true)
    expect(item.changedMesh()).not.toEqual(mesh)
    const registry = new ModelRendererRegistry()
    item.register(registry)
    expect(registry.getModelNames()).toEqual([item.name])
    const definition = mp.string(item.source).json()
    expect(registry.render(definition)).toBeTruthy()
    expect(registry.get(item.name)?.pads).toBe("none")
    expect(ExtrudedPads({ footprint: item.source })).toBeNull()
    const direct = item.component(),
      selected = getComponentModel(Footprinter3d, { footprint: item.source })
    for (const result of [direct, selected]) {
      expect(result.geometries.length).toBeGreaterThan(0)
      const volume = result.geometries.reduce(
        (sum, part) => sum + jscad.measurements.measureVolume(part.geom),
        0,
      )
      expect(volume).toBeCloseTo(jscad.measurements.measureVolume(geometry), 5)
    }
    expect(() =>
      Footprinter3d({ footprint: item.source + "_typo1mm" }),
    ).toThrow()
  }, 60000)
}
const mesh = (name: string) =>
  machineHardwareModels.find((model) => model.name === name)!.mesh()
test("mounting holes and continuous bores remain empty", () => {
  const probes: [string, [number, number, number], [number, number, number]][] =
    [
      ["hinge", [19.2, 18, -1], [0, 0, 1]],
      ["barrelhinge", [12, -20, 45.6], [0, 1, 0]],
      ["drawlatch", [-38, 7.5, -1], [0, 0, 1]],
      ["toggleclamp", [-42.9, 10.5, -1], [0, 0, 1]],
      ["caster", [22.75, 17.5, 104], [0, 0, 1]],
      ["rubberbumper", [0, 0, -1], [0, 0, 1]],
      ["handwheel", [0, 0, -1], [0, 0, 1]],
      ["starknob", [0, 0, -1], [0, 0, 1]],
      ["leverhandle", [0, 0, -1], [0, 0, 1]],
      ["splitringhanger", [0, -20, 19], [0, 1, 0]],
      ["expandedmetal", [0, 0, -1], [0, 0, 1]],
      ["coolingfan", [37, 37, -1], [0, 0, 1]],
    ]
  for (const [name, origin, direction] of probes)
    expect(raySurfaceHits(mesh(name), origin, direction), name).toEqual([])
})
test("stock profiles, corner cuts, bumper counterbore and handle mount distinguish the shapes", () => {
  for (const name of ["ibeam", "teebar"])
    expect(raySurfaceHits(mesh(name), [14, 0, -1], [0, 0, 1])).toEqual([])
  expect(raySurfaceHits(mesh("squarekey"), [19.9, 3.9, -1], [0, 0, 1])).toEqual(
    [],
  )
  expect(raySurfaceHits(mesh("woodruffkey"), [14.7, 0, -1], [0, 0, 1])).toEqual(
    [],
  )
  expect(
    raySurfaceHits(mesh("roundbar"), [0, 0, 0.5], [1, 0, 0])[0],
  ).toBeCloseTo(9.5, 3)
  expect(
    raySurfaceHits(mesh("rubberbumper"), [0, 0, 12], [1, 0, 0])[0],
  ).toBeCloseTo(6.5, 3)
  expect(
    raySurfaceHits(mesh("bridgehandle"), [48, 0, 2.5], [1, 0, 0])[0],
  ).toBeCloseTo(2.5, 3)
  expect(
    raySurfaceHits(mesh("expandedmetal"), [48, 0, -1], [0, 0, 1]),
  ).toHaveLength(2)
  expect(
    raySurfaceHits(mesh("coolingfan"), [0, 0, -1], [0, 0, 1]),
  ).toHaveLength(2)
  // Installed projecting detent balls and pull ring exceed the nominal shaft.
  const pin = mesh("detentpin")
  expect(
    Math.max(...pin.positions.filter((_, i) => i % 3 === 0)),
  ).toBeGreaterThan(4)
  expect(
    Math.max(...pin.positions.filter((_, i) => i % 3 === 2)),
  ).toBeGreaterThan(70)
  const foot = mesh("levelingfoot")
  expect(Math.max(...foot.positions.filter((_, i) => i % 3 === 2))).toBeCloseTo(
    67,
    3,
  )
})
