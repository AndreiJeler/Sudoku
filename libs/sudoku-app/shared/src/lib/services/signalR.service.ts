import { cellValueChanged } from '@sudoku/state';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'apps/sudoku/src/environments/environment';
import { DialogService } from './dialog.service';
import {
  CHANGE_MADE,
  HOST_LEFT,
  USER_JOINED,
  USER_LEFT,
} from '../utils/signalR.utils';
import { Change } from '../models/change';

@Injectable()
export class SignalRService {
  private _hubConnection: signalR.HubConnection | null = null;

  constructor(private store: Store, private dialogService: DialogService) {}

  public startConnection = () => {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.coopAPIUrl}/coop`)
      .build();

    this._hubConnection
      .start()
      .then()
      .catch((err) =>
        this.dialogService.showDialog({
          title: 'Error',
          text: 'Connection to the room could not be established',
          icon: 'error',
        })
      );
  };

  public newPlayerJoinedListener(roomId: string) {
    this._hubConnection?.on(`${USER_JOINED}_${roomId}`, () =>
      this.dialogService.showDialog({ text: 'New player joined' })
    );
  }

  public playerLeftListener(roomId: string) {
    this._hubConnection?.on(`${USER_LEFT}_${roomId}`, () =>
      this.dialogService.showDialog({ text: 'Player left the room' })
    );
  }

  public hostLeftListener(roomId: string) {
    this._hubConnection?.on(`${HOST_LEFT}_${roomId}`, () => {
      this.dialogService.showDialog({ text: 'Host left the room' });
      this._hubConnection?.stop().then();
    });
  }

  public changeMadeListener(roomId: string) {
    this._hubConnection?.on(`${CHANGE_MADE}_${roomId}`, (change: Change) => {
      this.store.dispatch(
        cellValueChanged({
          row: change.row,
          col: change.column,
          value: change.value,
        })
      );
    });
  }

  public closeConnection() {
    this._hubConnection?.stop().then();
  }
}
