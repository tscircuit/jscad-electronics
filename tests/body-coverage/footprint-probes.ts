/**
 * The body-coverage ledger.
 *
 * `getJscadModelForFootprint` accepts every footprinter name, builds whatever
 * it has a case for, and returns cleanly with `geometries: []` for the rest.
 * Nothing throws, so a missing body is invisible — until something *measures*
 * the result: `core`'s `measureFootprinterBody` feeds `create-fdm-enclosure`,
 * which cannot tell whether a screw boss runs through a part with no height.
 *
 * These three lists are what makes that visible. They are consumed by
 * `registry-coverage.test.ts` (every registered footprint is in exactly one
 * bucket) and by the per-footprint poppygl snapshots beside them.
 */

/**
 * Footprints that are copper features rather than parts. An empty model is the
 * RIGHT answer here — without this list a coverage test drives someone to model
 * a solder pad.
 */
export const NO_BODY = [
  "pad",
  "platedhole",
  "smtpad",
  "smdpads",
  "solderjumper",
] as const

/**
 * Names that carry no dimensions on their own: footprinter needs a pin count or
 * a size before it will parse them. A probe is one representative instance.
 */
export const PROBE: Record<string, string> = {
  bga: "bga64",
  cap: "cap0402",
  crystal: "crystal_p1mm_w2mm_h2mm",
  dfn: "dfn8",
  diode: "diode0402",
  dip: "dip8",
  fpc: "fpc6",
  headermodule: "headermodule",
  jst: "jst6_sh",
  lcc: "lcc20",
  led: "led0603",
  lga: "lga14",
  lqfp: "lqfp64",
  mlp: "mlp64",
  ms012: "ms012_8",
  ms013: "ms013_8",
  msop: "msop8",
  pad: "pad_w1_h1",
  pinrow: "pinrow4",
  platedhole: "platedhole_id1_od2",
  qfn: "qfn24",
  qfp: "qfp32",
  quad: "quad32",
  res: "res0402",
  smdpads: "smdpads",
  smdpinheader: "smdpinheader4",
  smdslideswitch: "smdslideswitch",
  smtpad: "smtpad_1mm",
  soic: "soic8",
  solderjumper: "solderjumper2",
  son: "son8",
  sot143: "sot143",
  ssop: "ssop20",
  tqfp: "tqfp32",
  tssop: "tssop8",
  vson: "vson8_p0.5_w2.5_grid2x3mm_pinw0.3_pinh0.5",
  vssop: "vssop8",
  wson: "wson8",
}

/**
 * Footprints that SHOULD have a body and do not, with the reason each is still
 * open. Every entry has a rendered snapshot beside this file showing what the
 * viewer draws today: bare pads.
 *
 * Delete an entry when you add its body — `registry-coverage.test.ts` fails on
 * a name that is listed here but now builds geometry, so the ledger cannot
 * quietly go stale in either direction.
 */
export const MISSING_BODIES: Record<string, string> = {
  headermodule: "no 3D model yet",
  jst: "only the ZH 1.5mm and XH 2.5mm series have bodies; `jst6_sh` and the rest have none",
  lcc: "no 3D model yet",
  m2host:
    "footprinter reports NO dimensions for it (`{fn:'m2host'}`), so the socket has to be modelled from the M.2 spec rather than derived from the footprint",
  smdslideswitch: "no 3D model yet",
  sot143: "no 3D model yet",
  usbcmidmount:
    "USB-C.tsx exists, but it draws with `Ellipsoid` and with `rotation` props on primitives — neither of which lib/vanilla implements, and the second is IGNORED rather than rejected, so reusing it would silently render the wrong shape. Extend the vanilla renderer first",
}

/** The probe string to feed footprinter for a registered name. */
export const probeFor = (name: string): string => PROBE[name] ?? name

/**
 * How tall each package is, in mm above the board.
 *
 * These are TYPICAL heights for the package family, not per-part datasheet
 * values — a generic footprint name does not identify a part, and several of
 * these names (`bga`, `son`, `electrolytic`) cover a range of heights. Where a
 * name does pin a package down, the value is that package's nominal height.
 *
 * It is recorded here, next to the gap,
 * for two uses that must agree:
 *
 *  - the render camera (`footprint-camera.ts`) frames a volume this tall, so
 *    the before and after images are taken from EXACTLY the same viewpoint. A
 *    camera that frames the model instead would move when the body appeared,
 *    and the diff would read as a different scene rather than a part arriving.
 *  - `body-envelope.test.ts` asserts the built body against it.
 *
 * One table, so a body cannot pass the assertion while being framed as though
 * it were another size.
 */
export const NOMINAL_HEIGHT_MM: Record<string, number> = {
  bga: 1.2,
  breakoutheaders: 9,
  d2pak: 4.9,
  dpak: 2.8,
  electrolytic: 15,
  jst: 6,
  led2835: 1,
  lga: 0.8,
  m2host: 5,
  mlp: 0.9,
  potentiometer: 5,
  quad: 1,
  radial: 14,
  smbf: 2.3,
  smdpushbutton: 2,
  sod110: 1.1,
  sod323w: 1.1,
  sod80: 1.6,
  sod882d: 0.5,
  son: 1,
  sop8: 1.5,
  sot: 1.3,
  sot25: 1.35,
  sot343: 1.2,
  sot563: 0.7,
  sot89: 1.6,
  ssop: 1.5,
  to220f: 18.6,
  to252: 2.8,
  to263: 4.9,
  to92l: 6,
  to92s: 6,
  usbcmidmount: 3.2,
  vson: 1,
  wson: 1,
}

export const nominalHeightFor = (name: string): number =>
  NOMINAL_HEIGHT_MM[name] ?? 3
