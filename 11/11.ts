/*
--- Day 11: Seating System ---

Your plane lands with plenty of time to spare. The final leg of your journey is a ferry that goes directly to the tropical island where you can finally start your vacation. As you reach the waiting area to board the ferry, you realize you're so early, nobody else has even arrived yet!

By modeling the process people use to choose (or abandon) their seat in the waiting area, you're pretty sure you can predict the best place to sit. You make a quick map of the seat layout (your puzzle input).

The seat layout fits neatly on a grid. Each position is either floor (.), an empty seat (L), or an occupied seat (#). For example, the initial seat layout might look like this:

L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL

Now, you just need to model the people who will be arriving shortly. Fortunately, people are entirely predictable and always follow a simple set of rules. All decisions are based on the number of occupied seats adjacent to a given seat (one of the eight positions immediately up, down, left, right, or diagonal from the seat). The following rules are applied to every seat simultaneously:

    If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
    If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
    Otherwise, the seat's state does not change.

Floor (.) never changes; seats don't move, and nobody sits on the floor.

After one round of these rules, every seat in the example layout becomes occupied:

#.##.##.##
#######.##
#.#.#..#..
####.##.##
#.##.##.##
#.#####.##
..#.#.....
##########
#.######.#
#.#####.##

After a second round, the seats with four or more occupied adjacent seats become empty again:

#.LL.L#.##
#LLLLLL.L#
L.L.L..L..
#LLL.LL.L#
#.LL.LL.LL
#.LLLL#.##
..L.L.....
#LLLLLLLL#
#.LLLLLL.L
#.#LLLL.##

This process continues for three more rounds:

#.##.L#.##
#L###LL.L#
L.#.#..#..
#L##.##.L#
#.##.LL.LL
#.###L#.##
..#.#.....
#L######L#
#.LL###L.L
#.#L###.##

#.#L.L#.##
#LLL#LL.L#
L.L.L..#..
#LLL.##.L#
#.LL.LL.LL
#.LL#L#.##
..L.L.....
#L#LLLL#L#
#.LLLLLL.L
#.#L#L#.##

#.#L.L#.##
#LLL#LL.L#
L.#.L..#..
#L##.##.L#
#.#L.LL.LL
#.#L#L#.##
..L.L.....
#L#L##L#L#
#.LLLLLL.L
#.#L#L#.##

At this point, something interesting happens: the chaos stabilizes and further applications of these rules cause no seats to change state! Once people stop moving around, you count 37 occupied seats.

Simulate your seating area by applying the seating rules repeatedly until no seats change state. How many seats end up occupied?

*/

import fs from 'fs';
const data = fs.readFileSync('./11.txt', 'utf-8');

type SeatState = -1 | 0 | 1;
type SeatingPlan = SeatState[][];

const floor = -1;
const free = 0;
const occupied = 1;

const initialSeats: SeatingPlan = data
    .split('\n')
    .map((row) =>
        row.split('').map((seat) => (seat === '.' ? floor : occupied))
    );

const adjacentPositions = Object.freeze([
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
]);

export const logSeats = (seatingPlan: SeatingPlan): void => {
    seatingPlan.forEach((row) =>
        console.log(
            row.reduce<string>((prev, state) => {
                switch (state) {
                    case occupied:
                        return `${prev}#`;
                    case free:
                        return `${prev}L`;
                    case floor:
                        return `${prev}.`;
                }
            }, '')
        )
    );
    console.log('==================');
};

const areAdjacentSeatsBusy = (seatingPlan: SeatingPlan, r: number, c: number) =>
    adjacentPositions.find(
        ([x, y]) => seatingPlan[r + x] && seatingPlan[r + x][c + y] === occupied
    ) !== undefined;

const areAtLeast4AdjacentSeatsBusy = (
    seatingPlan: SeatingPlan,
    r: number,
    c: number
) => {
    let count = 0;
    for (const [x, y] of adjacentPositions) {
        if (count === 4) break;
        if (seatingPlan[r + x] && seatingPlan[r + x][c + y] === occupied) {
            count++;
        }
    }
    return count === 4;
};

const changeYourMind = (seatingPlan: SeatingPlan): [number, SeatingPlan] => {
    let changes = 0;
    const newSeatingPlan = seatingPlan.map((row, r) =>
        row.map((seatState, c) => {
            if (
                seatState === occupied &&
                areAtLeast4AdjacentSeatsBusy(seatingPlan, r, c)
            ) {
                changes++;
                return free;
            }
            return seatState;
        })
    );

    return [changes, newSeatingPlan];
};

const occupySeats = (seatingPlan: SeatingPlan): [number, SeatingPlan] => {
    let changes = 0;
    const newSeatingPlan = seatingPlan.map((row, r) =>
        row.map((seatState, c) => {
            if (
                seatState === free &&
                !areAdjacentSeatsBusy(seatingPlan, r, c)
            ) {
                changes++;
                return occupied;
            }
            return seatState;
        })
    );

    return [changes, newSeatingPlan];
};

const countOccupiedSeats = (seatingPlan: SeatingPlan) =>
    seatingPlan.reduce<number>(
        (prev, row) =>
            (prev += row.filter((seatState) => seatState === occupied).length),
        0
    );

let seatingPlan = initialSeats,
    changes = 1;

while (changes !== 0) {
    //   logSeats(seatingPlan);
    [changes, seatingPlan] = changeYourMind(seatingPlan);
    if (changes === 0) break;
    //   logSeats(seatingPlan);
    [changes, seatingPlan] = occupySeats(seatingPlan);
}

console.log(countOccupiedSeats(seatingPlan));
