import { BoardApi } from './../models/board-api';
import { Board, BoardCell } from '@sudoku/shared';
import { SUDOKU_SIZE } from './constants';

export function mapBoardToApiEntity(board: Board): BoardApi {
  return { board: board.cells.map((rows) => rows.map((cell) => cell.value)) };
}

export function mapApiEntityToBoard(board: BoardApi): Board {
  return {
    cells: board.board.map((row) =>
      row.map((cell) => {
        return { value: cell, isSelected: false, isGenerated: cell != 0 };
      })
    ),
  };
}

export function createEmptyBoard(): Board {
  const emptyCell: BoardCell = {
    value: 0,
    isGenerated: false,
    isSelected: false,
  };

  const cells: BoardCell[][] = Array.from({ length: SUDOKU_SIZE }, () =>
    Array.from({ length: SUDOKU_SIZE }, () => ({ ...emptyCell }))
  );

  return {
    cells: cells,
  };
}
