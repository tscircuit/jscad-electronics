import { test } from "bun:test"
import { assertModelRendererRegistryIsolation } from "./fixtures/assert-model-renderer-registry"

test(
  "model renderer registrations are isolated and initialized synchronously",
  assertModelRendererRegistryIsolation,
)
