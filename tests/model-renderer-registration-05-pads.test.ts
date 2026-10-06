import { test } from "bun:test"
import { assertRendererPadPolicies } from "./fixtures/assert-model-renderer-dispatch"

test("model renderer registration pads", assertRendererPadPolicies)
