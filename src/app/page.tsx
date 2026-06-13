'use client';

import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

const GRID_SIZE = 14;
const MOVE_LIMIT = 25;

const COLORS = [
  { name: 'red', value: '#ef4444' },
  { name: 'orange', value: '#f97316' },
  { name: 'yellow', value: '#eab308' },
  { name: 'green', value: '#22c55e' },
  { name: 'blue', value: '#3b82f6' },
  { name: 'purple', value: '#a855f7' },
];

type Board = number[][];

function createBoard(): Board {
  const board: Board = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const row: number[] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      row.push(Math.floor(Math.random() * COLORS.length));
    }
    board.push(row);
  }
  return board;
}

function floodFill(board: Board, target: number): Board {
  const start = board[0][0];
  if (start === target) return board;

  const next = board.map((row) => [...row]);
  const stack: [number, number][] = [[0, 0]];
  const seen = new Set<string>();

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    const key = `${r},${c}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (next[r][c] !== start) continue;

    next[r][c] = target;

    const neighbors: [number, number][] = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ];
    for (const [nr, nc] of neighbors) {
      if (
        nr >= 0 &&
        nr < GRID_SIZE &&
        nc >= 0 &&
        nc < GRID_SIZE &&
        !seen.has(`${nr},${nc}`)
      ) {
        stack.push([nr, nc]);
      }
    }
  }

  return next;
}

function isSolved(board: Board): boolean {
  const first = board[0][0];
  return board.every((row) => row.every((cell) => cell === first));
}

export default function Home() {
  const [board, setBoard] = useState<Board>(() => createBoard());
  const [moves, setMoves] = useState(0);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const reset = useCallback(() => {
    setBoard(createBoard());
    setMoves(0);
  }, []);

  const won = useMemo(() => board.length > 0 && isSolved(board), [board]);
  const lost = useMemo(() => !won && moves >= MOVE_LIMIT, [won, moves]);
  const gameOver = won || lost;

  const handlePick = (colorIndex: number) => {
    if (gameOver || board.length === 0) return;
    if (board[0][0] === colorIndex) return;
    setBoard((prev) => floodFill(prev, colorIndex));
    setMoves((m) => m + 1);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 py-8 text-slate-100">
      <div className="w-full max-w-md">
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">Flood It</h1>
          <p className="mt-2 text-sm text-slate-400">
            Flood the whole board with a single color before you run out of moves.
          </p>
        </header>

        <div className="mb-4 flex items-center justify-between rounded-lg bg-slate-800 px-4 py-3 shadow">
          <div className="text-sm">
            <span className="text-slate-400">Moves</span>{' '}
            <span className="font-semibold text-white">
              {moves} / {MOVE_LIMIT}
            </span>
          </div>
          <button
            onClick={reset}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            Reset
          </button>
        </div>

        <div
          className="grid aspect-square gap-0.5 overflow-hidden rounded-lg bg-slate-800 p-1 shadow-lg"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
        >
          {mounted &&
            board.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  className="aspect-square w-full rounded-sm"
                  style={{ backgroundColor: COLORS[cell].value }}
                />
              ))
            )}
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {COLORS.map((color, i) => (
            <button
              key={color.name}
              onClick={() => handlePick(i)}
              disabled={gameOver}
              aria-label={`Pick ${color.name}`}
              className="h-11 w-11 rounded-full border-2 border-slate-700 transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>

        {gameOver && (
          <div className="mt-6 text-center">
            {won ? (
              <p className="text-lg font-semibold text-green-400">
                You won in {moves} {moves === 1 ? 'move' : 'moves'}!
              </p>
            ) : (
              <p className="text-lg font-semibold text-red-400">
                Out of moves! Try again.
              </p>
            )}
            <button
              onClick={reset}
              className="mt-3 rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              Play Again
            </button>
          </div>
        )}

        <section className="mt-8 rounded-lg bg-slate-800 p-4 text-sm text-slate-300">
          <h2 className="mb-2 font-semibold text-white">How to Play</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>The flood region starts at the top-left cell.</li>
            <li>Pick a color to flood your region into all touching cells of that color.</li>
            <li>Grow the region until the entire board is one color.</li>
            <li>You have {MOVE_LIMIT} moves. Use them wisely!</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
