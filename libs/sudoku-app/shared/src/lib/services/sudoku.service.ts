import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mapBoardToApiEntity } from '../utils/board-utils';
import { ApiService } from './api.service';
import { BoardApi } from '../models/board-api';
import { Board } from '../models/board';
import { ValidateResponse } from './../models/validate-response';
import { BoardDifficulty } from '../models/board-difficulty';
import { SolveResponse } from '../models/solve-response';

@Injectable()
export class SudokuService {
  constructor(private _apiService: ApiService) {}

  getBoard(difficulty: BoardDifficulty): Observable<BoardApi> {
    return this._apiService.get<BoardApi>(`/board?difficulty=${difficulty}`);
  }

  validateBoard(board: Board): Observable<ValidateResponse> {
    return this._apiService.post<ValidateResponse>(
      '/validate',
      mapBoardToApiEntity(board)
    );
  }

  solveBoard(board: Board) {
    return this._apiService.post<SolveResponse>(
      '/solve',
      mapBoardToApiEntity(board)
    );
  }
}
