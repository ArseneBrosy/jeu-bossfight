/**
 * Manage all ui elements
 * @author ArseneBrosy
 * @since 2024-10-04
 */

let lobby = {};
let openedPage = 'connection';

/**
 * Open a page by its id and closes all others
 * @param id the page to open
 */
function openPage(id) {
  for (let page of document.querySelectorAll('.page')) {
    page.style.display = 'none';
  }
  document.getElementById(id).style.display = 'flex';
  openedPage = id;
}

/**
 * Updates the infos on the lobby page to match the lobby variable
 */
function fillLobbyPage() {
  // game id
  document.querySelector("#game-lobby-game-id").innerText = lobby.gameId;

  // players
  document.querySelector('#game-lobby-players').innerHTML = "";
  for (let player of lobby.players) {
    document.querySelector('#game-lobby-players').innerHTML += `<div class="filled"><canvas></canvas><p>${player.name}</p></div>`;
  }
  for (let i = lobby.players.length; i < 5; i++) {
    document.querySelector('#game-lobby-players').innerHTML += '<div></div>';
  }

  // lobby size
  document.querySelector('#game-lobby-size').innerText = `${lobby.players.length} / 5`;
}

//region PSEUDO
if (localStorage.getItem('pseudo') !== null) {
  document.querySelector('#home-pseudo').value = localStorage.getItem('pseudo');
}

document.querySelector('#home-pseudo').addEventListener('input', (e) => {
  localStorage.setItem('pseudo', e.target.value);
});
//endregion