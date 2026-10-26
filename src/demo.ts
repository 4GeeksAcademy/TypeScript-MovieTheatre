// Console demo: runs the four test scenarios required by the project.
import {
  countSeats,
  createSeatingMatrix,
  describeAdjacentSeats,
  displaySeatingMatrix,
  findAdjacentSeats,
  reserveSeat,
} from "./cinema";

// Prints a section title so each test scenario is easy to spot in the output.
function printTitle(title: string): void {
  console.log("\n" + "=".repeat(50));
  console.log(title);
  console.log("=".repeat(50));
}

// Prints the room map, the seat counts and the adjacent-seat search result.
function printRoomSummary(matrix: number[][]): void {
  displaySeatingMatrix(matrix);
  const [occupied, available] = countSeats(matrix);
  console.log(`Occupied: ${occupied} | Available: ${available}`);
  console.log(describeAdjacentSeats(findAdjacentSeats(matrix)));
}

// Scenario 1: a brand new room where every seat is free.
printTitle("Scenario 1: Empty room");
const emptyRoom = createSeatingMatrix();
printRoomSummary(emptyRoom);

// Scenario 2: some seats are reserved, including a duplicate and an invalid request.
printTitle("Scenario 2: Partially filled room");
const partialRoom = createSeatingMatrix();
console.log(reserveSeat(partialRoom, 1, 1));
console.log(reserveSeat(partialRoom, 1, 2));
console.log(reserveSeat(partialRoom, 4, 5));
console.log(reserveSeat(partialRoom, 4, 6));
console.log(reserveSeat(partialRoom, 8, 10));
console.log(reserveSeat(partialRoom, 4, 5)); // already taken
console.log(reserveSeat(partialRoom, 9, 3)); // row does not exist
console.log(reserveSeat(partialRoom, 2, 0)); // seat does not exist
printRoomSummary(partialRoom);

// Scenario 3: every other seat is taken, so only single seats remain.
printTitle("Scenario 3: Nearly full room (only scattered single seats)");
const nearlyFullRoom = createSeatingMatrix();
for (let row = 1; row <= nearlyFullRoom.length; row++) {
  for (let seat = 1; seat <= nearlyFullRoom[row - 1].length; seat++) {
    // Leave a checkerboard of free seats, plus fill row 8 except one seat.
    const leaveFree = row < 8 ? (row + seat) % 2 === 0 : seat === 5;
    if (!leaveFree) {
      reserveSeat(nearlyFullRoom, row, seat);
    }
  }
}
printRoomSummary(nearlyFullRoom);

// Scenario 4: every seat is taken.
printTitle("Scenario 4: Full room");
const fullRoom = createSeatingMatrix();
for (let row = 1; row <= fullRoom.length; row++) {
  for (let seat = 1; seat <= fullRoom[row - 1].length; seat++) {
    reserveSeat(fullRoom, row, seat);
  }
}
printRoomSummary(fullRoom);
console.log(reserveSeat(fullRoom, 3, 3)); // trying to book in a full room

export {};
