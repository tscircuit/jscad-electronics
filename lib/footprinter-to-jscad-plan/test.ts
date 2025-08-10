import { getJscadPlanFromFootprinterString } from "./index"

// Test cases for different footprinter strings
const testCases = [
  "0402",
  "0603", 
  "0805",
  "1206",
  "dip8",
  "dip16",
  "tssop8",
  "tssop16", 
  "soic8",
  "qfp32",
  "pinrow6",
  "sot235",
  "cap0603"
]

console.log("Testing footprinter to JSCAD plan conversion:")
console.log("=" .repeat(50))

for (const testCase of testCases) {
  try {
    const plan = getJscadPlanFromFootprinterString(testCase)
    console.log(`✅ ${testCase}: ${plan.type}`)
    console.log(`   Size: [${plan.size?.join(', ')}]`)
    if (plan.color) {
      console.log(`   Color: [${plan.color.join(', ')}]`)
    }
    console.log("")
  } catch (error) {
    console.log(`❌ ${testCase}: ${(error as Error).message}`)
    console.log("")
  }
}