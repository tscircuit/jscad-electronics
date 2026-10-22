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

test("named extrusion outlines produce conventional tube dimensions", async () => {
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
  })
  const edge = (id: string, name: string, offset: number) => ({
    type: "drawing_dimension",
    drawing_dimension_id: id,
    drawing_part_view_id: "end",
    cad_component_id: cad.cad_component_id,
    edge_name: name,
    orientation: "horizontal",
    offset,
  })
  const input = [
    page,
    cad,
    view("end", "END PROFILE", "z_positive", -85, 35, 90, 90),
    view("side", "SIDE ELEVATION", "y_negative", 5, 20, 70, 140),
    view("iso", "ISOMETRIC", "isometric", 100, 20, 75, 115),
    edge("bore_width", "inner_top", 10),
    edge("outer_width", "outer_top", -10),
    {
      type: "drawing_dimension",
      drawing_dimension_id: "overall_height",
      drawing_part_view_id: "end",
      height_of_view: true,
      offset: 10,
    },
    {
      type: "drawing_dimension",
      drawing_dimension_id: "overall_length",
      drawing_part_view_id: "side",
      height_of_view: true,
      offset: -10,
    },
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
  const resolveModelEdge: NonNullable<DrawingOptions["resolveModelEdge"]> = (
    dimension,
  ) => {
    if (dimension.cad_component_id !== cad.cad_component_id)
      throw new Error("Unknown model instance")
    // This fixture uses identity placement. Placed instances transform every
    // model-local reader sample before returning CAD world points to the exporter.
    return readJscadNamedEdge(model, dimension.edge_name!)
  }
  const svg = await convertCircuitJsonToDrawingSvg(input, {
    pixelsPerMm: 2,
    supersampling: 2,
    resolveScene: () => scene,
    resolveModelEdge,
  })
  const measured = (id: string) =>
    Number(
      svg.match(
        new RegExp(
          `data-drawing-dimension-id="${id}" data-measured-value="([^"]+)"`,
        ),
      )?.[1],
    )
  expect(measured("bore_width")).toBeCloseTo(34, 3)
  expect(measured("outer_width")).toBeCloseTo(40, 3)
  expect(measured("overall_height")).toBeCloseTo(20, 3)
  expect(measured("overall_length")).toBeCloseTo(80, 3)
  expect(readJscadNamedEdge(model, "outer_top").closed).toBe(true)
  expect(readJscadNamedEdge(model, "outer_top").points.length).toBeGreaterThan(
    4,
  )
  expect(svg.match(/data-drawing-dimension-id=/g)).toHaveLength(4)
  await expect(svg).toMatchSvgSnapshot(import.meta.path)
})
