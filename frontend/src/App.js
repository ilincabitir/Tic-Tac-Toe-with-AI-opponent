import React, { useState } from 'react';
import './App.css';
import xImg from './assets/x.png';
import normalOImg from './assets/normal_o.png';
import winningOImg from './assets/O.png';

function App() {
  const [grid, setGrid] = useState([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
  const [msg, setMsg] = useState("Your turn! (X)");

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
    if (grid[r][col] !== 0 || msg.includes("won") || msg.includes("Draw")) return;

    const nextGrid = grid.map(row => [...row]);
    nextGrid[r][col] = 1;
    setGrid(nextGrid);
    setMsg("AI is thinking...");

    try {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board: nextGrid })
      });
      const data = await res.json();
      await delay(800);
      setMsg(data.status);

      if (data.row !== undefined) {
        const finalGrid = nextGrid.map(row => [...row]);
        finalGrid[data.row][data.col] = -1;
        setGrid(finalGrid);
      }

      if (data.status.includes("won") || data.status.includes("Draw")) {
        setTimeout(() => {
          setGrid([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
          setMsg("New Game! Your turn (X)");
        }, 4000);
      }
    } catch (e) {
    }
  };

  return (
    <div className="container">
      <h1 className="title">Play Tic-Tac-Toe with AI</h1>

      <div className="board-container">
        {grid.map((row, rIdx) => (
          <div key={rIdx} className="board-row">
            {row.map((cell, cIdx) => {
              const isWinningSquare = winningLine?.some(([wr, wc]) => wr === rIdx && wc === cIdx);
              return (
                <div key={cIdx} onClick={() => playMove(rIdx, cIdx)} className="board-cell">
                  {cell === 1 && <img src={xImg} alt="X" className="drawn-icon" />}
                  {cell === -1 && (
                    <img 
                      src={isWinningSquare ? winningOImg : normalOImg} 
                      alt="O" 
                      className="drawn-icon" 
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="text-bottom">
        <h2 className={msg.includes("won") ? "status-msg win" : "status-msg default"}>
          {msg}
        </h2>
      </div>
    </div>
  );
}

export default App;