import { test } from "bun:test"
import { assertSynchronousRendererDispatch } from "./fixtures/assert-model-renderer-dispatch"

test(
  "model renderer registration synchronous",
  assertSynchronousRendererDispatch,
)
