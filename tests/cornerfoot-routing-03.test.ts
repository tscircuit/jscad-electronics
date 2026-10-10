import { expect, test } from "bun:test"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { cornerFootSource } from "./fixtures/cornerfoot-example"
test("cornerfoot mechanical dispatch produces no PCB pads", () =>
  expect(ExtrudedPads({ footprint: cornerFootSource })).toBeNull())
