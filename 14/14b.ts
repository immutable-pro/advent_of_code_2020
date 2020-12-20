/*
--- Part Two ---

For some reason, the sea port's computer system still can't communicate with your ferry's docking program. It must be using version 2 of the decoder chip!

A version 2 decoder chip doesn't modify the values being written at all. Instead, it acts as a memory address decoder. Immediately before a value is written to memory, each bit in the bitmask modifies the corresponding bit of the destination memory address in the following way:

    If the bitmask bit is 0, the corresponding memory address bit is unchanged.
    If the bitmask bit is 1, the corresponding memory address bit is overwritten with 1.
    If the bitmask bit is X, the corresponding memory address bit is floating.

A floating bit is not connected to anything and instead fluctuates unpredictably. In practice, this means the floating bits will take on all possible values, potentially causing many memory addresses to be written all at once!

For example, consider the following program:

mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1

When this program goes to write to memory address 42, it first applies the bitmask:

address: 000000000000000000000000000000101010  (decimal 42)
mask:    000000000000000000000000000000X1001X
result:  000000000000000000000000000000X1101X

After applying the mask, four bits are overwritten, three of which are different, and two of which are floating. Floating bits take on every possible combination of values; with two floating bits, four actual memory addresses are written:

000000000000000000000000000000011010  (decimal 26)
000000000000000000000000000000011011  (decimal 27)
000000000000000000000000000000111010  (decimal 58)
000000000000000000000000000000111011  (decimal 59)

Next, the program is about to write to memory address 26 with a different bitmask:

address: 000000000000000000000000000000011010  (decimal 26)
mask:    00000000000000000000000000000000X0XX
result:  00000000000000000000000000000001X0XX

This results in an address with three floating bits, causing writes to eight memory addresses:

000000000000000000000000000000010000  (decimal 16)
000000000000000000000000000000010001  (decimal 17)
000000000000000000000000000000010010  (decimal 18)
000000000000000000000000000000010011  (decimal 19)
000000000000000000000000000000011000  (decimal 24)
000000000000000000000000000000011001  (decimal 25)
000000000000000000000000000000011010  (decimal 26)
000000000000000000000000000000011011  (decimal 27)

The entire 36-bit address space still begins initialized to the value 0 at every address, and you still need the sum of all values left in memory at the end of the program. In this example, the sum is 208.

Execute the initialization program using an emulator for a version 2 decoder chip. What is the sum of all values left in memory after it completes?

*/

import fs from 'fs';
const data = fs.readFileSync('./14/14.txt', 'utf-8');
const lines = Object.freeze(data.split('\n'));

const maskRegex = /^(mask)\s=\s([01X]{36})$/;
const memRegex = /^(mem)\[([0-9]+)\]\s=\s([0-9]+)$/;

const mem = new Map<bigint, bigint>();
const maskLength = 36;

const calculateMask = (mask: string): [bigint, bigint, number] => {
    let m1 = 0n,
        mx = 0n,
        nx = 0;
    for (let i = 0; i < mask.length; i++) {
        const bit = mask[i];
        const bitMask = 1n << BigInt(mask.length - 1 - i);
        switch (bit) {
            case '1':
                m1 |= bitMask;
                break;
            case 'X':
                mx |= bitMask;
                nx++;
                break;
        }
    }

    // Note: nx is just the number of X
    return [m1, mx, nx];
};

const apply = (m1: bigint, mx: bigint, nx: number, memPos: bigint, value: bigint): void => {
    const newMemPos = memPos | m1;

    const newPositions = new Set<bigint>();
    const combinations = 1 << nx;

    for (let combination = 0; combination < combinations && newPositions.size < combinations; combination++) {
        let combinationBitIndx = 0;
        let finalMemPos = newMemPos;
        for (let j = 0n; j < maskLength && combinationBitIndx < nx; j++) {
            // Find in the mask an X (a 1, actually)
            if (mx & (1n << j)) {
                const combinationMask = combination & (1 << combinationBitIndx++);
                // | sets the bit to 1. &~ sets the bit to 0 (clear the bit)
                finalMemPos = combinationMask ? finalMemPos | (1n << j) : finalMemPos & ~(1n << j);
                newPositions.add(finalMemPos);
            }
        }
    }

    for (const pos of newPositions) {
        mem.set(pos, value);
    }
};

let m1: bigint, mx: bigint, nx: number;
lines.forEach((line) => {
    const tokens = maskRegex.exec(line) ?? memRegex.exec(line);
    if (!tokens) throw 'Wrong input';

    if (tokens[1] === 'mask') {
        [m1, mx, nx] = calculateMask(tokens[2]);
    } else {
        apply(m1, mx, nx, BigInt(tokens[2]) /* memPos */, BigInt(tokens[3]) /* value */);
    }
});

let result = 0n;
for (const value of mem.values()) {
    result += value;
}

console.log(result);
