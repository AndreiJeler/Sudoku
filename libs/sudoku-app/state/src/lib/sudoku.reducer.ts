import { createReducer, on } from '@ngrx/store';
import { SudokuState } from './sudoku.state';
import {
  cellValueChanged,
  successfullyGeneratedNewBoard,
} from './sudoku.actions';
import { createEmptyBoard } from '@sudoku/shared';

export const initialState: SudokuState = {
  initialBoard: createEmptyBoard(),
  currentBoard: createEmptyBoard(),
  currentDifficulty: 'random',
};

export const sudokuReducer = createReducer(
  initialState,
  on(successfullyGeneratedNewBoard, (state, { difficulty, board }) => ({
    ...state,
    initialBoard: { ...board },
    currentBoard: board,
    currentDifficulty: difficulty,
  })),
  on(cellValueChanged, (state, { row, col, value }) => ({
    ...state,
    currentBoard: {
      ...state.currentBoard,
      cells: state.currentBoard.cells.map((rowCells, rowIndex) => {
        if (rowIndex === row) {
          return rowCells.map((cell, colIndex) => {
            if (colIndex === col) {
              return { ...cell, value: value };
            }
            return { ...cell };
          });
        }

        return [...rowCells];
      }),
    },
  }))
);
