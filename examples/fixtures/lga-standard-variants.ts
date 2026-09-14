/** LGA16 3 x 3: ST LIS3DH package table and drawing, figure 12.
 * https://www.st.com/resource/en/datasheet/lis3dh.pdf
 * https://pages.hmc.edu/harris/class/e85/LIS3DH.pdf (ST Rev 1, p40)
 * D1/E1=3, A1=1 max, N1=.5, T1=.35, T2=.25, P2=1.275;
 * edge inset=1.5-1.275-.35/2=.05. Metallization .015 is representative,
 * not separately toleranced. Substrate/cap are one external envelope;
 * pin-1 dimple is a visual approximation. JLC C15134 LIS3DHTR is a
 * comparison example, not a manufacturer-specific selector.
 * All dimensions are mm; package props are independent of footprint strings.
 */
export const lgaStandardVariants = {
  "16 lands, 3 x 3 mm": {
    footprint: "lga16_grid5x3_p0.5mm_w3.6mm_pl0.8mm",
    props: {
      bodyWidth: 3,
      bodyLength: 3,
      bodyHeight: 1,
      landsPerSideX: 5,
      landsPerSideY: 3,
      pitch: 0.5,
      landWidth: 0.25,
      landLength: 0.35,
      edgeInset: 0.05,
      landThickness: 0.015,
    },
  },
}
