import React from 'react';
import Cell from './Cell';
import { CELL_SIZE } from '../utils/constants';

const Board = ({ board, onCellClick, onCellRightClick }) => {
  return (
    <div
      className="board"
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${board.length}, ${CELL_SIZE}px)`,
        gridTemplateColumns: `repeat(${board[0].length}, ${CELL_SIZE}px)`,
        gap: '1px',
        border: '2px solid #888',
        backgroundColor: '#bbb',
        margin: '20px auto',
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            onClick={() => onCellClick(rowIndex, colIndex)}
            onRightClick={(e) => {
              e.preventDefault();
              onCellRightClick(rowIndex, colIndex);
            }}
          />
        ))
      )}
    </div>
  );
};

export default Board;

