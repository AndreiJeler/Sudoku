namespace Sudoku.SudokuServer.Entities;

public sealed class SudokuRoom
{
  public string Id { get; init; }
  public int[][] Board { get; set; }
  public bool IsBoardSolved { get; set; }
}
