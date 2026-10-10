import { test } from "bun:test"
import { createSplitGrommetMesh } from "../lib/models/splitgrommet"
import {
  splitGrommetProps,
  assertSplitGrommetClosed,
} from "./fixtures/splitgrommet-example"
test("splitgrommet is a closed outward indexed shell", () =>
  assertSplitGrommetClosed(createSplitGrommetMesh(splitGrommetProps)))
