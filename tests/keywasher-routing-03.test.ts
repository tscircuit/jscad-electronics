import { expect, test } from "bun:test"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { keyWasherSource } from "./fixtures/keywasher-example"
test("keywasher mechanical dispatch produces no PCB pads", () =>
  expect(ExtrudedPads({ footprint: keyWasherSource })).toBeNull())
