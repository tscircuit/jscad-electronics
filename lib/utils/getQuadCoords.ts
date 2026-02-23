export const getQuadCoords = (params: {
  pin_count: number;
  pn: number; // pin number
  w: number; // width of the package
  h: number; // height (length) of the package
  p: number; // pitch between pins
  pl: number; // length of the pin
  legsoutside?: boolean;
}) => {
  const SIDES_CCW = ["left", "bottom", "right", "top"] as const;
  const { pin_count, pn, w, h, p, pl, legsoutside } = params;
  const sidePinCount = pin_count / 4;
  const side = SIDES_CCW[Math.floor((pn - 1) / sidePinCount)];
  const pos = (pn - 1) % sidePinCount;
  /** inner box width */
  const ibw = p * (sidePinCount - 1);
  /** inner box height */
  const ibh = p * (sidePinCount - 1);

  /** pad center distance from edge (negative is inside, positive is outside) */
  const pcdfe = legsoutside ? pl / 2 : -pl / 2;

  switch (side) {
    case "left":
      return { x: -w / 2 - pcdfe, y: ibh / 2 - pos * p, o: "vert" };
    case "bottom":
      return { x: -ibw / 2 + pos * p, y: -h / 2 - pcdfe, o: "horz" };
    case "right":
      return { x: w / 2 + pcdfe, y: -ibh / 2 + pos * p, o: "vert" };
    case "top":
      return { x: ibw / 2 - pos * p, y: h / 2 + pcdfe, o: "horz" };
    default:
      throw new Error("Invalid pin number");
  }
};
