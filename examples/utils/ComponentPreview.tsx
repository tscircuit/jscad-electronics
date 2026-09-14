import { useEffect, useRef, type ReactElement } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as jscad from "@jscad/modeling"
import { createJSCADRenderer } from "jscad-fiber"

/** Fixture-only viewer: fit the camera to millimeter geometry without scaling it. */
export function ComponentPreview({ children }: { children: ReactElement }) {
  const host = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const container = host.current!
    const solids: jscad.geometries.geom3.Geom3[] = []
    createJSCADRenderer(jscad as never)
      .createJSCADRoot(solids)
      .render(children)
    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#f8fafc")
    const meshes = solids.map((solid) => {
      const positions: number[] = []
      for (const polygon of jscad.geometries.geom3.toPolygons(solid))
        for (let i = 1; i < polygon.vertices.length - 1; i++)
          positions.push(
            ...polygon.vertices[0]!,
            ...polygon.vertices[i]!,
            ...polygon.vertices[i + 1]!,
          )
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3),
      )
      geometry.computeVertexNormals()
      const color = solid.color ?? [0.6, 0.6, 0.6]
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color[0]!, color[1]!, color[2]!),
        roughness: 0.6,
      })
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)
      return mesh
    })
    const [min, max] = jscad.measurements.measureAggregateBoundingBox(...solids)
    const span = Math.max(...max.map((value, i) => value - min[i]!))
    const target = new THREE.Vector3(
      ...(min.map((value, i) => (value + max[i]!) / 2) as [
        number,
        number,
        number,
      ]),
    )
    const camera = new THREE.PerspectiveCamera(35, 1, span / 1000, span * 100)
    camera.up.set(0, 0, 1)
    scene.add(new THREE.AmbientLight(0xffffff, 1.7))
    const light = new THREE.DirectionalLight(0xffffff, 2.5)
    light.position.set(span, -span, span * 3)
    scene.add(light)
    const grid = new THREE.GridHelper(span * 3, 30, 0xcbd5e1, 0xe2e8f0)
    grid.rotation.x = Math.PI / 2
    grid.position.z = -span * 0.002
    scene.add(grid)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.copy(target)
    const resize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      const distance = (span * 2.3) / Math.min(camera.aspect, 1)
      camera.position
        .copy(target)
        .add(
          new THREE.Vector3(1, -1, 0.85).normalize().multiplyScalar(distance),
        )
      controls.update()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    renderer.setAnimationLoop(() => renderer.render(scene, camera))
    return () => {
      observer.disconnect()
      renderer.setAnimationLoop(null)
      controls.dispose()
      for (const mesh of meshes) {
        mesh.geometry.dispose()
        mesh.material.dispose()
      }
      grid.geometry.dispose()
      for (const material of Array.isArray(grid.material)
        ? grid.material
        : [grid.material])
        material.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [children])
  return (
    <div
      ref={host}
      style={{ width: "100%", height: "100vh", minHeight: 360 }}
    />
  )
}
