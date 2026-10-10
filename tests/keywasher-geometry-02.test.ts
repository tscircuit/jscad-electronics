import { test } from "bun:test"
import { createKeyWasherMesh } from "../lib/models/keywasher"
import {
  keyWasherProps,
  assertKeyWasherClosed,
} from "./fixtures/keywasher-example"
test("keywasher is a closed outward indexed shell", () =>
  assertKeyWasherClosed(createKeyWasherMesh(keyWasherProps)))
