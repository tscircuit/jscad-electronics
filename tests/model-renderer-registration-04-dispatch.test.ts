import { test } from "bun:test"
import { assertReactAndVanillaRendererDispatch } from "./fixtures/assert-model-renderer-dispatch"

test(
  "model renderer registration dispatch",
  assertReactAndVanillaRendererDispatch,
)
