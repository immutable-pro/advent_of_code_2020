/*
--- Part Two ---

The tile floor in the lobby is meant to be a living art exhibit. Every day, the tiles are all flipped according to the following rules:

    Any black tile with zero or more than 2 black tiles immediately adjacent to it is flipped to white.
    Any white tile with exactly 2 black tiles immediately adjacent to it is flipped to black.

Here, tiles immediately adjacent means the six tiles directly touching the tile in question.

The rules are applied simultaneously to every tile; put another way, it is first determined which tiles need to be flipped, then they are all flipped at the same time.

In the above example, the number of black tiles that are facing up after the given number of days has passed is as follows:

Day 1: 15
Day 2: 12
Day 3: 25
Day 4: 14
Day 5: 23
Day 6: 28
Day 7: 41
Day 8: 37
Day 9: 49
Day 10: 37

Day 20: 132
Day 30: 259
Day 40: 406
Day 50: 566
Day 60: 788
Day 70: 1106
Day 80: 1373
Day 90: 1844
Day 100: 2208

After executing this process a total of 100 times, there would be 2208 black tiles facing up.

How many tiles will be black after 100 days?

*/

import fs from 'fs';
const input = fs.readFileSync('./24/24.txt', 'utf-8').split('\n');

type Cardinal = 'e' | 'se' | 'sw' | 'w' | 'nw' | 'ne';
const CardinalDirections: Record<Cardinal, number[]> = {
    e: [+1, -1, 0],
    se: [0, -1, +1],
    sw: [-1, 0, +1],
    w: [-1, +1, 0],
    nw: [0, +1, -1],
    ne: [+1, 0, -1],
};
const Directions = Object.entries(CardinalDirections).map(([, direction]) => direction);

const addNeighbors = (tiles: Record<string, boolean>, tileStr: string) => {
    const tile = tileStr.split(',').map((coord) => parseInt(coord));
    for (const dir of Directions) {
        const neighborPos = `${tile[0] + dir[0]},${tile[1] + dir[1]},${tile[2] + dir[2]}`;
        if (!tiles[neighborPos]) {
            tiles[neighborPos] = false;
        }
    }
};

const countBlackNeighbors = (tileStr: string) => {
    const tile = tileStr.split(',').map((coord) => parseInt(coord));
    let count = 0;
    for (const dir of Directions) {
        if (count > 2) break;
        count += lobby[`${tile[0] + dir[0]},${tile[1] + dir[1]},${tile[2] + dir[2]}`] ? 1 : 0;
    }
    return count;
};

const steps = input.map((route) => {
    const steps: number[][] = [];
    let cardinal = '';
    for (let i = 0; i < route.length; i++) {
        cardinal += route[i];
        if (cardinal.length === 1) {
            if (cardinal === 'e' || cardinal === 'w') {
                steps.push(CardinalDirections[cardinal]);
                cardinal = '';
            }
        } else {
            steps.push(CardinalDirections[cardinal as Cardinal]);
            cardinal = '';
        }
    }
    return steps;
});

// False|undefined = white; True: black
let lobby: Record<string, boolean> = {};
steps.forEach((jumps) => {
    const tile = jumps.reduce(
        (dest, jump) => {
            dest[0] += jump[0];
            dest[1] += jump[1];
            dest[2] += jump[2];
            return dest;
        },
        [0, 0, 0]
    );
    // Flip
    const tileStr = `${tile[0]},${tile[1]},${tile[2]}`;
    if (lobby[tileStr]) {
        delete lobby[tileStr];
    } else {
        lobby[tileStr] = true;
    }
});

for (const tileStr in lobby) {
    addNeighbors(lobby, tileStr);
}

for (let d = 0; d < 100; d++) {
    const newLobby: Record<string, boolean> = {};

    for (const tileStr in lobby) {
        const color = lobby[tileStr];
        const blackNeighbors = countBlackNeighbors(tileStr);
        if (!color && blackNeighbors === 2) {
            newLobby[tileStr] = true;
            addNeighbors(newLobby, tileStr);
        } else if (color && blackNeighbors > 0 && blackNeighbors <= 2) {
            newLobby[tileStr] = true;
            addNeighbors(newLobby, tileStr);
        }
    }
    lobby = newLobby;
}

console.log(
    `Black side up tiles = ${Object.entries(lobby).reduce((count, [, color]) => (color ? count + 1 : count), 0)}`
);
