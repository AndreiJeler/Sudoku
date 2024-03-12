using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Sudoku.SudokuServer.Dtos;
using Sudoku.SudokuServer.Hubs;
using Sudoku.SudokuServer.Services;

namespace Sudoku.SudokuServer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SudokuController(ISudokuService sudokuService, IHubContext<SudokuHub> sudokuHub): ControllerBase
{
  private readonly ISudokuService _sudokuService = sudokuService;
  private readonly IHubContext<SudokuHub> _sudokuHub = sudokuHub;

  [HttpPost("create")]
  public IActionResult CreateRoom([FromBody] BoardDto board)
  {
    return Ok(_sudokuService.CreateRoom(board));
  }

  [HttpGet("{roomId}")]
  public async Task<IActionResult> JoinRoom(string roomId)
  {
    var room = _sudokuService.GetRoom(roomId);

    await _sudokuHub.Clients.All.SendAsync($"{WebSocketActions.USER_JOINED}_{roomId}");

    return Ok(room);
  }

  [HttpPut("{roomId}")]
  public async Task<IActionResult> UpdateRoom(string roomId, [FromBody] ChangeDto change)
  {
    var room = _sudokuService.UpdateRoom(roomId, change);

    await _sudokuHub.Clients.All.SendAsync($"{WebSocketActions.CHANGE_MADE}_{roomId}", change);

    return Ok(room);
  }

  [HttpPost("{roomId}")]
  public async Task<IActionResult> SolvedRoom(string roomId, [FromBody] BoardDto board)
  {
    var room = _sudokuService.SolveRoom(roomId, board);

    await _sudokuHub.Clients.All.SendAsync($"{WebSocketActions.BOARD_SOLVED}_{roomId}");

    return Ok(room);
  }
}
