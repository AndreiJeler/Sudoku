import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SudokuState } from './sudoku.state';

export const selectBoardState = createFeatureSelector<SudokuState>('sudoku');

export const selectCurrentDifficulty = createSelector(
  selectBoardState,
  (state) => state.currentDifficulty
);

export const selectCurrentBoard = createSelector(
  selectBoardState,
  (state) => state.currentBoard
);

export const selectInitialBoard = createSelector(
  selectBoardState,
  (state) => state.initialBoard
);
