import { test } from "bun:test"
import { assertExplicitCircuitJsonBypassesPolicy } from "./fixtures/assert-model-renderer-dispatch"

test(
  "model renderer registration explicit-pads",
  assertExplicitCircuitJsonBypassesPolicy,
)
