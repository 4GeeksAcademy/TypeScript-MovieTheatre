// Web interface for the seat manager.
// All seat logic comes from cinema.ts; this file only draws the matrix
// and connects buttons to those functions.
import {
  OCCUPIED,
  countSeats,
  createSeatingMatrix,
  describeAdjacentSeats,
  findAdjacentSeats,
  reserveSeat,
} from "./cinema";

const STORAGE_KEY = "cinema-seating-matrix";

// Loads the saved matrix (stored as JSON) or starts with an empty room.
function loadSeatingMatrix(): number[][] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch {
    // Storage unavailable or corrupted: fall back to an empty room.
  }
  return createSeatingMatrix();
}

// Saves the matrix as JSON so reservations survive a page refresh.
function saveSeatingMatrix(matrix: number[][]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matrix));
  } catch {
    // Ignore: the page still works without saving.
  }
}

let seatingMatrix = loadSeatingMatrix();
// The pair found by "Find 2 seats together", as [[row, seat], [row, seat]].
let suggestedPair: number[][] | null = null;

const seatMap = document.querySelector<HTMLDivElement>("#seat-map")!;
const availableCount = document.querySelector<HTMLParagraphElement>("#available-count")!;
const occupiedCount = document.querySelector<HTMLParagraphElement>("#occupied-count")!;
const message = document.querySelector<HTMLParagraphElement>("#message")!;
const activityLog = document.querySelector<HTMLUListElement>("#activity-log")!;
const findPairButton = document.querySelector<HTMLButtonElement>("#find-pair")!;
const reservePairButton = document.querySelector<HTMLButtonElement>("#reserve-pair")!;
const resetRoomButton = document.querySelector<HTMLButtonElement>("#reset-room")!;

// Returns true when the given 1-based seat is part of the suggested pair.
function isSuggested(rowNumber: number, seatNumber: number): boolean {
  if (suggestedPair === null) {
    return false;
  }
  for (let i = 0; i < suggestedPair.length; i++) {
    if (suggestedPair[i][0] === rowNumber && suggestedPair[i][1] === seatNumber) {
      return true;
    }
  }
  return false;
}

// Shows a message to the staff and adds it to the activity log.
function showMessage(text: string): void {
  message.textContent = text;
  const entry = document.createElement("li");
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  entry.textContent = `${time} — ${text}`;
  activityLog.prepend(entry);
  while (activityLog.children.length > 8) {
    activityLog.lastElementChild!.remove();
  }
}

// Draws the seat grid with row labels on the left and seat numbers on top.
function renderSeatMap(): void {
  seatMap.innerHTML = "";
  const columns = seatingMatrix[0].length;

  const header = document.createElement("div");
  header.className = "mb-2 flex gap-1.5 pl-12";
  for (let seat = 1; seat <= columns; seat++) {
    const label = document.createElement("span");
    label.className = "w-9 text-center text-xs text-slate-500";
    label.textContent = String(seat);
    header.append(label);
  }
  seatMap.append(header);

  for (let row = 0; row < seatingMatrix.length; row++) {
    const rowElement = document.createElement("div");
    rowElement.className = "mb-1.5 flex items-center gap-1.5";

    const rowLabel = document.createElement("span");
    rowLabel.className = "w-12 pr-2 text-right text-xs text-slate-500";
    rowLabel.textContent = `Row ${row + 1}`;
    rowElement.append(rowLabel);

    for (let seat = 0; seat < columns; seat++) {
      const rowNumber = row + 1;
      const seatNumber = seat + 1;
      const occupied = seatingMatrix[row][seat] === OCCUPIED;

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = occupied ? "X" : "L";
      button.title = `Row ${rowNumber}, seat ${seatNumber} — ${occupied ? "occupied" : "available"}`;

      let color = "bg-emerald-500 text-emerald-950 hover:bg-emerald-400";
      if (occupied) {
        color = "bg-rose-500/80 text-rose-950 cursor-not-allowed";
      } else if (isSuggested(rowNumber, seatNumber)) {
        color = "bg-amber-400 text-amber-950 ring-2 ring-amber-200";
      }
      button.className = `h-9 w-9 rounded-t-lg rounded-b-sm text-sm font-bold transition ${color}`;

      button.addEventListener("click", () => handleSeatClick(rowNumber, seatNumber));
      rowElement.append(button);
    }
    seatMap.append(rowElement);
  }
}

// Refreshes the counters, seat map and pair button after any change.
function render(): void {
  const [occupied, available] = countSeats(seatingMatrix);
  occupiedCount.textContent = String(occupied);
  availableCount.textContent = String(available);
  reservePairButton.hidden = suggestedPair === null;
  renderSeatMap();
}

// Reserves the clicked seat; reserveSeat already rejects taken seats.
function handleSeatClick(rowNumber: number, seatNumber: number): void {
  showMessage(reserveSeat(seatingMatrix, rowNumber, seatNumber));
  suggestedPair = null;
  saveSeatingMatrix(seatingMatrix);
  render();
}

findPairButton.addEventListener("click", () => {
  suggestedPair = findAdjacentSeats(seatingMatrix);
  showMessage(describeAdjacentSeats(suggestedPair));
  render();
});

reservePairButton.addEventListener("click", () => {
  if (suggestedPair === null) {
    return;
  }
  for (let i = 0; i < suggestedPair.length; i++) {
    showMessage(reserveSeat(seatingMatrix, suggestedPair[i][0], suggestedPair[i][1]));
  }
  suggestedPair = null;
  saveSeatingMatrix(seatingMatrix);
  render();
});

resetRoomButton.addEventListener("click", () => {
  seatingMatrix = createSeatingMatrix();
  suggestedPair = null;
  saveSeatingMatrix(seatingMatrix);
  showMessage("🧹 Room reset: all 80 seats are available.");
  render();
});

render();
