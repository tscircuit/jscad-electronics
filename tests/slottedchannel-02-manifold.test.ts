import { expect, test } from "bun:test"
import { createSlottedChannelMesh } from "../lib/models/slottedchannel"
import { props, checkMesh } from "./fixtures/slottedchannel"
test("slottedchannel 2: indexed triangles form a closed outward manifold", () => {
  checkMesh(createSlottedChannelMesh(props))
})
