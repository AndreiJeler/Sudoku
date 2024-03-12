using Sudoku.SudokuServer.Dtos;
using Sudoku.SudokuServer.Entities;

namespace Sudoku.SudokuServer.Services;

public interface ISudokuService
{
  /// <summary>
  /// Get the room by id
  /// </summary>
  /// <param name="roomId">The id of the room</param>
  /// <returns>The room entity that contains the id and the board</returns>
  public SudokuRoom GetRoom(string roomId);

  /// <summary>
  /// Creates a new room, with the given board
  /// </summary>
  /// <param name="board">The current status of the sudoku board</param>
  /// <returns>The room entity that contains the id and the board</returns>
  public SudokuRoom CreateRoom(BoardDto board);

  /// <summary>
  /// Change the value of a cell inside the board
  /// </summary>
  /// <param name="roomId">The id of the room</param>
  /// <param name="change">The position of the cell, together with the new value</param>
  /// <returns>The room entity that contains the id and the board</returns>
  public SudokuRoom UpdateRoom(string roomId, ChangeDto change);

  /// <summary>
  /// Mark the room as being solved
  /// </summary>
  /// <param name="roomId">The id of the room</param>
  /// <param name="board">The solved board</param>
  /// <returns>The room entity that contains the id and the board</returns>
  public SudokuRoom SolveRoom(string roomId, BoardDto board);
}
