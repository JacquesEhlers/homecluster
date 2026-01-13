import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

type Cell = 0 | 1;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function makeGrid(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0 as Cell));
}

function countNeighbors(grid: Cell[][], r: number, c: number): number {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const rr = r + dr;
      const cc = c + dc;
      if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) {
        count += grid[rr][cc];
      }
    }
  }
  return count;
}

function nextGeneration(grid: Cell[][]): Cell[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const out = makeGrid(rows, cols);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const n = countNeighbors(grid, r, c);
      const alive = grid[r][c] === 1;

      // Conway rules
      if (alive) {
        out[r][c] = (n === 2 || n === 3) ? 1 : 0;
      } else {
        out[r][c] = (n === 3) ? 1 : 0;
      }
    }
  }
  return out;
}

function randomizeGrid(grid: Cell[][], density = 0.25): Cell[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const out = makeGrid(rows, cols);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out[r][c] = (Math.random() < density ? 1 : 0) as Cell;
    }
  }
  return out;
}

export default function App() {
  // Grid sizing: chosen to be reasonable on a laptop screen
  const rows = 50;
  const cols = 80;

  const [grid, setGrid] = useState<Cell[][]>(() => makeGrid(rows, cols));
  const [running, setRunning] = useState(false);
  const [intervalMs, setIntervalMs] = useState(200); // speed control

  // Interaction state (paint while dragging)
  const isPointerDownRef = useRef(false);
  const paintValueRef = useRef<Cell>(1);
  const lastPaintedRef = useRef<string>("");

  // Keep latest grid for timer tick without stale closures
  const gridRef = useRef(grid);
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  // Timer loop
  useEffect(() => {
    if (!running) return;

    const id = window.setInterval(() => {
      setGrid((g) => nextGeneration(g));
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [running, intervalMs]);

  // Derived stats
  const aliveCount = useMemo(() => {
    let count = 0;
    for (const row of grid) for (const cell of row) count += cell;
    return count;
  }, [grid]);

  function toggleCell(r: number, c: number, value?: Cell) {
    setGrid((prev) => {
      const next = prev.map((row) => row.slice()) as Cell[][];
      next[r][c] = (value ?? (prev[r][c] === 1 ? 0 : 1)) as Cell;
      return next;
    });
  }

  function handlePointerDown(r: number, c: number) {
    isPointerDownRef.current = true;
    // Decide if we are painting alive or erasing, based on initial cell
    paintValueRef.current = gridRef.current[r][c] === 1 ? 0 : 1;
    lastPaintedRef.current = `${r},${c}`;
    toggleCell(r, c, paintValueRef.current);
  }

  function handlePointerEnter(r: number, c: number) {
    if (!isPointerDownRef.current) return;
    const key = `${r},${c}`;
    if (lastPaintedRef.current === key) return;
    lastPaintedRef.current = key;
    toggleCell(r, c, paintValueRef.current);
  }

  function stopPainting() {
    isPointerDownRef.current = false;
    lastPaintedRef.current = "";
  }

  // Global pointer up so dragging off-grid still stops painting
  useEffect(() => {
    window.addEventListener("pointerup", stopPainting);
    window.addEventListener("pointercancel", stopPainting);
    return () => {
      window.removeEventListener("pointerup", stopPainting);
      window.removeEventListener("pointercancel", stopPainting);
    };
  }, []);

  function faster() {
    setIntervalMs((ms) => clamp(Math.round(ms * 0.8), 20, 2000));
  }
  function slower() {
    setIntervalMs((ms) => clamp(Math.round(ms * 1.25), 20, 2000));
  }

  function stepOnce() {
    setGrid((g) => nextGeneration(g));
  }

  function clear() {
    setRunning(false);
    setGrid(makeGrid(rows, cols));
  }

  function random() {
    setGrid((g) => randomizeGrid(g, 0.25));
  }

  // Nice presets (optional)
  function seedGlider() {
    const g = makeGrid(rows, cols);
    const r = 2, c = 2;
    // glider
    g[r][c + 1] = 1;
    g[r + 1][c + 2] = 1;
    g[r + 2][c] = 1;
    g[r + 2][c + 1] = 1;
    g[r + 2][c + 2] = 1;
    setGrid(g);
  }

  return (
    <div className="app">
      <header className="header">
        <div className="title">
          <h1>Conway’s Game of Life</h1>
          <p>
            Click / drag to paint cells (works while running). Alive: <b>{aliveCount}</b> · Speed:{" "}
            <b>{intervalMs}ms</b>
          </p>
        </div>

        <div className="controls">
          <button
            className={running ? "btn primary" : "btn"}
            onClick={() => setRunning(true)}
            disabled={running}
          >
            Start
          </button>
          <button
            className={!running ? "btn primary" : "btn"}
            onClick={() => setRunning(false)}
            disabled={!running}
          >
            Stop
          </button>
          <button className="btn" onClick={faster}>Faster</button>
          <button className="btn" onClick={slower}>Slower</button>

          <div className="divider" />

          <button className="btn" onClick={stepOnce} disabled={running}>
            Step
          </button>
          <button className="btn" onClick={random}>
            Random
          </button>
          <button className="btn" onClick={seedGlider}>
            Glider
          </button>
          <button className="btn danger" onClick={clear}>
            Clear
          </button>
        </div>
      </header>

      <main className="main">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 12px)` }}>
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={cell === 1 ? "cell alive" : "cell"}
                onPointerDown={() => handlePointerDown(r, c)}
                onPointerEnter={() => handlePointerEnter(r, c)}
                role="button"
                aria-label={`cell ${r},${c}`}
              />
            ))
          )}
        </div>
      </main>

      <footer className="footer">
        Tip: Hold and drag to paint. Start/Stop doesn’t block editing.
      </footer>
    </div>
  );
}
