import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mapBoardToMatrix } from '../utils/board-utils';
import { ApiService } from './api.service';
import { BoardApi } from '../models/board-api';
import { Board } from '../models/board';
import { ValidateResponse } from './../models/validate-response';
import { BoardDifficulty } from '../models/board-difficulty';
import { SolveResponse } from '../models/solve-response';
import { environment } from 'apps/sudoku/src/environments/environment';

// Service for SuGOku API
@Injectable()
export class SudokuService {
  private _baseUrl: string;

  constructor(private _apiService: ApiService) {
    this._baseUrl = environment.sudokuAPIUrl;
  }

  getBoard(difficulty: BoardDifficulty): Observable<BoardApi> {
    return this._apiService.get<BoardApi>(
      `${this._baseUrl}/board?difficulty=${difficulty}`
    );
  }

  validateBoard(board: Board): Observable<ValidateResponse> {
    return this._apiService.post<ValidateResponse>(
      `${this._baseUrl}/validate`,
      this._prepareFormData(board)
    );
  }

  solveBoard(board: Board) {
    return this._apiService.post<SolveResponse>(
      `${this._baseUrl}/solve`,
      this._prepareFormData(board)
    );
  }

  // Transform the board into a form data object, that is needed for post operations to SuGOku
  private _prepareFormData(board: Board) {
    const formData = new FormData();
    formData.append('board', JSON.stringify(mapBoardToMatrix(board)));
    return formData;
  }
}
