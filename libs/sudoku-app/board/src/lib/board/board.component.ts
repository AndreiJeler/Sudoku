import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { first, of, switchMap, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { cellValueChanged, selectCurrentBoard } from '@sudoku/state';
import { OneDigitDirective, SelfUnsubscribeComponent } from '@sudoku/shared';

@Component({
  selector: 'sudoku-board',
  standalone: true,
  imports: [CommonModule, OneDigitDirective, FormsModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent extends SelfUnsubscribeComponent {
  selectedRow = -1;
  selectedCol = -1;

  board$ = this._store.select(selectCurrentBoard).pipe(
    takeUntil(this.ngUnsubscribe),
    switchMap((board) => {
      return of(board.cells);
    })
  );

  constructor(private _store: Store) {
    super();
  }

  onCellClicked(row: number, col: number) {
    this.selectedRow = row;
    this.selectedCol = col;
  }

  onCellValueChange(row: number, col: number, value: number) {
    this._store.dispatch(cellValueChanged({ row: row, col: col, value: 5 }));
  }
}
