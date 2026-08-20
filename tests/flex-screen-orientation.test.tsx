import * as jscadModeling from "@jscad/modeling"
import { expect, test } from "bun:test"
import { createJSCADRenderer } from "jscad-fiber"
import type { ReactElement } from "react"
import { FlexScreen } from "../lib/FlexScreen"

const boundsFor = (element: ReactElement) => {
  const geometries: any[] = []
  const { createJSCADRoot } = createJSCADRenderer(jscadModeling as never)
  createJSCADRoot(geometries).render(element)
  return jscadModeling.measurements.measureAggregateBoundingBox(...geometries)
}

test("distanceAboveBoard sets the backplane of a 180-degree upward fold", () => {
  const [, maximum] = boundsFor(
    <FlexScreen
      foldedToFaceAboveBoard
      flexCableLength={40}
      distanceAboveBoard={12}
      screenThickness={1.2}
    />,
  )
  expect(maximum[2]).toBeCloseTo(13.2)
})

test("foldsAboveBoard honors 20 mm clearance with a custom fold outset", () => {
  const [, maximum] = boundsFor(
    <FlexScreen
      foldsAboveBoard
      flexCableLength={64}
      distanceAboveBoard={20}
      foldDistanceFromConnector={12}
      foldOutset={10}
      screenThickness={1.2}
    />,
  )
  expect(maximum[2]).toBeCloseTo(21.2)
})

test("distanceBelowBoard sets the backplane of a board-edge downward fold", () => {
  const [minimum] = boundsFor(
    <FlexScreen
      foldsBelowBoard
      flexCableLength={40}
      distanceBelowBoard={10}
      screenThickness={1.2}
    />,
  )
  expect(minimum[2]).toBeCloseTo(-12.8)
})

test("sitsFlat does not create a 180-degree loop", () => {
  const [minimum, maximum] = boundsFor(
    <FlexScreen sitsFlat flexCableLength={20} width={30} height={18} />,
  )
  expect(maximum[1] - minimum[1]).toBeCloseTo(38, 1)
  expect(maximum[2]).toBeLessThan(2)
})

test("rejects a cable too short for the requested 180-degree fold", () => {
  expect(() =>
    FlexScreen({
      foldedToFaceAboveBoard: true,
      flexCableLength: 8,
      distanceAboveBoard: 12,
      foldDistanceFromConnector: 7,
      foldOutset: 5,
    }),
  ).toThrow("flexCableLength must be at least")
})
