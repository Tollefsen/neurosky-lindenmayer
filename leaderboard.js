let players = [];

const leaderBoardList = document.getElementById("leader-board-list");

const sortPlayers = () => {
  return players.sort(function(a, b) {
    return a.score >= b.score ? 1 : -1;
  });
}

const currentPosition = (score) => {
  let position = 1;
  players.forEach(player => {
    if(player.score < score) {
      position++;
    }
  })
  return position;
}

const displayPlayers = () => {
  leaderBoardList.innerHTML = '';
  players.slice(0, 5).forEach(function(p) {
    leaderBoardList.appendChild(createPlayerElement(p));
  });

}

window.addEventListener("load", function() {
  const persistedPlayers = JSON.parse(localStorage.getItem('players'));
  players = persistedPlayers ? persistedPlayers : [];
  players = sortPlayers();  
  displayPlayers();
});

const addPlayer = (player) => {
  players.push(player);
  players = sortPlayers();
  localStorage.setItem('players', JSON.stringify(players));
  displayPlayers();
}


function createPlayerElement(player) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.innerText = player.name;
  const small = document.createElement("small");
  small.innerText = `${player.score / 1000} sec`;
  li.appendChild(span);
  li.appendChild(small);
  return li;
}
