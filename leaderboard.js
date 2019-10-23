let players = [
  { name: "Erlend Lokken", score: "12.4", position: 1 },
  { name: "Erlend Lokken", score: "12.9", position: 5 },
  { name: "Erlend Lokken", score: "12.6", position: 2 },
  { name: "Erlend Lokken", score: "12.7", position: 3 },
  { name: "Erlend Lokken", score: "12.8", position: 4 }
];

window.addEventListener("load", function() {
  // get from localstorage
  // and append to element
  players.sort(function(a, b) {
    return a.position >= b.position ? 1 : -1;
  });
  const element = document.getElementById("leaderboard");
  players.forEach(function(p) {
    element.appendChild(createPlayerElement(p));
  });
});

function createPlayerElement(p) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.innerText = p.name;
  const small = document.createElement("small", p.score);
  small.innerText = p.score + " sec";
  li.appendChild(span);
  li.appendChild(small);
  return li;
}
