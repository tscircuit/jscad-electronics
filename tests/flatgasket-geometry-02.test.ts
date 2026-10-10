import { test } from "bun:test"
import { createFlatGasketMesh } from "../lib/models/flatgasket"
import {
  flatGasketProps,
  assertFlatGasketClosed,
} from "./fixtures/flatgasket-example"
test("flatgasket is a closed outward indexed shell", () =>
  assertFlatGasketClosed(createFlatGasketMesh(flatGasketProps)))
