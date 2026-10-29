export interface DfnFootprintDimensions {
  w: number
  h?: number
  bodywidth?: number
  bodylength?: number
}

export const getDfnBodyDimensions = ({
  w,
  h,
  bodywidth,
  bodylength,
}: DfnFootprintDimensions): {
  bodyWidth: number
  bodyLength: number | undefined
} => ({
  bodyWidth: bodywidth ?? w,
  bodyLength: bodylength ?? h,
})
