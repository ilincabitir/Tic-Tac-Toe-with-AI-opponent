import React, { useState } from 'react';
import './App.css';
import xImg from './assets/x.png';
import normalOImg from './assets/normal_o.png';
import winningOImg from './assets/O.png';

function App() {
  const [grid, setGrid] = useState([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
  const [msg, setMsg] = useState("Your turn! (X)");

  const RENDER_URL = "https://tic-tac-toe-with-ai-opponent.onrender.com/ai-move";
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const getWinningLine = (board) => {
    const lines = [
      [[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]], [[2, 0], [2, 1], [2, 2]],
      [[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]],
      [[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]]
    ];
    for (let line of lines) {
      if (line.every(([r, c]) => board[r][c] === -1)) return line;
    }
    return null;
  };

  const winningLine = getWinningLine(grid);

  const playMove = async (r, col) => {
    if (grid[r][col] !== 0 || msg.includes("won") || msg.includes("Draw") || msg === "AI is thinking...") return;

    const nextGrid = grid.map(row => [...row]);
    nextGrid[r][col] = 1;
    setGrid(nextGrid);
    setMsg("AI is thinking...");

    try {
      const res = await fetch(RENDER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board: nextGrid })
      });
      
      const data = await res.json();
      await delay(500);

      const finalGrid = nextGrid.map(row => [...row]);
      if (data.row !== undefined) {
        finalGrid[data.row][data.col] = -1;
      }
      setGrid(finalGrid);
      setMsg(data.status);

      if (data.status.includes("won") || data.status.includes("Draw")) {
        setTimeout(() => {
          setGrid([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
          setMsg("New Game! Your turn (X)");
        }, 4000);
      }
    } catch (e) {
      setMsg("AI is waking up... Please wait 30s and try again.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Tic-Tac-Toe vs AI</h1>
      <div className="board-container">
        {grid.map((row, rIdx) => (
          <div key={rIdx} className="board-row">
            {row.map((cell, cIdx) => {
              const isWin = winningLine?.some(([wr, wc]) => wr === rIdx && wc === cIdx);
              return (
                <div key={cIdx} onClick={() => playMove(rIdx, cIdx)} className="board-cell">
                  {cell === 1 && <img src={xImg} alt="X" className="drawn-icon" />}
                  {cell === -1 && <img src={isWin ? winningOImg : normalOImg} alt="O" className="drawn-icon" />}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="text-bottom">
        <h2 className={msg.includes("won") ? "status-msg win" : "status-msg default"}>{msg}</h2>
      </div>
    </div>
  );
}

export default App;