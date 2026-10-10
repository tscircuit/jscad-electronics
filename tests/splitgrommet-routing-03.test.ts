import { expect, test } from "bun:test"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { splitGrommetSource } from "./fixtures/splitgrommet-example"
test("splitgrommet mechanical dispatch produces no PCB pads", () =>
  expect(ExtrudedPads({ footprint: splitGrommetSource })).toBeNull())
