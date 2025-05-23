// Create a new cell object
export const createCell = () => ({
  isMine: false,
  isRevealed: false,
  isFlagged: false,
  adjacentMines: 0,
});

// Create a new board with the specified dimensions
export const createBoard = (rows, cols) => {
  return Array(rows)
    .fill()
    .map(() => Array(cols).fill().map(() => createCell()));
};

// Check if coordinates are valid (within the board boundaries)
export const isValidCell = (board, row, col) => {
  return row >= 0 && row < board.length && col >= 0 && col < board[0].length;
};

// Place mines randomly on the board, but avoid the firstClickRow and firstClickCol
export const placeMines = (board, numMines, safeRow = -1, safeCol = -1) => {
  const rows = board.length;
  const cols = board[0].length;
  let minesPlaced = 0;
  
  // Create a safety zone around the first click
  const safeZone = [];
  if (safeRow >= 0 && safeCol >= 0) {
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let colOffset = -1; colOffset <= 1; colOffset++) {
        const r = safeRow + rowOffset;
        const c = safeCol + colOffset;
        if (isValidCell(board, r, c)) {
          safeZone.push({ row: r, col: c });
        }
      }
    }
  }

  while (minesPlaced < numMines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    
    // Skip if this position is in the safe zone
    const isInSafeZone = safeZone.some(pos => pos.row === row && pos.col === col);
    
    if (!board[row][col].isMine && !isInSafeZone) {
      board[row][col].isMine = true;
      minesPlaced++;
    }
  }

  return board;
};

// Calculate adjacent mines for all cells
export const calculateAdjacentMines = (board) => {
  const rows = board.length;
  const cols = board[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!board[row][col].isMine) {
        let count = 0;
        
        // Check all 8 adjacent cells
        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
          for (let colOffset = -1; colOffset <= 1; colOffset++) {
            if (rowOffset === 0 && colOffset === 0) continue;
            
            const adjRow = row + rowOffset;
            const adjCol = col + colOffset;
            
            if (isValidCell(board, adjRow, adjCol) && board[adjRow][adjCol].isMine) {
              count++;
            }
          }
        }
        
        board[row][col].adjacentMines = count;
      }
    }
  }

  return board;
};

// Initialize a new game board with mines placed and adjacent mines calculated
export const initializeGame = (rows, cols, numMines) => {
  let board = createBoard(rows, cols);
  board = placeMines(board, numMines);
  board = calculateAdjacentMines(board);
  return board;
};

// Keep track of whether this is the first click of the game
let isFirstClick = true;

// Reveal cell and iteratively reveal adjacent empty cells
export const revealCell = (board, row, col) => {
  // Clone the board to maintain immutability
  const newBoard = JSON.parse(JSON.stringify(board));
  
  // Skip if out of bounds, already revealed, or flagged
  if (!isValidCell(newBoard, row, col) || 
      newBoard[row][col].isRevealed || 
      newBoard[row][col].isFlagged) {
    return { board: newBoard, gameOver: false, gameWon: false };
  }
  
  // If it's the first click and it's a mine, reposition the mine
  if (isFirstClick) {
    isFirstClick = false;
    
    // If first click is on a mine, regenerate the board
    if (newBoard[row][col].isMine) {
      // Create a fresh board
      const freshBoard = createBoard(newBoard.length, newBoard[0].length);
      
      // Count total mines
      let totalMines = 0;
      for (let r = 0; r < newBoard.length; r++) {
        for (let c = 0; c < newBoard[0].length; c++) {
          if (newBoard[r][c].isMine) {
            totalMines++;
          }
        }
      }
      
      // Place mines while keeping the clicked cell and its surroundings safe
      const safeBoard = placeMines(freshBoard, totalMines, row, col);
      const finalBoard = calculateAdjacentMines(safeBoard);
      
      // Reveal the clicked cell
      finalBoard[row][col].isRevealed = true;
      
      // If it's an empty cell, handle the flood fill
      if (finalBoard[row][col].adjacentMines === 0) {
        const revealResult = revealEmptyCells(finalBoard, row, col);
        return {
          board: revealResult,
          gameOver: false,
          gameWon: checkWinCondition(revealResult)
        };
      }
      
      return {
        board: finalBoard,
        gameOver: false,
        gameWon: checkWinCondition(finalBoard)
      };
    }
  } else {
    // Regular click (not first click)
    // Reveal the cell
    newBoard[row][col].isRevealed = true;
    
    // Check if it's a mine
    if (newBoard[row][col].isMine) {
      return { board: newBoard, gameOver: true, gameWon: false };
    }
  }
  
  // Reveal the cell
  newBoard[row][col].isRevealed = true;
  
  // If it's an empty cell (no adjacent mines), reveal adjacent cells
  if (newBoard[row][col].adjacentMines === 0) {
    const revealResult = revealEmptyCells(newBoard, row, col);
    return {
      board: revealResult,
      gameOver: false,
      gameWon: checkWinCondition(revealResult)
    };
  }
  
  // Check if the game is won
  const gameWon = checkWinCondition(newBoard);
  
  return {
    board: newBoard,
    gameOver: false,
    gameWon,
  };
};

// Iterative flood fill algorithm to reveal empty cells
export const revealEmptyCells = (board, startRow, startCol) => {
  const newBoard = JSON.parse(JSON.stringify(board));
  const stack = [{ row: startRow, col: startCol }];
  const visited = new Set(); // To keep track of visited cells
  
  while (stack.length > 0) {
    const { row, col } = stack.pop();
    const cellKey = `${row},${col}`;
    
    // Skip if already visited
    if (visited.has(cellKey)) continue;
    
    // Mark as visited
    visited.add(cellKey);
    
    // Skip if out of bounds
    if (!isValidCell(newBoard, row, col)) continue;
    
    // Skip flagged cells
    if (newBoard[row][col].isFlagged) continue;
    
    // Reveal the cell
    newBoard[row][col].isRevealed = true;
    
    // If it's an empty cell, add all adjacent cells to the stack
    if (newBoard[row][col].adjacentMines === 0) {
      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
          if (rowOffset === 0 && colOffset === 0) continue;
          
          const adjRow = row + rowOffset;
          const adjCol = col + colOffset;
          
          if (isValidCell(newBoard, adjRow, adjCol) && !newBoard[adjRow][adjCol].isRevealed) {
            stack.push({ row: adjRow, col: adjCol });
          }
        }
      }
    }
  }
  
  return newBoard;
};

// Toggle flag on a cell
export const toggleFlag = (board, row, col) => {
  // Clone the board to maintain immutability
  const newBoard = JSON.parse(JSON.stringify(board));
  
  if (!isValidCell(newBoard, row, col) || newBoard[row][col].isRevealed) {
    return newBoard;
  }

  newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
  return newBoard;
};

// Check if all non-mine cells have been revealed (win condition)
export const checkWinCondition = (board) => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      if (!board[row][col].isMine && !board[row][col].isRevealed) {
        return false; // Found an unrevealed non-mine cell
      }
    }
  }
  return true; // All non-mines are revealed
};

// Reveal all mines on the board (used when game is over)
export const revealAllMines = (board, gameWon = false) => {
  const newBoard = JSON.parse(JSON.stringify(board));
  
  for (let row = 0; row < newBoard.length; row++) {
    for (let col = 0; col < newBoard[0].length; col++) {
      const cell = newBoard[row][col];
      
      if (cell.isMine) {
        // Reveal all mines when game is lost
        cell.isRevealed = true;
      } else if (gameWon && !cell.isRevealed) {
        // Reveal remaining cells when game is won
        cell.isRevealed = true;
      }
    }
  }
  
  return newBoard;
};

// Reset first click state - should be called when starting a new game
export const resetFirstClick = () => {
  isFirstClick = true;
};

