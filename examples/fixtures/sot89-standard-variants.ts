/** SOT-89 / JEDEC TO-243 / JEITA SC-62:
 * https://www.nxp.com/docs/en/package-information/SOT89.pdf p2.
 * Nominal D=4.5,E=2.5,A=1.5,e1=1.5. Midpoints Lp=1,HE=4,
 * bp1=.415,bp2=.465,bp3=1.6,c=.335. Rear extension=HE-E-Lp=.5.
 * Die-pad length 2.4, mold draft .15 and .02 standoff are approximate
 * where not dimensioned. Terminal roots overlap the body.
 * JLC C347186 HT7533-1 is a comparison example; five-lead SOT-89 is
 * deliberately outside this three-terminal outline.
 * All dimensions are mm; package props are independent of footprint strings.
 */
export const sot89StandardVariants = {
  "3 terminals, TO-243 SC-62": {
    footprint: "sot89_p1.5mm_w5.11mm_pw0.67mm_pl1.56mm",
    props: {
      bodyWidth: 2.5,
      bodyLength: 4.5,
      bodyHeight: 1.5,
      standoff: 0.02,
      pitch: 1.5,
      leadWidth: 0.415,
      centerLeadWidth: 0.465,
      leadLength: 1,
      terminalThickness: 0.335,
      tabWidth: 1.6,
      tabLength: 2.4,
      rearExtension: 0.5,
      taperInset: 0.15,
    },
  },
}
