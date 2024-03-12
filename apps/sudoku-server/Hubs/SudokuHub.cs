using Microsoft.AspNetCore.SignalR;

namespace Sudoku.SudokuServer.Hubs;

public class SudokuHub(): Hub
{
  // These methods can be used if an aproach that creates groups inside the Hub is chosen
  public async Task AddToGroup(string roomId)
  {
    await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
  }

  public async Task RemoveFromGroup(string roomId)
  {
    await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
    await Clients.Group(roomId).SendAsync(WebSocketActions.USER_LEFT);
  }
}

public struct WebSocketActions
{
  public static readonly string USER_LEFT = "userLeft";
  public static readonly string USER_JOINED = "userJoined";
  public static readonly string CHANGE_MADE = "changeMade";
  public static readonly string BOARD_SOLVED = "boardSolved";
}
