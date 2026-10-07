import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  getJstMotorConnector,
  getNemaMotorReferencePoints,
} from "@tscircuit/modelprinter"
import { createNemaMotorWireGeometry } from "../lib/utils/nemaMotorWireGeometry"

test("JST PH and SH motor headers use their selected pin counts and mating faces", () => {
  for (const family of ["ph", "sh"]) {
    for (
      let pinCount = 2;
      pinCount <= (family === "ph" ? 16 : 15);
      pinCount++
    ) {
      const wireConnection = `jst-${family}-${pinCount}`
      const spec = getJstMotorConnector(wireConnection)!
      const connector = createNemaMotorWireGeometry({
        nemaSize: 17,
        wireConnection,
      })
      expect(connector).toHaveLength(pinCount + 1)
      const [min, max] = jscad.measurements.measureAggregateBoundingBox(
        ...connector.map((c) => c.geometry),
      )
      expect(max[1] - min[1]).toBeCloseTo(spec.bodyWidth)
      expect(max[2] - min[2]).toBeCloseTo(spec.bodyHeight)
      const ref = getNemaMotorReferencePoints({ nemaSize: 17 }).wireside
        .position
      expect(max[0]).toBeCloseTo(ref.x + spec.matingDepth)
      const contactYs = connector
        .slice(1)
        .map((c) => jscad.measurements.measureCenter(c.geometry)[1])
      expect(contactYs[1]! - contactYs[0]!).toBeCloseTo(spec.pitch)
      for (const { geometry } of connector)
        expect(jscad.measurements.measureVolume(geometry)).toBeGreaterThan(0)
    }
  }
})
