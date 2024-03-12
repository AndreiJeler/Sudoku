import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, of, tap, first } from 'rxjs';
import {
  DialogService,
  SudokuService,
  mapApiEntityToBoard,
} from '@sudoku/shared';
import {
  generateNewBoard,
  solveBoard,
  successfullyGeneratedNewBoard,
  successfullySolvedBoard,
  successfullyValidatedBoard,
  validateBoard,
} from './sudoku.actions';
import { selectCurrentBoard } from './sudoku.selectors';

@Injectable()
export class SudokuEffects {
  constructor(
    private _sudokuService: SudokuService,
    private _dialogService: DialogService,
    private _store: Store,
    private _actions$: Actions
  ) {}

  generateNewSudokuBoard = createEffect(() =>
    this._actions$.pipe(
      ofType(generateNewBoard),
      mergeMap((action) => {
        this._dialogService.showLoader();
        return this._sudokuService.getBoard(action.difficulty).pipe(
          first(),
          map((boardResponse) => {
            const board = mapApiEntityToBoard(boardResponse);
            return successfullyGeneratedNewBoard({
              difficulty: action.difficulty,
              board: board,
            });
          }),
          catchError((error) => of(error))
        );
      })
    )
  );

  successfullyGeneratedNewBoard$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(successfullyGeneratedNewBoard),
        tap(() => {
          this._dialogService.showDialog({
            showCloseButton: true,
            title: 'New board generated',
          });
        })
      ),
    { dispatch: false }
  );

  solveBoard$ = createEffect(() =>
    this._actions$.pipe(
      ofType(solveBoard),
      concatLatestFrom(() =>
        this._store.select(selectCurrentBoard).pipe(first())
      ),
      mergeMap(([_, board]) => {
        this._dialogService.showLoader();
        return this._sudokuService.solveBoard(board).pipe(
          first(),
          map((result) => successfullySolvedBoard({ solveResponse: result }))
        );
      })
    )
  );

  successfullySolvedBoard$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(successfullySolvedBoard),
        tap((result) => {
          if (result.solveResponse.status === 'solved') {
            this._dialogService.showDialog({
              showCloseButton: true,
              text: 'Current board was solved successfully',
              title: 'Solved',
              icon: 'success',
            });
          } else {
            this._dialogService.showDialog({
              showCloseButton: true,
              text: 'Current board could not be solved',
              title: 'Unsolvable',
              icon: 'warning',
            });
          }
        })
      ),
    { dispatch: false }
  );

  validateBoard$ = createEffect(() =>
    this._actions$.pipe(
      ofType(validateBoard),
      concatLatestFrom(() =>
        this._store.select(selectCurrentBoard).pipe(first())
      ),
      mergeMap(([_, board]) => {
        this._dialogService.showLoader();
        return this._sudokuService.validateBoard(board).pipe(
          first(),
          map((result) =>
            successfullyValidatedBoard({ boardStatus: result.status })
          )
        );
      })
    )
  );

  successfullyValidatedBoard$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(successfullyValidatedBoard),
        tap((result) => {
          if (result.boardStatus === 'solved') {
            this._dialogService.showDialog({
              showCloseButton: true,
              text: 'Current board is solved',
              title: 'Solved',
              icon: 'success',
            });
          } else {
            this._dialogService.showDialog({
              showCloseButton: true,
              text: 'Current board is not solved yet',
              title: 'Unsolvable',
              icon: 'warning',
            });
          }
        })
      ),
    { dispatch: false }
  );
}
