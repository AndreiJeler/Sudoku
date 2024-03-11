import { createAction, props } from '@ngrx/store';
import {
  Board,
  BoardDifficulty,
  SolveResponse,
  BoardStatus,
} from '@sudoku/shared';

export const generateNewBoard = createAction(
  '[Sudoku] Generate new board',
  props<{ difficulty: BoardDifficulty }>()
);

export const cellValueChanged = createAction(
  '[Sudoku] Cell values has changed',
  props<{ row: number; col: number; value: number }>()
);

export const successfullyGeneratedNewBoard = createAction(
  '[Sudoku] Successfully generated a new board',
  props<{ difficulty: BoardDifficulty; board: Board }>()
);

export const validateBoard = createAction(
  '[Sudoku] Validated board',
  props<{ board: Board }>()
);

export const successfullyValidatedBoard = createAction(
  '[Sudoku] Successfully validated the board',
  props<{ boardStatus: BoardStatus }>()
);

export const solveBoard = createAction(
  '[Sudoku] Solve board',
  props<{ difficulty: BoardDifficulty }>()
);

export const successfullySolvedBoard = createAction(
  '[Sudoku] Successfully solved the board',
  props<{ solveResponse: SolveResponse }>()
);