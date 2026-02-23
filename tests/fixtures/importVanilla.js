import path from "node:path";
import url from "node:url";

const distFileUrl = (rel) =>
  url.pathToFileURL(path.resolve(import.meta.dirname, rel)).href;

export async function importVanilla() {
  const mod = await import(distFileUrl("../../dist/vanilla.js"));
  if (typeof mod.getJscadModelForFootprint !== "function") {
    throw new Error("getJscadModelForFootprint not found in dist/vanilla.js");
  }
  return mod;
}
