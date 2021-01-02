/* eslint-disable @typescript-eslint/no-non-null-assertion */
/*
--- Part Two ---

Due to what you can only assume is a mistranslation (you're not exactly fluent in Crab), you are quite surprised when the crab starts arranging many cups in a circle on your raft - one million (1000000) in total.

Your labeling is still correct for the first few cups; after that, the remaining cups are just numbered in an increasing fashion starting from the number after the highest number in your list and proceeding one by one until one million is reached. (For example, if your labeling were 54321, the cups would be numbered 5, 4, 3, 2, 1, and then start counting up from 6 until one million is reached.) In this way, every number from one through one million is used exactly once.

After discovering where you made the mistake in translating Crab Numbers, you realize the small crab isn't going to do merely 100 moves; the crab is going to do ten million (10000000) moves!

The crab is going to hide your stars - one each - under the two cups that will end up immediately clockwise of cup 1. You can have them if you predict what the labels on those cups will be when the crab is finished.

In the above example (389125467), this would be 934001 and then 159792; multiplying these together produces 149245887792.

Determine which two cups will end up immediately clockwise of cup 1. What do you get if you multiply their labels together?

*/

import { crabMoveCups, createCupPointers, Cup } from './23';

const input = 318946572;
// const input = 389125467; // Test
const cups = `${input}`.split('').map((cup) => parseInt(cup));

const createCupsList = (cups: number[]): Cup => {
    const first: Cup = { label: cups[0] };
    let pointer: Cup = first;
    cups.forEach((c, i) => {
        if (i !== 0) {
            const newCup: Cup = { label: c };
            pointer.sig = newCup;
            newCup.prev = pointer;
            pointer = newCup;
        }
    });
    // Add cups from 10 to 1000000
    for (let c = 10; c <= 1000000; c++) {
        const newCup: Cup = { label: c };
        pointer.sig = newCup;
        newCup.prev = pointer;
        pointer = newCup;
    }

    pointer.sig = first;
    first.prev = pointer;
    return first;
};

const findCup1 = (startCup: Cup): Cup => {
    let next = startCup;
    while (next.label !== 1) {
        next = next.sig!;
    }
    return next;
};

const hrstart = process.hrtime();
const cupsList = createCupsList(cups);
const cupPointers = createCupPointers(cupsList);
const cup = crabMoveCups(cupsList, 10000000, 1000000, cupPointers);
const cup1 = findCup1(cup);
const hrend = process.hrtime(hrstart);
console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
console.log(`Second part: ${cup1.sig!.label * cup1.sig!.sig!.label}`);
