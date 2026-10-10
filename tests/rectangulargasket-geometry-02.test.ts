import { test } from "bun:test"
import { createRectangularGasketMesh } from "../lib/models/rectangulargasket"
import {
  rectangularGasketProps,
  assertRectangularGasketClosed,
} from "./fixtures/rectangulargasket-example"
test("rectangulargasket is a closed outward indexed shell", () => {
  for (const cornerRadius of [0, 5, 10])
    assertRectangularGasketClosed(
      createRectangularGasketMesh({ ...rectangularGasketProps, cornerRadius }),
    )
})
