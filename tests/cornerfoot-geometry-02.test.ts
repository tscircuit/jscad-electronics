import { test } from "bun:test"
import { createCornerFootMesh } from "../lib/models/cornerfoot"
import {
  cornerFootProps,
  assertCornerFootClosed,
} from "./fixtures/cornerfoot-example"
test("cornerfoot is a closed outward indexed shell", () =>
  assertCornerFootClosed(createCornerFootMesh(cornerFootProps)))
