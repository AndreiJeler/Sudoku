import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, of, tap } from 'rxjs';
import {
  DialogService,
  SudokuService,
  mapApiEntityToBoard,
} from '@sudoku/shared';
import {
  generateNewBoard,
  successfullyGeneratedNewBoard,
} from './sudoku.actions';

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
      mergeMap((action) =>
        this._sudokuService.getBoard(action.difficulty).pipe(
          map((boardResponse) => {
            const board = mapApiEntityToBoard(boardResponse);
            return successfullyGeneratedNewBoard({
              difficulty: action.difficulty,
              board: board,
            });
          }),
          catchError((error) => of(error))
        )
      )
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
}
