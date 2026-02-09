import { useState, useMemo } from "react"
import "./KMap.css"

// Constants
const GRAY = ["00", "01", "11", "10"]
const VARS = ["A", "B", "C", "D"]
const CELL_SIZE = 64

const GROUP_COLORS = [
  { bg: "rgba(14, 165, 142, 0.22)", border: "rgba(14, 165, 142, 0.6)", solid: "#0ea58e" },
  { bg: "rgba(217, 70, 70, 0.20)", border: "rgba(217, 70, 70, 0.55)", solid: "#d94646" },
  { bg: "rgba(124, 93, 214, 0.20)", border: "rgba(124, 93, 214, 0.55)", solid: "#7c5dd6" },
  { bg: "rgba(42, 120, 200, 0.20)", border: "rgba(42, 120, 200, 0.55)", solid: "#2a78c8" },
  { bg: "rgba(214, 155, 30, 0.20)", border: "rgba(214, 155, 30, 0.55)", solid: "#d69b1e" },
  { bg: "rgba(70, 160, 80, 0.20)", border: "rgba(70, 160, 80, 0.55)", solid: "#46a050" },
  { bg: "rgba(200, 80, 160, 0.20)", border: "rgba(200, 80, 160, 0.55)", solid: "#c850a0" },
  { bg: "rgba(100, 116, 139, 0.22)", border: "rgba(100, 116, 139, 0.55)", solid: "#64748b" },
]

type CellValue = "0" | "1" | "X"

interface PrimeImplicant {
  mask: string
  minterms: Set<number>
}

// Grid ↔ Minterm mapping
function mintermIndex(row: number, col: number): number {
  const ab = GRAY[row]
  const cd = GRAY[col]
  return parseInt(ab[0] + ab[1] + cd[0] + cd[1], 2)
}

function mintermToRowCol(m: number): { row: number; col: number } {
  const bits = m.toString(2).padStart(4, "0")
  const ab = bits[0] + bits[1]
  const cd = bits[2] + bits[3]
  return { row: GRAY.indexOf(ab), col: GRAY.indexOf(cd) }
}

// Quine-McCluskey helpers
function mintermToBin(m: number): string {
  return m.toString(2).padStart(4, "0")
}

function countOnes(s: string): number {
  let c = 0
  for (let i = 0; i < s.length; i++) if (s[i] === "1") c++
  return c
}

function singleDiff(a: string, b: string): number {
  let pos = -1
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      if (a[i] === "-" || b[i] === "-") return -1
      if (pos !== -1) return -1
      pos = i
    }
  }
  return pos
}

function findPrimeImplicants(minterms: number[]): PrimeImplicant[] {
  if (minterms.length === 0) return []

  let current = new Map<string, Set<number>>()
  for (const m of minterms) {
    const bin = mintermToBin(m)
    if (!current.has(bin)) current.set(bin, new Set())
    current.get(bin)!.add(m)
  }

  const primes: PrimeImplicant[] = []

  while (current.size > 0) {
    const used = new Set<string>()
    const next = new Map<string, Set<number>>()
    const groups: Record<number, { mask: string; minterms: Set<number> }[]> = {}

    for (const [mask, mints] of current) {
      const n = countOnes(mask)
      if (!groups[n]) groups[n] = []
      groups[n].push({ mask, minterms: mints })
    }

    const keys = Object.keys(groups).map(Number).sort((a, b) => a - b)

    for (let ki = 0; ki < keys.length - 1; ki++) {
      for (const i1 of groups[keys[ki]]) {
        for (const i2 of groups[keys[ki + 1]]) {
          const pos = singleDiff(i1.mask, i2.mask)
          if (pos !== -1) {
            const newMask = i1.mask.substring(0, pos) + "-" + i1.mask.substring(pos + 1)
            used.add(i1.mask)
            used.add(i2.mask)
            if (!next.has(newMask)) next.set(newMask, new Set())
            for (const m of i1.minterms) next.get(newMask)!.add(m)
            for (const m of i2.minterms) next.get(newMask)!.add(m)
          }
        }
      }
    }

    for (const [mask, mints] of current) {
      if (!used.has(mask)) primes.push({ mask, minterms: new Set(mints) })
    }

    current = next
  }

  const seen = new Set<string>()
  return primes.filter((p) => {
    if (seen.has(p.mask)) return false
    seen.add(p.mask)
    return true
  })
}

function findMinimalCover(primeImplicants: PrimeImplicant[], ones: number[]): PrimeImplicant[] {
  if (ones.length === 0) return []
  const onesSet = new Set(ones)
  const relevant = primeImplicants.filter((pi) => [...pi.minterms].some((m) => onesSet.has(m)))
  const selected: PrimeImplicant[] = []
  const uncovered = new Set(ones)

  let changed = true
  while (changed) {
    changed = false
    for (const m of uncovered) {
      const covering = relevant.filter((pi) => !selected.includes(pi) && pi.minterms.has(m))
      if (covering.length === 1) {
        selected.push(covering[0])
        for (const cm of covering[0].minterms) uncovered.delete(cm)
        changed = true
        break
      }
    }
  }

  while (uncovered.size > 0) {
    let best: PrimeImplicant | null = null
    let bestCount = 0
    for (const pi of relevant) {
      if (selected.includes(pi)) continue
      const cnt = [...pi.minterms].filter((m) => uncovered.has(m)).length
      if (cnt > bestCount) {
        bestCount = cnt
        best = pi
      }
    }
    if (!best) break
    selected.push(best)
    for (const cm of best.minterms) uncovered.delete(cm)
  }

  return selected
}

function implicantToTerm(mask: string): string {
  const parts: string[] = []
  for (let i = 0; i < 4; i++) {
    if (mask[i] === "1") parts.push(VARS[i])
    else if (mask[i] === "0") parts.push(VARS[i] + "'")
  }
  return parts.length === 0 ? "1" : parts.join("")
}

// Overlay helpers
function getSpan(indices: number[]): { start: number; count: number; wraps: boolean } {
  if (indices.length === 0) return { start: 0, count: 0, wraps: false }
  if (indices.length === 4) return { start: 0, count: 4, wraps: false }
  if (indices.length === 1) return { start: indices[0], count: 1, wraps: false }
  const min = indices[0]
  const max = indices[indices.length - 1]
  if (max - min + 1 === indices.length) return { start: min, count: indices.length, wraps: false }

  let maxGap = 0
  let gapAfter = -1
  for (let i = 0; i < indices.length; i++) {
    const gap = (indices[(i + 1) % indices.length] - indices[i] + 4) % 4
    if (gap > maxGap) {
      maxGap = gap
      gapAfter = i
    }
  }
  return { start: indices[(gapAfter + 1) % indices.length], count: indices.length, wraps: true }
}

function splitWrap(span: { start: number; count: number; wraps: boolean }): { start: number; count: number }[] {
  if (!span.wraps || span.count === 0) return [{ start: span.start, count: span.count }]
  const end = span.start + span.count
  if (end <= 4) return [{ start: span.start, count: span.count }]
  return [
    { start: span.start, count: 4 - span.start },
    { start: 0, count: span.count - (4 - span.start) },
  ]
}

function implicantToVisualRects(pi: PrimeImplicant): { row: number; col: number; numRows: number; numCols: number }[] {
  const minterms = [...pi.minterms]
  const rowSet = new Set<number>()
  const colSet = new Set<number>()
  for (const m of minterms) {
    const { row, col } = mintermToRowCol(m)
    rowSet.add(row)
    colSet.add(col)
  }

  const rows = [...rowSet].sort((a, b) => a - b)
  const cols = [...colSet].sort((a, b) => a - b)
  const rowParts = splitWrap(getSpan(rows))
  const colParts = splitWrap(getSpan(cols))

  const rects: { row: number; col: number; numRows: number; numCols: number }[] = []
  for (const rp of rowParts) {
    for (const cp of colParts) {
      rects.push({ row: rp.start, col: cp.start, numRows: rp.count, numCols: cp.count })
    }
  }
  return rects
}

export function KMap() {
  const [grid, setGrid] = useState<CellValue[][]>(() =>
    Array.from({ length: 4 }, () => Array(4).fill("0"))
  )

  const toggleCell = (row: number, col: number) => {
    setGrid((prev) => {
      const next = prev.map((r) => [...r])
      const cycle: Record<CellValue, CellValue> = { "0": "1", "1": "X", X: "0" }
      next[row][col] = cycle[next[row][col]]
      return next
    })
  }

  const clearAll = () => {
    setGrid(Array.from({ length: 4 }, () => Array(4).fill("0")))
  }

  const setAllOnes = () => {
    setGrid(Array.from({ length: 4 }, () => Array(4).fill("1")))
  }

  const randomize = () => {
    setGrid(
      Array.from({ length: 4 }, () =>
        Array.from({ length: 4 }, () => (Math.random() < 0.5 ? "1" : "0") as CellValue)
      )
    )
  }

  // Compute solution
  const { implicants, expression } = useMemo(() => {
    const ones: number[] = []
    const dontCares: number[] = []

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const m = mintermIndex(r, c)
        if (grid[r][c] === "1") ones.push(m)
        else if (grid[r][c] === "X") dontCares.push(m)
      }
    }

    if (ones.length === 0) {
      return { implicants: [], expression: "0" }
    }

    const allMinterms = [...ones, ...dontCares]
    const primes = findPrimeImplicants(allMinterms)
    const cover = findMinimalCover(primes, ones)
    const terms = cover.map((pi) => implicantToTerm(pi.mask))

    return {
      implicants: cover,
      expression: terms.join(" + ") || "0",
    }
  }, [grid])

  // Compute overlay rects
  const overlayRects = useMemo(() => {
    const rects: { row: number; col: number; numRows: number; numCols: number; colorIdx: number }[] = []
    implicants.forEach((pi, idx) => {
      const visualRects = implicantToVisualRects(pi)
      for (const rect of visualRects) {
        rects.push({ ...rect, colorIdx: idx })
      }
    })
    return rects
  }, [implicants])

  return (
    <div className="kmap-page">
      <h1>4-Variable Karnaugh Map</h1>

      <div className="kmap-wrapper">
        <div className="kmap-table">
          {/* Corner cell */}
          <div className="corner-cell">
            <svg viewBox="0 0 40 40" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="40" y2="40" stroke="#78716c" strokeWidth="1" />
            </svg>
            <span className="var-label var-cd">CD</span>
            <span className="var-label var-ab">AB</span>
          </div>

          {/* Column headers */}
          {GRAY.map((label, ci) => (
            <div
              key={`col-${ci}`}
              className="col-label"
              style={{ gridColumn: ci + 2, gridRow: 1 }}
            >
              {label}
            </div>
          ))}

          {/* Row labels */}
          {GRAY.map((label, ri) => (
            <div
              key={`row-${ri}`}
              className="row-label"
              style={{ gridColumn: 1, gridRow: ri + 2 }}
            >
              {label}
            </div>
          ))}

          {/* Grid border with cells and overlays */}
          <div className="grid-border">
            <div className="overlay-container">
              {overlayRects.map((rect, i) => {
                const color = GROUP_COLORS[rect.colorIdx % GROUP_COLORS.length]
                return (
                  <div
                    key={i}
                    className="group-overlay"
                    style={{
                      left: rect.col * CELL_SIZE,
                      top: rect.row * CELL_SIZE,
                      width: rect.numCols * CELL_SIZE,
                      height: rect.numRows * CELL_SIZE,
                      background: color.bg,
                      border: `2px solid ${color.border}`,
                    }}
                  />
                )
              })}
            </div>

            {Array.from({ length: 4 }, (_, r) =>
              Array.from({ length: 4 }, (_, c) => (
                <div
                  key={`cell-${r}-${c}`}
                  className="cell"
                  data-value={grid[r][c]}
                  onClick={() => toggleCell(r, c)}
                >
                  <span className="minterm">{mintermIndex(r, c)}</span>
                  <span className="value">{grid[r][c]}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bottom-section">
        <div className="expression-bar">
          <span className="label">F = </span>
          {expression}
        </div>

        <div className="group-legend-container">
          <div className="group-legend-items">
            {implicants.map((pi, idx) => {
              const color = GROUP_COLORS[idx % GROUP_COLORS.length]
              return (
                <div key={idx} className="group-legend-item">
                  <div className="group-legend-swatch" style={{ background: color.solid }} />
                  <span>{implicantToTerm(pi.mask)}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="controls">
          <button className="btn" onClick={clearAll}>Clear</button>
          <button className="btn" onClick={setAllOnes}>All 1</button>
          <button className="btn" onClick={randomize}>Random</button>
        </div>

        <div className="legend">
          <div className="legend-item">
            <div className="legend-swatch swatch-0" />0
          </div>
          <div className="legend-item">
            <div className="legend-swatch swatch-1" />1
          </div>
          <div className="legend-item">
            <div className="legend-swatch swatch-x" />X
          </div>
          <span style={{ marginLeft: 4 }}>click to cycle</span>
        </div>
      </div>
    </div>
  )
}
