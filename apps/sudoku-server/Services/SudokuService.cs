using Sudoku.SudokuServer.Dtos;
using Sudoku.SudokuServer.Entities;

namespace Sudoku.SudokuServer.Services;

public class SudokuService : ISudokuService
{
  private ICollection<SudokuRoom> Rooms { get; set; }

  public SudokuService()
  {
    Rooms = new List<SudokuRoom>();
  }

  public SudokuRoom GetRoom(string roomId)
  {
    var room = Rooms
      .FirstOrDefault(room => room.Id == roomId);

    if (room is null)
    {
      // better exceptions can be thrown
      throw new Exception("There is no room with the given id");
    }

    return room;
  }

  public SudokuRoom CreateRoom(BoardDto board)
  {
    var newId = Guid.NewGuid().ToString();

    if (Rooms.Any(room => room.Id == newId))
    {
      // better exceptions can be thrown
      throw new Exception("There is already a room created with the given id");
    }

    var room = new SudokuRoom
    {
      Id = newId,
      Board = board.Board
    };

    Rooms.Add(room);

    return room;
  }

  public SudokuRoom UpdateRoom(string roomId, ChangeDto change)
  {
    var room = Rooms
      .FirstOrDefault(room => room.Id == roomId);

    if (room is null)
    {
      // better exceptions can be thrown
      throw new Exception("There is no room with the given id");
    }

    room.Board[change.Row][change.Column] = change.Value;

    return room;
  }

  public SudokuRoom SolveRoom(string roomId, BoardDto board)
  {
    var room = Rooms
      .FirstOrDefault(room => room.Id == roomId);

    if (room is null)
    {
      // better exceptions can be thrown
      throw new Exception("There is no room with the given id");
    }

    room.IsBoardSolved = true;
    room.Board = board.Board;

    return room;
  }
}
