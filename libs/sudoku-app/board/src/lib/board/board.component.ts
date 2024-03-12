import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of, switchMap, takeUntil, filter, first, pipe } from 'rxjs';
import { Store } from '@ngrx/store';
import { NgxMaskDirective } from 'ngx-mask';
import {
  cellValueChanged,
  generateNewBoard,
  joinRoom,
  selectBoardStatus,
  selectCurrentBoard,
  selectInitialBoard,
  solveBoard,
  validateBoard,
} from '@sudoku/state';
import {
  BoardDifficulty,
  CoopService,
  DialogService,
  SelfUnsubscribeComponent,
  mapBoardToApiEntity,
  SignalRService,
  mapApiEntityToBoard,
  mapMatrixToBoard,
} from '@sudoku/shared';
import { environment } from 'apps/sudoku/src/environments/environment';

@Component({
  selector: 'sudoku-board',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  providers: [CoopService, SignalRService],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent extends SelfUnsubscribeComponent implements OnInit {
  selectedRow = -1;
  selectedCol = -1;

  customPatterns = {
    '0': { pattern: new RegExp('[1-9]') },
  };

  currentBoard$ = this.store.select(selectCurrentBoard).pipe(
    takeUntil(this.ngUnsubscribe),
    switchMap((board) => {
      return of(board.cells);
    })
  );

  board$ = this.store.select(selectInitialBoard).pipe(
    takeUntil(this.ngUnsubscribe),
    switchMap((board) => {
      this.selectedRow = -1;
      this.selectedCol = -1;
      return of(board.cells);
    })
  );

  roomId?: string;
  isGuest = false;

  boardStatus$ = this.store
    .select(selectBoardStatus)
    .pipe(takeUntil(this.ngUnsubscribe));

  isBoardSolved$ = this.store.select(selectBoardStatus).pipe(
    takeUntil(this.ngUnsubscribe),
    switchMap((boardStatus) => {
      return of(boardStatus === 'solved');
    })
  );

  constructor(
    private store: Store,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private coopService: CoopService,
    private signalRService: SignalRService
  ) {
    super();
  }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter((params) => params['roomId']),
        switchMap((params) => {
          if (!params || !params['roomId']) {
            return of();
          }

          this.roomId = params['roomId'];
          this.isGuest = true;

          return this.coopService.joinRoom(params['roomId']).pipe(
            takeUntil(this.ngUnsubscribe),
            first(),
            switchMap((response) => {
              this.store.dispatch(
                joinRoom({
                  roomId: this.roomId!,
                  board: mapMatrixToBoard(response.board),
                })
              );
              this.signalRService.startConnection();
              this._openHubConnections();

              return of(response);
            })
          );
        })
      )
      .subscribe();
  }

  selectDifficulty(difficulty: BoardDifficulty): void {
    this.store.dispatch(generateNewBoard({ difficulty: difficulty }));
  }

  onCellClicked(row: number, col: number) {
    this.selectedRow = row;
    this.selectedCol = col;
  }

  onCellValueChange(row: number, col: number, eventTarget: any) {
    this.store.dispatch(
      cellValueChanged({ row: row, col: col, value: +eventTarget.value })
    );
  }

  onSolveBoard(): void {
    this.store.dispatch(solveBoard());
  }

  onValidateBoard(): void {
    this.store.dispatch(validateBoard());
  }

  generateCoopRoom(): void {
    this.store
      .select(selectCurrentBoard)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        first(),
        switchMap((board) => {
          return this.coopService.createRoom(mapBoardToApiEntity(board)).pipe(
            takeUntil(this.ngUnsubscribe),
            first(),
            switchMap((response) => {
              this.roomId = response.id;

              this.dialogService.copyUrlToClipboard(
                `${environment.clientUrl}/?roomId=${response.id}`
              );

              this.signalRService.startConnection();
              this._openHubConnections();

              return of(response);
            })
          );
        })
      )
      .subscribe();
  }

  private _openHubConnections() {
    this.signalRService.newPlayerJoinedListener(this.roomId!);
  }
}
