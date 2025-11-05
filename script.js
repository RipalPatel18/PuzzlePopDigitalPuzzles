const room = document.getElementById("puzzle-room");
const message = document.getElementById("message");
const snapSound = document.getElementById("snap-sound");
const hint = document.getElementById("hint");

const rows = 3;
const cols = 4;
const pieceWidth = 150;
const pieceHeight = 133.33;
const snapThreshold = 20;
let correctCount = 0;


const selectedImage = "https://picsum.photos/600/400";


hint.src = selectedImage;
hint.onload = () => {
  createPuzzlePieces();
};

// Create puzzle pieces
function createPuzzlePieces() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const piece = document.createElement("div");
      piece.classList.add("puzzle-piece");
      piece.style.width = pieceWidth + "px";
      piece.style.height = pieceHeight + "px";
      piece.style.backgroundImage = `url(${selectedImage})`;
      piece.style.backgroundSize = `${cols * pieceWidth}px ${rows * pieceHeight}px`;
      piece.style.backgroundPosition = `-${c * pieceWidth}px -${r * pieceHeight}px`;
      piece.dataset.correctX = c * pieceWidth;
      piece.dataset.correctY = r * pieceHeight;
      piece.dataset.placed = "false";

      piece.style.left = `${Math.random() * (room.clientWidth - pieceWidth)}px`;
      piece.style.top = `${Math.random() * (room.clientHeight - pieceHeight)}px`;

      room.appendChild(piece);
      makeDraggable(piece);
    }
  }
}

// Drag & drop logic
function makeDraggable(piece) {
  let shiftX, shiftY;

  piece.addEventListener("mousedown", function (e) {
    e.preventDefault();
    const roomRect = room.getBoundingClientRect();
    shiftX = e.clientX - piece.getBoundingClientRect().left;
    shiftY = e.clientY - piece.getBoundingClientRect().top;
    piece.style.zIndex = 1000;

    function moveAt(e) {
      const x = e.clientX - roomRect.left - shiftX;
      const y = e.clientY - roomRect.top - shiftY;
      piece.style.left = Math.max(0, Math.min(x, room.clientWidth - pieceWidth)) + "px";
      piece.style.top = Math.max(0, Math.min(y, room.clientHeight - pieceHeight)) + "px";
    }

    moveAt(e);
    document.addEventListener("mousemove", moveAt);

    document.addEventListener("mouseup", function onMouseUp() {
      document.removeEventListener("mousemove", moveAt);
      document.removeEventListener("mouseup", onMouseUp);
      piece.style.zIndex = 10;

      const correctX = parseFloat(piece.dataset.correctX);
      const correctY = parseFloat(piece.dataset.correctY);
      const currentX = parseFloat(piece.style.left);
      const currentY = parseFloat(piece.style.top);

      if (
        Math.abs(currentX - correctX) <= snapThreshold &&
        Math.abs(currentY - correctY) <= snapThreshold
      ) {
        if (piece.dataset.placed === "false") {
          correctCount++;
          piece.dataset.placed = "true";
          snapSound.play();
        }
        piece.style.left = correctX + "px";
        piece.style.top = correctY + "px";
        piece.classList.add("snapped");
      }

      if (correctCount === rows * cols) {
        message.style.display = "block";
        message.textContent = "🎉 Hurray! You solved the puzzle! 🎉";
        room.style.display = "none";
        const fullImage = document.getElementById("full-picture");
        fullImage.src = selectedImage;
        document.getElementById("final-image").style.display = "block";
      }
    });
  });
}
