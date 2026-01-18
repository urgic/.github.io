const canvas = document.getElementById("canvas");
const wordsContainer = document.getElementById("words");

let letters = {};
let squares = {};
let letterId = 0;
let squareId = 0;

/* ---------- WORD SETUP ---------- */

function buildWords(lengths) {
  wordsContainer.innerHTML = "";
  squares = {};
  squareId = 0;

  lengths.forEach(len => {
    const word = document.createElement("div");
    word.className = "word";

    for (let i = 0; i < len; i++) {
      const sq = document.createElement("div");
      sq.className = "square";
      sq.dataset.id = squareId;

      squares[squareId] = {
        el: sq,
        letterId: null,
        rect: null
      };

      word.appendChild(sq);
      squareId++;
    }
    wordsContainer.appendChild(word);
  });

  cacheSquareRects();
}

/* ---------- LETTER CREATION ---------- */

function addLetter(char) {
  const id = letterId++;
  const div = document.createElement("div");
  div.className = "letter";
  div.textContent = char;
  div.dataset.id = id;

  letters[id] = {
    id,
    char,
    el: div,
    x: 20,
    y: 200,
    squareId: null,
    locked: false
  };

  canvas.appendChild(div);
  updateLetter(id);
  enableDrag(id);
}

/* ---------- POSITIONING ---------- */

function updateLetter(id) {
  const l = letters[id];
  l.el.style.transform = `translate(${l.x}px, ${l.y}px)`;
}

function cacheSquareRects() {
  const canvasRect = canvas.getBoundingClientRect();

  for (const id in squares) {
    const r = squares[id].el.getBoundingClientRect();

    squares[id].rect = {
      left: r.left - canvasRect.left + canvas.scrollLeft,
      top:  r.top  - canvasRect.top  + canvas.scrollTop,
      width: r.width,
      height: r.height
    };
  }
}

/* ---------- DRAG & DROP ---------- */

function enableDrag(id) {
  const l = letters[id];
  const el = l.el;

  let startX, startY, origX, origY;

  el.addEventListener("pointerdown", e => {
    if (l.locked) return;

    el.setPointerCapture(e.pointerId);
    startX = e.clientX;
    startY = e.clientY;
    origX = l.x;
    origY = l.y;

    if (l.squareId !== null) {
      squares[l.squareId].letterId = null;
      l.squareId = null;
    }
  });

  el.addEventListener("pointermove", e => {
    if (!el.hasPointerCapture(e.pointerId)) return;

    l.x = origX + (e.clientX - startX);
    l.y = origY + (e.clientY - startY);
    updateLetter(id);
  });

  el.addEventListener("pointerup", () => {
    const snap = findSnapSquare(l);
    if (snap !== null) placeInSquare(l, snap);
    updateLetter(id);
  });

  el.addEventListener("click", () => {
    if (l.squareId !== null) {
      l.locked = !l.locked;
      el.classList.toggle("locked", l.locked);
    }
  });
}

/* ---------- SNAP LOGIC ---------- */

function findSnapSquare(letter) {
  const cx = letter.x + 22;
  const cy = letter.y + 22;

  for (const id in squares) {
    const sq = squares[id];
    if (sq.letterId !== null) continue;

    const r = sq.rect;
    if (
      cx > r.left &&
      cx < r.left + r.width &&
      cy > r.top &&
      cy < r.top + r.height
    ) {
      return id;
    }
  }
  return null;
}

function placeInSquare(letter, squareId) {
  const r = squares[squareId].rect;

  letter.x = r.left + r.width / 2 - 22;
  letter.y = r.top  + r.height / 2 - 22;

  letter.squareId = squareId;
  squares[squareId].letterId = letter.id;
}
/* ---------- DEMO SETUP ---------- */

/* Example: 2 words, lengths 5 and 4 */
/* buildWords([5, 4]); */

/* Keyboard input */
document.addEventListener("keydown", e => {
  if (/^[a-zA-Z]$/.test(e.key)) {
    addLetter(e.key.toUpperCase());
  }
  
document.getElementById("buildBtn").addEventListener("click", () => {
const input = document.getElementById("wordInput").value.trim();
if (!input) return;

const lengths = input
.split(/\s+/)
.map(n => parseInt(n, 10))
.filter(n => n > 0 && n < 20);

if (!lengths.length) return;

buildWords(lengths);
});



