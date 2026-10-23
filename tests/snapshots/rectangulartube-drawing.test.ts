import { expect, test } from "bun:test"
import "bun-match-svg"
import jscad from "@jscad/modeling"
import {
  cadToGltf,
  convertCircuitJsonToDrawingSvg,
  type DrawingOptions,
} from "@tscircuit/circuit-json-to-drawing"
import { createRectangularTubeModel } from "../../lib/models/rectangulartube/model"
import { geom3ToIndexedMesh } from "../../lib/mechanical/geom3-to-indexed-mesh"
import { readJscadNamedEdge } from "../../lib/named-edges"
import { prepareTubeDimensionLine } from "../fixtures/prepare-tube-dimension-line"

test("native tube features prepare resolved paper-space dimension lines", async () => {
  const model = createRectangularTubeModel({
    width: 40,
    height: 20,
    wallThickness: 3,
    length: 80,
    outerRadius: 3,
    innerRadius: 1,
  })
  const positions: number[] = []
  const geometry = model.geometries[0]!
  if (!jscad.geometries.geom3.isA(geometry)) throw new Error("Expected solid")
  const mesh = geom3ToIndexedMesh(geometry)
  const modelPoints = Array.from(
    { length: mesh.positions.length / 3 },
    (_, i) => ({
      x: mesh.positions[i * 3]!,
      y: mesh.positions[i * 3 + 1]!,
      z: mesh.positions[i * 3 + 2]!,
    }),
  )
  const [min, max] = jscad.measurements.measureBoundingBox(geometry)
  const modelCenter = {
    x: (min[0]! + max[0]!) / 2,
    y: (min[1]! + max[1]!) / 2,
    z: (min[2]! + max[2]!) / 2,
  }
  for (let i = 0; i < mesh.positions.length; i += 3)
    positions.push(
      ...cadToGltf([
        mesh.positions[i]!,
        mesh.positions[i + 1]!,
        mesh.positions[i + 2]!,
      ]),
    )
  const scene = {
    gltf: { asset: { version: "2.0" } },
    drawCalls: [
      {
        positions: new Float32Array(positions),
        indices: new Uint32Array(mesh.indices),
        normals: null,
        uvs: null,
        model: new Float32Array([
          1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
        ]),
        material: {
          baseColorFactor: [0.42, 0.49, 0.59, 1] as [
            number,
            number,
            number,
            number,
          ],
          baseColorTexture: null,
        },
      },
    ],
  }
  const page = {
    type: "drawing_page",
    drawing_page_id: "tube_sheet",
    name: "Native rectangular tube dimensions",
    width: 297,
    height: 210,
  }
  const cad = {
    type: "cad_component",
    cad_component_id: "cad_tube",
    source_component_id: "source_tube",
  }
  const view = (
    id: string,
    name: string,
    direction: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => ({
    type: "drawing_part_view",
    drawing_part_view_id: id,
    drawing_page_id: page.drawing_page_id,
    name,
    direction,
    source_component_ids: [cad.source_component_id],
    center: { x, y },
    width,
    height,
    scale: 1,
  })
  const endView = view("end", "END PROFILE", "z_positive", -85, 35, 90, 90)
  const sideView = view("side", "SIDE ELEVATION", "y_negative", 5, 20, 70, 140)
  const bore = readJscadNamedEdge(model, "inner_top")
  const outer = readJscadNamedEdge(model, "outer_top")
  // Model interpretation and annotation layout happen before exporting. No
  // model target, orientation, offset, precision or inference flag enters CJ.
  const dimensions = [
    prepareTubeDimensionLine("bore_width", endView, bore.points, modelCenter, {
      orientation: "horizontal",
      offset: 10,
      clearanceSamples: outer.points,
      edgeRefName: "inner_top",
    }),
    prepareTubeDimensionLine(
      "outer_width",
      endView,
      outer.points,
      modelCenter,
      {
        orientation: "horizontal",
        offset: -10,
        edgeRefName: "outer_top",
      },
    ),
    prepareTubeDimensionLine(
      "overall_height",
      endView,
      outer.points,
      modelCenter,
      {
        orientation: "vertical",
        offset: 10,
      },
    ),
    prepareTubeDimensionLine(
      "overall_length",
      sideView,
      modelPoints,
      modelCenter,
      {
        orientation: "vertical",
        offset: -10,
      },
    ),
  ]
  const input = [
    page,
    cad,
    endView,
    sideView,
    view("iso", "ISOMETRIC", "isometric", 100, 20, 75, 115),
    ...dimensions,
    {
      type: "drawing_page_title_block",
      drawing_page_title_block_id: "tube_title",
      drawing_page_id: page.drawing_page_id,
      title: "RECTANGULAR TUBE / DIMENSIONS IN mm",
      identification_number: "W40 H20 WALL3 L80 R3 R1",
      revision_index: "A",
      legal_owner: "tscircuit",
      creator: "jscad-electronics",
      sheet_number: 1,
      number_of_sheets: 1,
    },
  ]
  const resolveModelEdges: NonNullable<DrawingOptions["resolveModelEdges"]> = (
    view,
  ) =>
    view.drawing_part_view_id === "end"
      ? [
          { name: "inner_top", ...bore },
          { name: "outer_top", ...outer },
        ]
      : []
  const svg = await convertCircuitJsonToDrawingSvg(input, {
    pixelsPerMm: 2,
    supersampling: 2,
    resolveScene: () => scene,
    showEdgeNames: true,
    resolveModelEdges,
  })
  expect(dimensions.map((dimension) => dimension.text)).toEqual([
    "34.0",
    "40.0",
    "20.0",
    "80.0",
  ])
  for (const dimension of dimensions) {
    expect(
      Math.hypot(
        dimension.end.x - dimension.start.x,
        dimension.end.y - dimension.start.y,
      ),
    ).toBeCloseTo(Number(dimension.text), 3)
    expect(svg).toContain(
      `data-drawing-dimension-line-id="${dimension.drawing_dimension_line_id}"`,
    )
  }
  expect(bore.closed).toBe(true)
  expect(outer.points.length).toBeGreaterThan(4)
  expect(svg).toContain('data-drawing-edge-name="inner_top"')
  expect(svg).toContain('data-drawing-edge-name="outer_top"')
  expect(svg.match(/data-drawing-edge-name=/g)).toHaveLength(2)
  await expect(svg).toMatchSvgSnapshot(import.meta.path)
})
