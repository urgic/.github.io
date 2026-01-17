// ---------------------- Service Worker ----------------------
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service Worker registered'))
    .catch(err => console.log('Service Worker failed:', err));
}

// ---------------------- Variables ----------------------
let letters = [];
let squares = {};
let dragLetter = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

document.getElementById("buildBtn").onclick = buildWords;
const hidden = document.getElementById("hiddenInput");
hidden.focus();
hidden.addEventListener("input", handleKeyboardInput);
document.getElementById("canvas").onclick = () => hidden.focus();

// ---------------------- Build words ----------------------
function buildWords() {
  const input = document.getElementById("lengthInput").value;
  const nums = input.split(/\s+/).map(n => parseInt(n)).filter(Boolean);

  const wordsDiv = document.getElementById("words");
  wordsDiv.innerHTML = "";
  squares = {};

  nums.forEach((n, wIndex) => {
    const row = document.createElement("div");
    row.className = "word";

    for (let i = 0; i < n; i++) {
      const sq = document.createElement("div");
      const id = `w${wIndex}s${i}`;
      sq.className = "square";
      sq.dataset.id = id;

      sq.ondragover = e => e.preventDefault();
      sq.ondrop = () => dropOnSquare(id);

      squares[id] = { letterId: null, rect: null };
      row.appendChild(sq);
    }

    wordsDiv.appendChild(row);

    if (wIndex < nums.length - 1) {
      const spacer = document.createElement("div");
      spacer.className = "word-space";
      wordsDiv.appendChild(spacer);
    }
  });

  cacheSquareRects();
}

// ---------------------- Cache squares ----------------------
function cacheSquareRects() {
  for (const id in squares) {
    const el = document.querySelector(`[data-id="${id}"]`);
    squares[id].rect = el.getBoundingClientRect();
  }
}

// ---------------------- Keyboard input ----------------------
function handleKeyboardInput(e) {
  const char = e.target.value.toUpperCase();
  e.target.value = "";
  if (!/^[A-Z]$/.test(char)) return;

  const letter = {
    id: crypto.randomUUID(),
    char,
    x: 10,
    y: 10,
    squareId: null,
    locked: false
  };

  letters.push(letter);
  renderLetters();
}

// ---------------------- Render letters ----------------------
function renderLetters() {
  const canvas = document.getElementById("canvas");
  canvas.querySelectorAll(".letter").forEach(l => l.remove());

  letters.forEach(l => {
    const div = document.createElement("div");
    div.className = "letter" + (l.locked ? " locked" : "");
    div.textContent = l.char;
    div.style.left = l.x + "px";
    div.style.top = l.y + "px";
    div.dataset.id = l.id;

    div.onpointerdown = e => startDrag(e, l);
    div.onclick = () => toggleLock(l);

    canvas.appendChild(div);
  });
}

// ---------------------- Drag logic ----------------------
function startDrag(e, letter) {
  if (letter.locked) return;

  dragLetter = letter;
  dragOffsetX = e.clientX - letter.x;
  dragOffsetY = e.clientY - letter.y;

  if (letter.squareId) {
    squares[letter.squareId].letterId = null;
    letter.squareId = null;
  }
}

document.onpointermove = e => {
  if (!dragLetter) return;

  dragLetter.x = e.clientX - dragOffsetX;
  dragLetter.y = e.clientY - dragOffsetY;

  const el = document.querySelector(`[data-id="${dragLetter.id}"]`);
  if (el) {
    el.style.left = dragLetter.x + "px";
    el.style.top = dragLetter.y + "px";
  }
};

document.onpointerup = () => {
  if (!dragLetter) return;

  const snapSquare = findSnapSquare(dragLetter);

  if (snapSquare) {
    placeInSquare(dragLetter, snapSquare);
  }

  dragLetter = null;
  renderLetters();
};

// ---------------------- Snap helpers ----------------------
function findSnapSquare(letter) {
  const centerX = letter.x + 22;
  const centerY = letter.y + 22;

  for (const id in squares) {
    const sq = squares[id];
    if (sq.letterId) continue;

    const r = sq.rect;
    if (
      centerX > r.left &&
      centerX < r.right &&
      centerY > r.top &&
      centerY < r.bottom
    ) {
      return id;
    }
  }
  return null;
}

function placeInSquare(letter, squareId) {
  const sq = squares[squareId];
  const r = sq.rect;

  letter.x = r.left;
  letter.y = r.top;
  letter.squareId = squareId;
  sq.letterId = letter.id;
}

// ---------------------- Lock / unlock ----------------------
function toggleLock(letter) {
  if (!letter.squareId) return;
  letter.locked = !letter.locked;
  renderLetters();
}
