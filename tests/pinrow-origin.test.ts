import { expect, test } from "bun:test"
import { PinRow } from "../lib/PinRow"

function getPinRowYs({
  numberOfPins,
  rows,
  pitch,
}: {
  numberOfPins: number
  rows: number
  pitch: number
}) {
  const pinRow = PinRow({ numberOfPins, rows, pitch })
  const children = pinRow.props.children
  return children.map((child: any) => child.props.y)
}

function uniquePositions(values: number[]) {
  return Array.from(new Set(values))
}

test("pinrow16_rows2 row centers are centered around component origin", () => {
  const yPositions = getPinRowYs({ numberOfPins: 16, rows: 2, pitch: 2.54 })

  expect({
    footprint: "pinrow16_rows2",
    pitch: 2.54,
    rowCentersY: uniquePositions(yPositions),
    allPinYPositions: yPositions,
  }).toMatchInlineSnapshot(`
    {
      "allPinYPositions": [
        1.27,
        1.27,
        1.27,
        1.27,
        1.27,
        1.27,
        1.27,
        1.27,
        -1.27,
        -1.27,
        -1.27,
        -1.27,
        -1.27,
        -1.27,
        -1.27,
        -1.27,
      ],
      "footprint": "pinrow16_rows2",
      "pitch": 2.54,
      "rowCentersY": [
        1.27,
        -1.27,
      ],
    }
  `)
})

test("single-row pinrow remains centered at y = 0", () => {
  const yPositions = getPinRowYs({ numberOfPins: 16, rows: 1, pitch: 2.54 })

  expect(yPositions).toEqual(Array(16).fill(0))
})
