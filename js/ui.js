/**
 * Manage all ui elements
 * @author ArseneBrosy
 * @since 2024-10-04
 */

function openPage(id) {
  for (let page of document.querySelectorAll('.page')) {
    page.style.display = 'none';
  }
  document.getElementById(id).style.display = 'flex';
}

function fillLobbyPage(lobby) {
  console.log(lobby);
  document.querySelector("#game-lobby-game-id").innerText = lobby.gameId;
}