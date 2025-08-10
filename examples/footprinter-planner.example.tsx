import { useState } from "react"
import { JsCadView, Cuboid } from "jscad-fiber"
import { getJscadPlanFromFootprinterString } from "../lib/footprinter-to-jscad-plan"

export default function FootprinterPlannerExample() {
  const [footprinterString, setFootprinterString] = useState("0402")
  const [plan, setPlan] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  const generatePlan = () => {
    try {
      const newPlan = getJscadPlanFromFootprinterString(footprinterString)
      setPlan(newPlan)
      setError(null)
    } catch (err) {
      setError((err as Error).message)
      setPlan(null)
    }
  }

  const renderModel = () => {
    if (!plan) return null
    
    // Display plan information
    const planType = plan.type
    const hasColor = plan.color || (planType === 'colorize' && plan.color)
    
    // Use a default visualization since executing the actual plan is complex
    const defaultSize = [2, 1, 0.5] 
    const color = hasColor ? 
      (plan.color ? `rgb(${plan.color.map((c: number) => Math.round(c * 255)).join(',')})` : "rgb(85,85,85)") 
      : "gray"
    
    return (
      <Cuboid 
        size={defaultSize as [number, number, number]} 
        color={color}
        offset={[0, 0, defaultSize[2]! / 2]}
      />
    )
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Footprinter to JSCAD Plan Converter</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <label>
          Footprinter String: 
          <input 
            type="text"
            value={footprinterString}
            onChange={(e) => setFootprinterString(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px", width: "200px" }}
          />
        </label>
        <button 
          onClick={generatePlan}
          style={{ marginLeft: "10px", padding: "5px 10px" }}
        >
          Generate Plan
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "20px" }}>
          Error: {error}
        </div>
      )}

      {plan && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Generated Plan:</h3>
          <pre style={{ background: "#f5f5f5", padding: "10px", overflow: "auto" }}>
            {JSON.stringify(plan, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ width: "400px", height: "300px", border: "1px solid #ccc" }}>
        <JsCadView zAxisUp showGrid>
          {renderModel()}
        </JsCadView>
      </div>
      
      <div style={{ marginTop: "20px" }}>
        <h3>Try these examples:</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["0402", "0603", "0805", "1206", "dip8", "dip16", "tssop8", "soic8", "qfp32", "pinrow6", "cap0603"].map(example => (
            <button 
              key={example}
              onClick={() => setFootprinterString(example)}
              style={{ padding: "5px 10px", fontSize: "12px" }}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}