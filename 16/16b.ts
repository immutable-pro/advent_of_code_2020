/*
--- Part Two ---

Now that you've identified which tickets contain invalid values, discard those tickets entirely. Use the remaining valid tickets to determine which field is which.

Using the valid ranges for each field, determine what order the fields appear on the tickets. The order is consistent between all tickets: if seat is the third field, it is the third field on every ticket, including your ticket.

For example, suppose you have the following notes:

class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9

Based on the nearby tickets in the above example, the first position must be row, the second position must be class, and the third position must be seat; you can conclude that in your ticket, class is 12, row is 11, and seat is 13.

Once you work out which field is which, look for the six fields on your ticket that start with the word departure. What do you get if you multiply those six values together?

*/

import fs from 'fs';
const data = fs.readFileSync('./16/16.txt', 'utf-8').split('\n');

interface ValuesRange {
    from: number;
    to: number;
}

const fieldRanges = new Map<string, { a: ValuesRange; b: ValuesRange }>();

// Parse fields and collect 'departure' ones
let pointer = 0;
const validFieldValues: number[] = [];
for (; pointer < data.length; pointer++) {
    const line = data[pointer];
    if (line === '') break;

    const [field, valuesRanges] = line.split(': ');
    const rangeA: ValuesRange = { from: 0, to: 0 },
        rangeB: ValuesRange = { from: 0, to: 0 };
    valuesRanges.split(' or ').forEach((range, i) => {
        const [start, end] = range.split('-').map((n) => parseInt(n));
        for (let i = start; i <= end; i++) {
            validFieldValues[i] = i;
        }
        if (i === 1) {
            rangeB.from = start;
            rangeB.to = end;
        } else {
            rangeA.from = start;
            rangeA.to = end;
        }
    });

    fieldRanges.set(field, { a: rangeA, b: rangeB });
}

const validNearbyTickets = data
    .slice(pointer + 5, data.length)
    .map((line) => line.split(',').map((str) => parseInt(str, 10)))
    .filter((values) => values.find((value) => validFieldValues[value] === undefined) === undefined);

const myTicket = data[pointer + 2].split(',').map((str) => parseInt(str, 10));
validNearbyTickets.push(myTicket);

const fieldColumns = new Map<string, Set<number>>();
for (let j = 0; j < validNearbyTickets[0].length; j++) {
    for (const [field, { a, b }] of fieldRanges) {
        let valid = true;
        for (let i = 0; i < validNearbyTickets.length; ++i) {
            const value = validNearbyTickets[i][j];
            if (!((a.from <= value && value <= a.to) || (b.from <= value && value <= b.to))) {
                valid = false;
                break;
            }
        }
        if (valid) {
            let columns = fieldColumns.get(field);
            if (columns) {
                columns.add(j);
            } else {
                columns = new Set<number>([j]);
                fieldColumns.set(field, columns);
            }
        }
    }
}
const sortedFieldColumns = [...fieldColumns.entries()].sort((a, b) => a[1].size - b[1].size);

for (let k = 0; k < sortedFieldColumns.length - 1; k++) {
    const next = sortedFieldColumns[k];
    for (let i = k + 1; i < sortedFieldColumns.length; i++) {
        sortedFieldColumns[i][1].delete([...next[1].values()][0]);
    }
}

const result = sortedFieldColumns
    .filter(([field]) => field.startsWith('departure '))
    .map(([, columns]) => [...columns.values()][0])
    .reduce<number>((prev, column) => prev * myTicket[column], 1);

console.log(result);
