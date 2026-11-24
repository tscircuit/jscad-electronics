import { expect, test } from "bun:test"
import { getExpandedStroke } from "../lib/utils/getExpandedStroke"

const allFinite = (points: { x: number; y: number }[]) =>
  points.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y))

test("straight stroke expands to a rectangle", () => {
  const polygon = getExpandedStroke(
    [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
    ],
    0.5,
  )
  expect(allFinite(polygon)).toBe(true)
  expect(polygon).toHaveLength(4)
})

test("stroke doubling back on itself produces finite points", () => {
  const polygon = getExpandedStroke(
    [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 0 },
    ],
    0.5,
  )
  expect(allFinite(polygon)).toBe(true)
})

test("repeated consecutive points produce finite points", () => {
  const polygon = getExpandedStroke(
    [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 1 },
    ],
    0.5,
  )
  expect(allFinite(polygon)).toBe(true)
})

test("repeated consecutive points expand like the deduplicated stroke", () => {
  const withDuplicate = getExpandedStroke(
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ],
    0.5,
  )
  const withoutDuplicate = getExpandedStroke(
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ],
    0.5,
  )
  expect(withDuplicate).toEqual(withoutDuplicate)
})
