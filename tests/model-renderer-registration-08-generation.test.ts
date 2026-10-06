import { test } from "bun:test"
import { assertModelRendererGeneration } from "./fixtures/assert-model-renderer-generation"

test(
  "model renderer discovery is deterministic across Bun and Node and follows folder changes",
  assertModelRendererGeneration,
)
