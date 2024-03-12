namespace Sudoku.SudokuServer.Dtos;

public record BoardDto
{
  public int[][] Board { get; init; }
}
