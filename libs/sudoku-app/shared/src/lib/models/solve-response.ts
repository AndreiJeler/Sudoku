import { BoardApi } from './board-api';
import { BoardDifficulty } from './board-difficulty';
import { BoardStatus } from './board-status';

export type SolveResponse = {
  difficulty: BoardDifficulty;
  solution: BoardApi;
  status: BoardStatus;
};
