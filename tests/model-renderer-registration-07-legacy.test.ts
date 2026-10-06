import { test } from "bun:test"
import { assertLegacyRendererFallthrough } from "./fixtures/assert-model-renderer-dispatch"

test("model renderer registration legacy", assertLegacyRendererFallthrough)
