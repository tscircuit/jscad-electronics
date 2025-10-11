import { expect, test } from "bun:test"

import {
  resolveA0402Colors,
  type A0402ColorOverrides,
  type A0402ColorProp,
} from "../lib/a0402-colors"

test("A0402 colors default to standard palette", () => {
  const resolved = resolveA0402Colors()

  expect(resolved).toEqual({
    bodyColor: "#333",
    leftTerminalColor: "#ccc",
    rightTerminalColor: "#ccc",
  })
})

test("A0402 body color accepts a string shorthand", () => {
  const resolved = resolveA0402Colors("#ff0000")

  expect(resolved.bodyColor).toBe("#ff0000")
  expect(resolved.leftTerminalColor).toBe("#ccc")
  expect(resolved.rightTerminalColor).toBe("#ccc")
})

test("A0402 color object can override all surfaces", () => {
  const overrides: A0402ColorProp = {
    body: "#111111",
    terminal: "#aaaaaa",
  }

  const resolved = resolveA0402Colors(overrides)

  expect(resolved).toEqual({
    bodyColor: "#111111",
    leftTerminalColor: "#aaaaaa",
    rightTerminalColor: "#aaaaaa",
  })
})

test("Explicit colors prop wins over color object", () => {
  const color: A0402ColorProp = {
    body: "#111111",
    terminal: "#aaaaaa",
  }

  const colors: A0402ColorOverrides = {
    body: "#222222",
    leftTerminal: "#00ff00",
    rightTerminal: "#0000ff",
  }

  const resolved = resolveA0402Colors(color, colors)

  expect(resolved).toEqual({
    bodyColor: "#222222",
    leftTerminalColor: "#00ff00",
    rightTerminalColor: "#0000ff",
  })
})
