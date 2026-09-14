/** JEDEC TO-277A outline: https://www.vishay.com/docs/89170/v8p12.pdf p4.
 * Midpoints: mold6.1x4.3,A=1.1,c=.275,overallspan6.5; contacts1.2x1.09;
 * pitch2.13 nominal. Cathode length4.6,width3.55,neck2.05,bar4.6x.75.
 * Neck length=.66 from 4.6-3.94. Corner radii and side frame stubs omitted.
 * PCB overall length 6.8, cathode land 4.72, anode land 1.27 give
 * DPAK omits the middle lead, so its pitch is half the 2.13 contact spacing.
 * pad-center span=6.8-(4.72+1.27)/2=3.805 and midpoint offset=-.8625.
 * The legal DPAK pad string is copper context only, not package identity.
 * JLC C908747 SB1045L and C20199364 SB10100 are comparison candidates;
 * their TO-277 / TO-277B labels do not establish exact TO-277A equivalence.
 * All dimensions are mm; package props are independent of footprint strings.
 */
export const to277StandardVariants = {
  "TO-277A, 6.1 x 4.3 mm": {
    footprint:
      "dpak3_p1.065mm_pw1.4mm_pl1.27mm_tabw4.72mm_tabh4.8mm_span3.805mm",
    props: {
      bodyWidth: 6.1,
      bodyLength: 4.3,
      bodyHeight: 1.1,
      terminalThickness: 0.275,
      terminalSpan: 6.5,
      leadWidth: 1.2,
      leadLength: 1.09,
      pitch: 2.13,
      tabLength: 4.6,
      tabWidth: 3.55,
      tabNeckWidth: 2.05,
      tabNeckLength: 0.66,
      tabBarWidth: 4.6,
      tabBarLength: 0.75,
    },
  },
}
