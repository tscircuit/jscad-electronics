- Do not edit README.md.
- Do not change package versions or modelprinter dependency pins for new models. Link the paired modelprinter PR in the renderer PR body; builds combine that contract with current modelprinter main and bundle it. For local development use `MODELPRINTER_PR=<number> bun install` (see `docs/model-registration.md`).
- Every PR introducing a new model must include a checked-in standard four-view PNG snapshot (ISOMETRIC, TOP, FRONT, SIDE), labeled with its full model string, and a passing visual snapshot test; use `tests/fixtures/render-model-snapshot.ts` and cover newly introduced male/female or grouped variants separately.
- Add modelprinter renderers under `lib/models/<compactname>/` with a public `index.ts` and typed `register.tsx` descriptor; consume modelprinter schemas instead of duplicating specs.
- Keep `model` and `register` private to the registration module. Generated main/vanilla barrels use `index.ts`, or an optional `vanilla.ts` override, to preserve each entrypoint's public API.
- Do not edit ignored `lib/generated/` files or central renderer/pad lists. Use the generation/build hooks and watch workflow described in [docs/model-registration.md](docs/model-registration.md).
- Model strings use standard or de-facto names and value-free boolean flags.
  Shorthand/suffix expansion and normalized face contracts belong to
  modelprinter; renderers consume its schema rather than parsing strings or
  special-casing shorthand. For radial bearings, top is Z=width and bottom is
  Z=0. Geometry tests and snapshots must cover asymmetric face choices.
