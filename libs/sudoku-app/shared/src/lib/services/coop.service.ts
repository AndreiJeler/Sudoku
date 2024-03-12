import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { BoardApi } from '../models/board-api';
import { environment } from 'apps/sudoku/src/environments/environment';
import { SudokuRoom } from '../models/sudoku-room';
import { Change } from '../models/change';

@Injectable()
export class CoopService {
  private _baseUrl: string;

  constructor(private _apiService: ApiService) {
    this._baseUrl = `${environment.coopAPIUrl}/api/sudoku`;
  }

  createRoom(board: BoardApi): Observable<SudokuRoom> {
    return this._apiService.post<SudokuRoom>(`${this._baseUrl}/create`, board);
  }

  joinRoom(roomId: string): Observable<SudokuRoom> {
    return this._apiService.get<SudokuRoom>(`${this._baseUrl}/${roomId}`);
  }

  updateBoard(roomId: string, change: Change): Observable<SudokuRoom> {
    return this._apiService.put<SudokuRoom>(
      `${this._baseUrl}/${roomId}`,
      change
    );
  }

  solveBoard(roomId: string, board: BoardApi): Observable<SudokuRoom> {
    return this._apiService.put<SudokuRoom>(
      `${this._baseUrl}/${roomId}`,
      board
    );
  }
}
