import { test } from "bun:test"
import { assertModelRendererRegistryErrorsAndIdentity } from "./fixtures/assert-model-renderer-registry"

test(
  "model renderer registration errors preserve normalized callback identity",
  assertModelRendererRegistryErrorsAndIdentity,
)
