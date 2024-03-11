import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mapBoardToApiEntity, mapBoardToMatrix } from '../utils/board-utils';
import { ApiService } from './api.service';
import { BoardApi } from '../models/board-api';
import { Board } from '../models/board';
import { ValidateResponse } from './../models/validate-response';
import { BoardDifficulty } from '../models/board-difficulty';
import { SolveResponse } from '../models/solve-response';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class SudokuService {
  constructor(private _apiService: ApiService) {}

  getBoard(difficulty: BoardDifficulty): Observable<BoardApi> {
    return this._apiService.get<BoardApi>(`/board?difficulty=${difficulty}`);
  }

  validateBoard(board: Board): Observable<ValidateResponse> {
    return this._apiService.post<ValidateResponse>(
      '/validate',
      this._prepareFormData(board)
    );
  }

  solveBoard(board: Board) {
    return this._apiService.post<SolveResponse>(
      '/solve',
      this._prepareFormData(board)
    );
  }

  private _prepareFormData(board: Board) {
    const formData = new FormData();
    formData.append('board', JSON.stringify(mapBoardToMatrix(board)));
    return formData;
  }
}
