import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { ApiService, DialogService, SudokuService } from '@sudoku/shared';
import { SudokuEffects, sudokuReducer } from '@sudoku/state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    ApiService,
    DialogService,
    SudokuService,
    provideStore({ sudoku: sudokuReducer }),
    provideEffects([SudokuEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
  ],
};
