/*
--- Part Two ---

Ding! The "fasten seat belt" signs have turned on. Time to find your seat.

It's a completely full flight, so your seat should be the only missing boarding pass in your list. However, there's a catch: some of the seats at the very front and back of the plane don't exist on this aircraft, so they'll be missing from your list as well.

Your seat wasn't at the very front or back, though; the seats with IDs +1 and -1 from yours will be in your list.

What is the ID of your seat?
*/

import fs from 'fs';
const data = fs.readFileSync('./05.txt', 'utf-8');
const lines = data.split('\n');

const getRow = (card: string) =>
    parseInt(card.substr(0, 7).replace(/F/g, '0').replace(/B/g, '1'), 2);
const getCol = (card: string) =>
    parseInt(card.substr(7, 10).replace(/L/g, '0').replace(/R/g, '1'), 2);

const seatIds = lines.reduce<number[]>((ids, line) => {
    const id = getRow(line) * 8 + getCol(line);
    ids[id] = id;
    return ids;
}, []);

for (let i = 0; i < seatIds.length - 1; i++) {
    if (seatIds[i - 1] && seatIds[i + 1] && !seatIds[i]) {
        console.log(i);
        break;
    }
}
