import React from 'react';
import { NUMBER_COLORS } from '../utils/constants';

const Cell = ({ cell, onClick, onRightClick }) => {
  const getCellContent = () => {
    if (cell.isFlagged) {
      return '🚩';
    }
    
    if (!cell.isRevealed) {
      return '';
    }
    
    if (cell.isMine) {
      return '💣';
    }
    
    if (cell.adjacentMines > 0) {
      return cell.adjacentMines;
    }
    
    return '';
  };

  const getCellStyle = () => {
    const baseStyle = {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'all 0.05s',
    };

    if (!cell.isRevealed) {
      return {
        ...baseStyle,
        backgroundColor: '#c0c0c0',
        border: '3px outset #f0f0f0',
        boxSizing: 'border-box',
      };
    }

    // For revealed cells
    const style = {
      ...baseStyle,
      backgroundColor: '#e0e0e0',
      border: '1px solid #bbb',
      boxSizing: 'border-box',
    };

    // For empty cells (no adjacent mines)
    if (cell.isRevealed && cell.adjacentMines === 0 && !cell.isMine) {
      style.backgroundColor = '#d7d7d7';
    }

    // For numbers, apply the color from NUMBER_COLORS
    if (cell.adjacentMines > 0) {
      style.color = NUMBER_COLORS[cell.adjacentMines];
    }

    // For mines
    if (cell.isMine) {
      style.backgroundColor = 'red';
    }

    return style;
  };

  return (
    <div
      style={getCellStyle()}
      onClick={onClick}
      onContextMenu={onRightClick}
      className={`cell ${!cell.isRevealed ? 'cell-unrevealed' : 'cell-revealed'} ${cell.isFlagged ? 'cell-flagged' : ''} ${cell.isMine && cell.isRevealed ? 'cell-mine' : ''} ${cell.isRevealed && cell.adjacentMines === 0 && !cell.isMine ? 'cell-empty' : ''}`}
    >
      {getCellContent()}
    </div>
  );
};

export default Cell;

