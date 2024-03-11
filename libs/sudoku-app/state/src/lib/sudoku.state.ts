import { Board, BoardDifficulty, BoardStatus } from '@sudoku/shared';

export interface SudokuState {
  initialBoard: Board;
  currentBoard: Board;
  currentDifficulty: BoardDifficulty;
  roomId: string | null;
  boardStatus: BoardStatus | null;
}
