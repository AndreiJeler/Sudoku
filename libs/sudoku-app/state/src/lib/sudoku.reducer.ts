import { createReducer, on } from '@ngrx/store';
import { SudokuState } from './sudoku.state';
import {
  cellValueChanged,
  successfullyGeneratedNewBoard,
  successfullySolvedBoard,
  successfullyValidatedBoard,
} from './sudoku.actions';
import { createEmptyBoard, mapMatrixToBoard } from '@sudoku/shared';

export const initialState: SudokuState = {
  initialBoard: createEmptyBoard(),
  currentBoard: createEmptyBoard(),
  currentDifficulty: 'random',
  roomId: null,
  boardStatus: null,
};

export const sudokuReducer = createReducer(
  initialState,
  on(successfullyGeneratedNewBoard, (state, { difficulty, board }) => ({
    ...state,
    initialBoard: { ...board },
    currentBoard: board,
    currentDifficulty: difficulty,
  })),
  on(successfullySolvedBoard, (state, { solveResponse }) =>
    solveResponse.status != 'solved'
      ? { ...state }
      : {
          ...state,
          currentBoard: { ...mapMatrixToBoard(solveResponse.solution) },
          initialBoard: { ...mapMatrixToBoard(solveResponse.solution) },
          boardStatus: solveResponse.status,
        }
  ),
  on(successfullyValidatedBoard, (state, { boardStatus }) => ({
    ...state,
    boardStatus: boardStatus,
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
