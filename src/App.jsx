import { useState } from 'react'
import './App.css'
import Board from './components/Board'
import Timer from './components/Timer'
import useGameState from './hooks/useGameState'
import { LEVELS } from './utils/constants'

function App() {
  const {
    board,
    gameOver,
    gameWon,
    level,
    flagCount,
    mineCount,
    gameStarted,
    timerReset,
    handleCellClick,
    handleCellRightClick,
    startNewGame,
  } = useGameState('beginner');

  const getRemainingMines = () => {
    return mineCount - flagCount;
  };

  return (
    <div className="App">
      <h1>Minesweeper</h1>
      
      <div className="game-controls" style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto 20px',
        padding: '10px',
        backgroundColor: '#d1d1d1',
        borderRadius: '5px',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
      }}>
        <div className="difficulty-selector">
          <span>Difficulty: </span>
          <select 
            value={level} 
            onChange={(e) => startNewGame(e.target.value)}
            style={{ padding: '5px', marginLeft: '5px' }}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>
        
        <div className="mine-counter" style={{ 
          fontSize: '18px', 
          fontWeight: 'bold',
          padding: '5px 10px',
          backgroundColor: '#000',
          color: '#f00',
          borderRadius: '3px',
          fontFamily: 'monospace'
        }}>
          {getRemainingMines().toString().padStart(3, '0')}
        </div>
        
        <Timer running={gameStarted} onReset={timerReset} />
        
        <button 
          onClick={() => startNewGame(level)}
          style={{
            padding: '8px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
        >
          Restart
        </button>
      </div>
      
      {(gameOver || gameWon) && (
        <div className="game-status" style={{
          padding: '10px',
          margin: '10px auto',
          backgroundColor: gameWon ? '#4CAF50' : '#f44336',
          color: 'white',
          borderRadius: '5px',
          width: 'fit-content',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        }}>
          {gameWon ? 'Congratulations! You won!' : 'Game Over! You hit a mine!'}
        </div>
      )}
      
      <Board 
        board={board} 
        onCellClick={handleCellClick} 
        onCellRightClick={handleCellRightClick} 
      />
      
      <div className="instructions" style={{
        margin: '20px auto',
        maxWidth: '600px',
        textAlign: 'left',
        padding: '15px',
        backgroundColor: '#f8f8f8',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      }}>
        <h3 style={{ marginTop: 0 }}>How to Play:</h3>
        <ul>
          <li>Left-click to reveal a cell</li>
          <li>Right-click to flag a suspected mine</li>
          <li>Win by revealing all cells that don't contain mines</li>
        </ul>
      </div>
    </div>
  );
}

export default App
