import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEnvironmentNgxMask } from 'ngx-mask';
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
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: true, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true) }),
    }),
    provideEnvironmentNgxMask(),
  ],
};
