const plateau = document.getElementById("plateau");
const score = document.getElementById("score");
const mot = document.getElementById("mot");

const timerElement = document.getElementById("chrono");
let canTimer = true;
let time = 10;

const nbCases = plateau.children.length;
const len = nbCases / 4;

let tMotsFaits = [],
  arr = [],
  word = "",
  precNumCible,
  boutonEnfonce = false;

window.addEventListener("load", () => {
  fInitJeu();
  fEcouteSouris();
  initMatrix();
  score.innerHTML = 0;
});

function fNbAlea(n) {
  return Math.floor(Math.random() * n);
}

function initMatrix() {
  let cpt = 0;
  for (let index1 = 0; index1 < len; index1++) {
    let row = [];
    for (let index2 = 0; index2 < len; index2++) {
      row.push(cpt);
      cpt += 1;
    }
    arr.push(row);
  }
}
function get(id) {}

function fTirage() {
  const tLettres = [
    "A",
    "A",
    "A",
    "A",
    "A",
    "A",
    "A",
    "A",
    "A",
    "B",
    "B",
    "C",
    "C",
    "D",
    "D",
    "D",
    "E",
    "E",
    "E",
    "E",
    "E",
    "E",
    "E",
    "E",
    "E",
    "E",
    "E",
    "E",
    "E",
    "E",
    "E",
    "F",
    "F",
    "G",
    "G",
    "H",
    "H",
    "I",
    "I",
    "I",
    "I",
    "I",
    "I",
    "I",
    "I",
    "J",
    "K",
    "L",
    "L",
    "L",
    "L",
    "L",
    "M",
    "M",
    "M",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "O",
    "O",
    "O",
    "O",
    "O",
    "O",
    "P",
    "P",
    "Q",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "S",
    "S",
    "S",
    "S",
    "S",
    "S",
    "T",
    "T",
    "T",
    "T",
    "T",
    "T",
    "U",
    "U",
    "U",
    "U",
    "U",
    "U",
    "V",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const array = [...new Set(tLettres)];
  for (let i of plateau.children) {
    const index = Math.floor(Math.random() * array.length);
    const letter = array[index];
    i.innerHTML = letter;
    array.splice(index, 1);
  }
}

function fEcouteSouris() {
  for (let i = 0; i < plateau.children.length; i++) {
    plateau.children[i].addEventListener("mousedown", () =>
      fEnfonceBouton(plateau.children[i], i)
    );
    plateau.children[i].addEventListener("mouseup", () =>
      fRelacheBouton(plateau.children[i])
    );
    plateau.children[i].addEventListener("mouseover", (event) =>
      fDeplaceSouris(plateau.children[i], i)
    );

    plateau.children[i].addEventListener("touchstart", () =>
      fEnfonceBouton(plateau.children[i], i)
    );
    plateau.children[i].addEventListener("touchend", () =>
      fRelacheBouton(plateau.children[i])
    );
    plateau.children[i].addEventListener("touchmove", (event) =>
      fTouchMove(event)
    );
  }
}

function fInitGrille() {
  for (i of plateau.children) {
    i.classList.remove("active");
  }
}

function fInitJeu() {
  tMotsFaits.push(word);
  mot.innerHTML = "";
  score.innerHTML = 0;
  fTirage();
}

function fVoisines(c1, c2) {
  let n, m;
  const v = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    [-1, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
  ];

  for (let index1 = 0; index1 < len; index1++) {
    for (let index2 = 0; index2 < len; index2++) {
      if (arr[index1][index2] == c1) {
        m = index1;
        n = index2;
      }
    }
  }

  const neighbours = v
    .filter(([h, j]) => h + m >= 0 && h + m < len && j + n >= 0 && j + n < len)
    .map(([h, j]) => arr[h + m][j + n]);

  for (let i of neighbours) {
    if (i == c2) {
      return true;
    }
  }

  return false;
}

function fEnfonceBouton(c, index) {
  if (mot.innerText.length == 0) {
    mot.innerHTML += c.innerHTML;
    c.classList.add("active");
    boutonEnfonce = true;
    precNumCible = index;
  }
}

function fRelacheBouton() {
  boutonEnfonce = false;
  fInitJeu();
  fInitGrille();
  if (!canTimer) time = 11;
}

function fDeplaceSouris(c, index) {
  if (!c.classList.contains("active") && boutonEnfonce) {
    if (fVoisines(precNumCible, index)) {
      mot.innerHTML += c.innerHTML;
      c.classList.add("active");
      precNumCible = index;
      if (tMots[mot.innerText]) {
        score.innerHTML = parseInt(score.innerText) + 1;
      }
    }
  }
}

function fTouchMove(e) {
  c = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
  index = parseInt(c.attributes.id.value.replace("case", ""));
  if (!c.classList.contains("active") && boutonEnfonce) {
    if (fVoisines(precNumCible, index)) {
      mot.innerHTML += c.innerHTML;
      c.classList.add("active");
      precNumCible = index;
      if (tMots[mot.innerText]) {
        score.innerHTML = parseInt(score.innerText) + 1;
      }
    }
  }
}

let chrono;
function startTimer() {
  if (canTimer) {
    timerElement.innerHTML = time;
    canTimer = false;
    chrono = setInterval(duration, 1000);
  } else {
    clearInterval(chrono);
    timerElement.innerHTML = "START";
    canTimer = true;
    time = 10;
  }
}

function duration() {
  time = time <= 0 ? 0 : time - 1;
  timerElement.innerHTML = time;
  if (time == 0) {
    fInitJeu();
    fInitGrille();
    time = 10;
    timerElement.innerHTML = time;
  }
}
