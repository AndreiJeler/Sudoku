import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of, switchMap, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  cellValueChanged,
  selectBoardStatus,
  selectInitialBoard,
} from '@sudoku/state';
import { NgxMaskDirective } from 'ngx-mask';
import { SelfUnsubscribeComponent } from '@sudoku/shared';

@Component({
  selector: 'sudoku-board',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent extends SelfUnsubscribeComponent {
  selectedRow = -1;
  selectedCol = -1;

  customPatterns = {
    '0': { pattern: new RegExp('[1-9]') },
  };

  board$ = this._store.select(selectInitialBoard).pipe(
    takeUntil(this.ngUnsubscribe),
    switchMap((board) => {
      this.selectedRow = -1;
      this.selectedCol = -1;

      return of(board.cells);
    })
  );

  isBoardSolved$ = this._store.select(selectBoardStatus).pipe(
    takeUntil(this.ngUnsubscribe),
    switchMap((boardStatus) => of(boardStatus == 'solved'))
  );

  constructor(private _store: Store) {
    super();
  }

  onCellClicked(row: number, col: number) {
    this.selectedRow = row;
    this.selectedCol = col;
  }

  onCellValueChange(row: number, col: number, eventTarget: any) {
    this._store.dispatch(
      cellValueChanged({ row: row, col: col, value: +eventTarget.value })
    );
  }
}
