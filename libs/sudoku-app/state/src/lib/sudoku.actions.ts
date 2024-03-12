import { createAction, props } from '@ngrx/store';
import {
  Board,
  BoardDifficulty,
  SolveResponse,
  BoardStatus,
  SudokuRoom,
} from '@sudoku/shared';

export const generateNewBoard = createAction(
  '[Sudoku] Generate new board',
  props<{ difficulty: BoardDifficulty }>()
);
export const successfullyGeneratedNewBoard = createAction(
  '[Sudoku] Successfully generated a new board',
  props<{ difficulty: BoardDifficulty; board: Board }>()
);

export const solveBoard = createAction('[Sudoku] Solve board');
export const successfullySolvedBoard = createAction(
  '[Sudoku] Successfully solved the board',
  props<{ solveResponse: SolveResponse }>()
);

export const validateBoard = createAction('[Sudoku] Validated board');
export const successfullyValidatedBoard = createAction(
  '[Sudoku] Successfully validated the board',
  props<{ boardStatus: BoardStatus }>()
);

export const cellValueChanged = createAction(
  '[Sudoku] Cell values has changed',
  props<{ row: number; col: number; value: number }>()
);

export const createRoom = createAction('[Sudoku] Create room');
export const successfullyCreatedRoom = createAction(
  '[Sudoku] Successfully created room',
  props<{ roomId: string }>()
);

export const joinRoom = createAction(
  '[Sudoku] Join room',
  props<{ roomId: string; board: Board }>()
);
