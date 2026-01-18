
document.addEventListener("DOMContentLoaded", () => {
const canvas = document.getElementById("canvas");
const wordsContainer = document.getElementById("words");
const wordInput = document.getElementById("wordInput");
const buildBtn = document.getElementById("buildBtn");
const letterInput = document.getElementById("letterInput");
const addLetterBtn = document.getElementById("addLetterBtn");

let letters = {};
let squares = {};
let letterId = 0;
let squareId = 0;

/* ---------- BUILD WORD BOXES ---------- */
function buildWords(lengths) {
// Clear previous boxes
wordsContainer.innerHTML = "";
squares = {};
squareId = 0;

// Clear all letters
for (const id in letters) {
const l = letters[id];
if (l.el.parentElement) canvas.removeChild(l.el);
}
letters = {};
letterId = 0;

lengths.forEach(len => {
const word = document.createElement("div");
word.className = "word";

for (let i = 0; i < len; i++) {
const sq = document.createElement("div");
sq.className = "square";
sq.dataset.id = squareId;

squares[squareId] = {
el: sq,
rect: null,
letterId: null
};

word.appendChild(sq);
squareId++;
}

wordsContainer.appendChild(word);
});

cacheSquareRects();

// Auto-focus letter input after building
letterInput.focus();
}

/* ---------- LETTER CREATION ---------- */
function addLetter(char) {
const id = letterId++;
const div = document.createElement("div");
div.className = "letter";
div.textContent = char;
div.dataset.id = id;

// Offset letters to prevent stacking
const offset = (id % 10) * 20; // cycles every 10 letters
const baseX = 20 + offset;
const baseY = 150 + offset;

letters[id] = {
id,
el: div,
x: baseX,
y: baseY,
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
left: r.left - canvasRect.left,
top: r.top - canvasRect.top,
width: r.width,
height: r.height
};
}
}

/* ---------- DRAG, TAP, AND DELETE ---------- */
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
cacheSquareRects();
const snap = findSnapSquare(l);
if (snap !== null) placeInSquare(l, snap);
updateLetter(id);
});

// Tap to lock/unlock
el.addEventListener("click", e => {
e.stopPropagation();
if (l.squareId !== null) {
l.locked = !l.locked;
el.classList.toggle("locked", l.locked);
}
});

// Double-click delete
el.addEventListener("dblclick", () => {
el.style.transition = "opacity 0.2s";
el.style.opacity = "0";
setTimeout(() => {
canvas.removeChild(el);
if (l.squareId !== null) {
squares[l.squareId].letterId = null;
}
delete letters[id];
}, 200);
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
letter.y = r.top + r.height / 2 - 22;

letter.squareId = squareId;
squares[squareId].letterId = letter.id;
}

/* ---------- USER INPUT ---------- */

// Build boxes
buildBtn.addEventListener("click", () => {
const input = wordInput.value.trim();
if (!input) return;

const lengths = input
.split(/\s+/)
.map(n => parseInt(n, 10))
.filter(n => n > 0 && n < 20);

if (lengths.length) buildWords(lengths);
});

// Add letters via button
addLetterBtn.addEventListener("click", () => {
const char = letterInput.value.trim().toUpperCase();
if (!char.match(/^[A-Z]$/)) return;
addLetter(char);
letterInput.value = "";
letterInput.focus();
});

// Add letters via Enter key
letterInput.addEventListener("keydown", e => {
if (e.key === "Enter") {
const char = e.target.value.trim().toUpperCase();
if (!char.match(/^[A-Z]$/)) return;
addLetter(char);
e.target.value = "";
e.target.focus();
e.preventDefault();
}
});
});

Trevor
	

Conversation opened. 1 unread message.

Skip to content
Using Gmail with screen readers
1 of 4
Almost final script
Inbox
Trevor Lukey <tlukey@gmail.com>
	
1:02 PM (0 minutes ago)
	
	
to me
document.addEventListener("DOMContentLoaded", () => {
const canvas = document.getElementById("canvas");
const wordsContainer = document.getElementById("words");
const wordInput = document.getElementById("wordInput");
const buildBtn = document.getElementById("buildBtn");
const letterInput = document.getElementById("letterInput");
const addLetterBtn = document.getElementById("addLetterBtn");

let letters = {};
let squares = {};
let letterId = 0;
let squareId = 0;

/* ---------- BUILD WORD BOXES ---------- */
function buildWords(lengths) {
// Clear previous boxes
wordsContainer.innerHTML = "";
squares = {};
squareId = 0;

// Clear all letters
for (const id in letters) {
const l = letters[id];
if (l.el.parentElement) canvas.removeChild(l.el);
}
letters = {};
letterId = 0;

lengths.forEach(len => {
const word = document.createElement("div");
word.className = "word";

for (let i = 0; i < len; i++) {
const sq = document.createElement("div");
sq.className = "square";
sq.dataset.id = squareId;

squares[squareId] = {
el: sq,
rect: null,
letterId: null
};

word.appendChild(sq);
squareId++;
}

wordsContainer.appendChild(word);
});

cacheSquareRects();

// Auto-focus letter input after building
letterInput.focus();
}

/* ---------- LETTER CREATION ---------- */
function addLetter(char) {
const id = letterId++;
const div = document.createElement("div");
div.className = "letter";
div.textContent = char;
div.dataset.id = id;

// Offset letters to prevent stacking
const offset = (id % 10) * 20; // cycles every 10 letters
const baseX = 20 + offset;
const baseY = 150 + offset;

letters[id] = {
id,
el: div,
x: baseX,
y: baseY,
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
left: r.left - canvasRect.left,
top: r.top - canvasRect.top,
width: r.width,
height: r.height
};
}
}

/* ---------- DRAG, TAP, AND DELETE ---------- */
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
cacheSquareRects();
const snap = findSnapSquare(l);
if (snap !== null) placeInSquare(l, snap);
updateLetter(id);
});

// Tap to lock/unlock
el.addEventListener("click", e => {
e.stopPropagation();
if (l.squareId !== null) {
l.locked = !l.locked;
el.classList.toggle("locked", l.locked);
}
});

// Double-click delete
el.addEventListener("dblclick", () => {
el.style.transition = "opacity 0.2s";
el.style.opacity = "0";
setTimeout(() => {
canvas.removeChild(el);
if (l.squareId !== null) {
squares[l.squareId].letterId = null;
}
delete letters[id];
}, 200);
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
letter.y = r.top + r.height / 2 - 22;

letter.squareId = squareId;
squares[squareId].letterId = letter.id;
}

/* ---------- USER INPUT ---------- */

// Build boxes
buildBtn.addEventListener("click", () => {
const input = wordInput.value.trim();
if (!input) return;

const lengths = input
.split(/\s+/)
.map(n => parseInt(n, 10))
.filter(n => n > 0 && n < 20);

if (lengths.length) buildWords(lengths);
});

// Add letters via button
addLetterBtn.addEventListener("click", () => {
const char = letterInput.value.trim().toUpperCase();
if (!char.match(/^[A-Z]$/)) return;
addLetter(char);
letterInput.value = "";
letterInput.focus();
});

// Add letters via Enter key
letterInput.addEventListener("keydown", e => {
if (e.key === "Enter") {
const char = e.target.value.trim().toUpperCase();
if (!char.match(/^[A-Z]$/)) return;
addLetter(char);
e.target.value = "";
e.target.focus();
e.preventDefault();
}
});
});


	
