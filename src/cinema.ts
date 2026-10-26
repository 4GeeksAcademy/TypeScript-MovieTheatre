// Cinema seat reservation logic.
// The screening room is a 2D array (matrix) of numbers:
//   0 = available seat, 1 = occupied seat.
// Staff use 1-based row/column numbers (row 1, seat 1 is the top-left corner),
// while the matrix itself is indexed from 0.

export const ROWS = 8;
export const SEATS_PER_ROW = 10;

export const AVAILABLE = 0;
export const OCCUPIED = 1;

// Creates a new seating matrix with every seat available (all zeros).
export function createSeatingMatrix(rows: number = ROWS, seatsPerRow: number = SEATS_PER_ROW): number[][] {
  const matrix: number[][] = [];
  for (let row = 0; row < rows; row++) {
    const seats: number[] = [];
    for (let seat = 0; seat < seatsPerRow; seat++) {
      seats.push(AVAILABLE);
    }
    matrix.push(seats);
  }
  return matrix;
}

// Builds a printable map of the room: X = occupied, L = available,
// with column numbers across the top and row numbers down the left side.
export function formatSeatingMatrix(matrix: number[][]): string {
  const lines: string[] = [];

  let header = "       ";
  for (let seat = 1; seat <= matrix[0].length; seat++) {
    header += String(seat).padStart(3, " ");
  }
  lines.push(header);
  lines.push("            ----- SCREEN -----");

  for (let row = 0; row < matrix.length; row++) {
    let line = `Row ${String(row + 1).padStart(2, " ")} `;
    for (let seat = 0; seat < matrix[row].length; seat++) {
      const symbol = matrix[row][seat] === OCCUPIED ? "X" : "L";
      line += symbol.padStart(3, " ");
    }
    lines.push(line);
  }

  lines.push("Legend: L = available, X = occupied");
  return lines.join("\n");
}

// Prints the current state of the screening room to the console.
export function displaySeatingMatrix(matrix: number[][]): void {
  console.log(formatSeatingMatrix(matrix));
}

// Returns true when the 1-based row and seat numbers exist in the room.
export function isValidSeat(matrix: number[][], rowNumber: number, seatNumber: number): boolean {
  if (!Number.isInteger(rowNumber) || !Number.isInteger(seatNumber)) {
    return false;
  }
  if (rowNumber < 1 || rowNumber > matrix.length) {
    return false;
  }
  return seatNumber >= 1 && seatNumber <= matrix[rowNumber - 1].length;
}

// Reserves a seat (1-based row and seat numbers) by changing it from 0 to 1.
// Returns a message saying whether the reservation succeeded or why it failed.
export function reserveSeat(matrix: number[][], rowNumber: number, seatNumber: number): string {
  if (!isValidSeat(matrix, rowNumber, seatNumber)) {
    return `❌ Row ${rowNumber}, seat ${seatNumber} does not exist. Rows go from 1 to ${matrix.length} and seats from 1 to ${matrix[0].length}.`;
  }

  const rowIndex = rowNumber - 1;
  const seatIndex = seatNumber - 1;

  if (matrix[rowIndex][seatIndex] === OCCUPIED) {
    return `❌ Row ${rowNumber}, seat ${seatNumber} is already taken.`;
  } else {
    matrix[rowIndex][seatIndex] = OCCUPIED;
    return `✅ Reservation confirmed: row ${rowNumber}, seat ${seatNumber}.`;
  }
}

// Counts the seats in the whole room.
// Returns [occupiedCount, availableCount].
export function countSeats(matrix: number[][]): [number, number] {
  let occupied = 0;
  let available = 0;
  for (let row = 0; row < matrix.length; row++) {
    for (let seat = 0; seat < matrix[row].length; seat++) {
      if (matrix[row][seat] === OCCUPIED) {
        occupied++;
      } else {
        available++;
      }
    }
  }
  return [occupied, available];
}

// Searches row by row, left to right, for two available seats side by side.
// Returns the first pair found as [[row, seat], [row, seat]] using 1-based
// numbers, or null when no adjacent pair is available anywhere in the room.
export function findAdjacentSeats(matrix: number[][]): number[][] | null {
  for (let row = 0; row < matrix.length; row++) {
    for (let seat = 0; seat < matrix[row].length - 1; seat++) {
      if (matrix[row][seat] === AVAILABLE && matrix[row][seat + 1] === AVAILABLE) {
        return [
          [row + 1, seat + 1],
          [row + 1, seat + 2],
        ];
      }
    }
  }
  return null;
}

// Turns the result of findAdjacentSeats into a message for the staff.
export function describeAdjacentSeats(pair: number[][] | null): string {
  if (pair === null) {
    return "❌ No two adjacent seats are available in any row.";
  }
  return `💑 Adjacent seats found: row ${pair[0][0]}, seats ${pair[0][1]} and ${pair[1][1]}.`;
}
