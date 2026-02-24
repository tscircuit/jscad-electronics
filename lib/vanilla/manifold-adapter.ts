/**
 * Creates a @jscad/modeling-compatible adapter backed by manifold-3d via
 * @basefold/sketch. No direct manifold-3d import needed.
 *
 * Usage:
 *   import { createManifoldJscadAdapter, getManifoldModelForFootprint } from 'jscad-electronics/vanilla';
 *   const adapter = await createManifoldJscadAdapter();
 *   const result = getManifoldModelForFootprint('0402', adapter);
 */

export async function createManifoldJscadAdapter() {
  const { createJscadModule } = await import("@basefold/sketch")
  return createJscadModule()
}
