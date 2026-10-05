/** Approximate visual finishes, not measured optical properties. */
export const componentMaterials = {
  moldedPlastic: { metalness: 0, roughness: 0.7 },
  rubber: { metalness: 0, roughness: 0.9 },
  sleeve: { metalness: 0, roughness: 0.45 },
  tinnedLead: { metalness: 1, roughness: 0.3 },
  goldContact: { metalness: 1, roughness: 0.25 },
  copper: { metalness: 1, roughness: 0.35 },
  brushedMetal: { metalness: 1, roughness: 0.4 },
  steel: { metalness: 1, roughness: 0.25 },
} as const
