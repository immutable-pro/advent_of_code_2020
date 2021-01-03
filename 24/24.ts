/*
--- Day 24: Lobby Layout ---

Your raft makes it to the tropical island; it turns out that the small crab was an excellent navigator. You make your way to the resort.

As you enter the lobby, you discover a small problem: the floor is being renovated. You can't even reach the check-in desk until they've finished installing the new tile floor.

The tiles are all hexagonal; they need to be arranged in a hex grid with a very specific color pattern. Not in the mood to wait, you offer to help figure out the pattern.

The tiles are all white on one side and black on the other. They start with the white side facing up. The lobby is large enough to fit whatever pattern might need to appear there.

A member of the renovation crew gives you a list of the tiles that need to be flipped over (your puzzle input). Each line in the list identifies a single tile that needs to be flipped by giving a series of steps starting from a reference tile in the very center of the room. (Every line starts from the same reference tile.)

Because the tiles are hexagonal, every tile has six neighbors: east, southeast, southwest, west, northwest, and northeast. These directions are given in your list, respectively, as e, se, sw, w, nw, and ne. A tile is identified by a series of these directions with no delimiters; for example, esenee identifies the tile you land on if you start at the reference tile and then move one tile east, one tile southeast, one tile northeast, and one tile east.

Each time a tile is identified, it flips from white to black or from black to white. Tiles might be flipped more than once. For example, a line like esew flips a tile immediately adjacent to the reference tile, and a line like nwwswee flips the reference tile itself.

Here is a larger example:

sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew

In the above example, 10 tiles are flipped once (to black), and 5 more are flipped twice (to black, then back to white). After all of these instructions have been followed, a total of 10 tiles are black.

Go through the renovation crew's list and determine which tiles they need to flip. After all of the instructions have been followed, how many tiles are left with the black side up?

*/

import fs from 'fs';
const input = fs.readFileSync('./24/24.txt', 'utf-8').split('\n');

type Cardinal = 'e' | 'se' | 'sw' | 'w' | 'nw' | 'ne';
const Directions: Record<Cardinal, number[]> = {
    e: [+1, -1, 0],
    se: [0, -1, +1],
    sw: [-1, 0, +1],
    w: [-1, +1, 0],
    nw: [0, +1, -1],
    ne: [+1, 0, -1],
};

const steps = input.map((route) => {
    const steps: number[][] = [];
    let cardinal = '';
    for (let i = 0; i < route.length; i++) {
        cardinal += route[i];
        if (cardinal.length === 1) {
            if (cardinal === 'e' || cardinal === 'w') {
                steps.push(Directions[cardinal]);
                cardinal = '';
            }
        } else {
            steps.push(Directions[cardinal as Cardinal]);
            cardinal = '';
        }
    }
    return steps;
});

// False|undefined = white; True: black
const lobby: Record<string, boolean> = {};
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
    lobby[tileStr] = lobby[tileStr] ? false : true;
});

console.log(
    `Black side up tiles = ${Object.entries(lobby).reduce((count, [, color]) => (color ? count + 1 : count), 0)}`
);
