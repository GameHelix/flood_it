# Flood It

A color-flooding puzzle game built with Next.js and TypeScript. Fill the entire board with a single color before you run out of moves.

## How to Play

- The flood region starts at the top-left cell of a 14x14 grid.
- Each turn, pick one of the six colors. Your region flood-fills to that color, absorbing all adjacent cells that match.
- Keep growing the region until the whole board is a single color.
- You have 25 moves. Solve the board before they run out to win.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://react.dev/)

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to play.

## Build

```bash
npm run build
npm run start
```
