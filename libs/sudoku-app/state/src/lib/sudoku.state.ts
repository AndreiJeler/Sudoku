import { Board, BoardDifficulty } from '@sudoku/shared';

export interface SudokuState {
  initialBoard: Board;
  currentBoard: Board;
  currentDifficulty: BoardDifficulty;
}
