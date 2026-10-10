import { expect, test } from "bun:test"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { rectangularGasketSource } from "./fixtures/rectangulargasket-example"
test("rectangulargasket mechanical dispatch produces no PCB pads", () =>
  expect(ExtrudedPads({ footprint: rectangularGasketSource })).toBeNull())
