import { expect, test } from "bun:test"
import { selectContractRef } from "../scripts/prepare-model-contracts.mjs"

test("ordinary builds use modelprinter main", () => {
  expect(selectContractRef({}, {})).toBeNull()
})

test("PR builds select only the linked modelprinter contract", () => {
  expect(
    selectContractRef(
      {},
      {
        pull_request: {
          body: "Consumes https://github.com/tscircuit/modelprinter/pull/66\nhttps://github.com/another/modelprinter/pull/99",
        },
      },
    ),
  ).toBe("refs/pull/66/head")
})

test("repeated links are fine but ambiguous pairs fail", () => {
  const pair = "https://github.com/tscircuit/modelprinter/pull/66"
  expect(
    selectContractRef({}, { pull_request: { body: `${pair} ${pair}` } }),
  ).toBe("refs/pull/66/head")
  expect(() =>
    selectContractRef(
      {},
      {
        pull_request: {
          body: `${pair} https://github.com/tscircuit/modelprinter/pull/67`,
        },
      },
    ),
  ).toThrow("Multiple modelprinter PRs")
})

test("explicit PR overrides event links and rejects ref injection", () => {
  expect(
    selectContractRef(
      { MODELPRINTER_PR: "66" },
      {
        pull_request: {
          body: "https://github.com/tscircuit/modelprinter/pull/67",
        },
      },
    ),
  ).toBe("refs/pull/66/head")
  expect(
    selectContractRef({
      MODELPRINTER_PR: "https://github.com/tscircuit/modelprinter/pull/66",
    }),
  ).toBe("refs/pull/66/head")
  expect(() =>
    selectContractRef({ MODELPRINTER_PR: "--upload-pack=evil" }),
  ).toThrow()
  expect(() =>
    selectContractRef({
      MODELPRINTER_PR: "https://github.com/other/modelprinter/pull/66",
    }),
  ).toThrow()
})

test("immutable override takes precedence and requires a full SHA", () => {
  const sha = "0123456789abcdef0123456789abcdef01234567"
  expect(
    selectContractRef({ MODELPRINTER_REF: sha, MODELPRINTER_PR: "66" }),
  ).toBe(sha)
  expect(() => selectContractRef({ MODELPRINTER_REF: "main" })).toThrow(
    "full 40-character",
  )
})
