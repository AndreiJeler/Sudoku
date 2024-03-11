import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, of, switchMap, takeUntil } from 'rxjs';
import { BoardComponent } from '@sudoku/board';
import {
  BoardDifficulty,
  DialogService,
  SelfUnsubscribeComponent,
} from '@sudoku/shared';
import {
  generateNewBoard,
  selectBoardStatus,
  solveBoard,
  validateBoard,
} from '@sudoku/state';

@Component({
  selector: 'sudoku-home-page',
  standalone: true,
  imports: [CommonModule, BoardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent
  extends SelfUnsubscribeComponent
  implements OnInit
{
  private _roomId?: string;
  isGuest = false;

  boardStatus$ = this._store
    .select(selectBoardStatus)
    .pipe(takeUntil(this.ngUnsubscribe));

  isBoardSolved$ = this._store.select(selectBoardStatus).pipe(
    takeUntil(this.ngUnsubscribe),
    switchMap((boardStatus) => {
      console.log(boardStatus === 'solved');
      return of(boardStatus === 'solved');
    })
  );

  public constructor(
    private _store: Store,
    private _dialogService: DialogService,
    private _route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this._route.queryParams
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter((params) => params['roomId'])
      )
      .subscribe((params) => {
        if (!params || !params['roomId']) return;

        this._roomId = params['roomId'];
        this.isGuest = true;
      });
  }

  selectDifficulty(difficulty: BoardDifficulty): void {
    this._store.dispatch(generateNewBoard({ difficulty: difficulty }));
  }

  generateCoopRoom(): void {
    const roomId = this._generateGuid();
    this._dialogService.copyUrlToClipboard(
      `http://localhost:4200?roomId=${roomId}`
    );
  }

  onSolveBoard(): void {
    this._store.dispatch(solveBoard());
  }

  onValidateBoard(): void {
    this._store.dispatch(validateBoard());
  }

  // Short custom made GUID template for a shorter URL
  private _generateGuid(): string {
    return 'xxyxxx-xxxx-yxxx-yxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
