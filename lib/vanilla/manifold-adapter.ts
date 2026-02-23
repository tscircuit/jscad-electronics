/**
 * Creates a @jscad/modeling-compatible adapter backed by manifold-3d via
 * basefold. No direct manifold-3d import needed — basefold handles WASM
 * loading internally.
 *
 * Usage:
 *   import { createManifoldJscadAdapter, getManifoldModelForFootprint } from 'jscad-electronics/vanilla';
 *   const adapter = await createManifoldJscadAdapter();
 *   const result = getManifoldModelForFootprint('0402', adapter);
 */

export async function createManifoldJscadAdapter() {
  const { createJscadModule } = await import("basefold")
  return createJscadModule()
}
