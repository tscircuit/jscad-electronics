import { test, expect } from "bun:test"
import { MS012 } from "../lib/ms-012"

test("MS012 renders without throwing", () => {
  let res: any
  expect(() => {
    res = MS012({ pinCount: 8 })
  }).not.toThrow()
  expect(res).toBeDefined()
})
