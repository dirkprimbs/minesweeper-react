import { useState, useCallback, useRef } from 'react';
import { 
  initializeGame, 
  revealCell, 
  toggleFlag, 
  revealAllMines,
  resetFirstClick
} from '../utils/gameLogic';
import { LEVELS } from '../utils/constants';

const useGameState = (initialLevelName = 'beginner') => {
  const [level, setLevel] = useState(initialLevelName);
  const [board, setBoard] = useState(() => {
    const { rows, cols, mines } = LEVELS[initialLevelName];
    return initializeGame(rows, cols, mines);
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [flagCount, setFlagCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timerReset, setTimerReset] = useState(false);

  // Start a new game with the specified level
  const startNewGame = useCallback((levelName = level) => {
    const { rows, cols, mines } = LEVELS[levelName];
    setBoard(initializeGame(rows, cols, mines));
    setGameOver(false);
    setGameWon(false);
    setFlagCount(0);
    setLevel(levelName);
    setGameStarted(false);
    resetFirstClick();
    setTimerReset(prev => !prev); // Toggle to trigger timer reset
  }, [level]);

  // Handle cell left-click (reveal)
  const handleCellClick = useCallback((row, col) => {
    if (gameOver || gameWon) {
      return;
    }

    // Start the timer on first click
    if (!gameStarted) {
      setGameStarted(true);
    }

    const result = revealCell(board, row, col);
    setBoard(result.board);

    if (result.gameOver) {
      setGameOver(true);
      setBoard(revealAllMines(result.board));
      setGameStarted(false);
    } else if (result.gameWon) {
      setGameWon(true);
      setBoard(revealAllMines(result.board, true));
      setGameStarted(false);
    }
  }, [board, gameOver, gameWon, gameStarted]);

  // Handle cell right-click (flag)
  const handleCellRightClick = useCallback((row, col) => {
    if (gameOver || gameWon) {
      return;
    }

    // Start the timer on first flag
    if (!gameStarted) {
      setGameStarted(true);
    }

    const newBoard = toggleFlag(board, row, col);
    
    // Count flags after toggling
    let newFlagCount = 0;
    for (let r = 0; r < newBoard.length; r++) {
      for (let c = 0; c < newBoard[0].length; c++) {
        if (newBoard[r][c].isFlagged) {
          newFlagCount++;
        }
      }
    }
    
    setFlagCount(newFlagCount);
    setBoard(newBoard);
  }, [board, gameOver, gameWon, gameStarted]);

  return {
    board,
    gameOver,
    gameWon,
    level,
    flagCount,
    mineCount: LEVELS[level].mines,
    gameStarted,
    timerReset,
    handleCellClick,
    handleCellRightClick,
    startNewGame,
    setLevel,
  };
};

export default useGameState;

