namespace Sudoku.SudokuServer.Dtos;

public record ChangeDto
{
  public int Row { get; set; }
  public int Column { get; set; }
  public int Value { get; set; }
}
