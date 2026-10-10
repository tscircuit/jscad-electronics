import { expect, test } from "bun:test"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { flatGasketSource } from "./fixtures/flatgasket-example"
test("flatgasket mechanical dispatch produces no PCB pads", () =>
  expect(ExtrudedPads({ footprint: flatGasketSource })).toBeNull())
