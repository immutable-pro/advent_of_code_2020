/*
--- Part Two ---

For some reason, your simulated results don't match what the experimental energy source engineers expected. Apparently, the pocket dimension actually has four spatial dimensions, not three.

The pocket dimension contains an infinite 4-dimensional grid. At every integer 4-dimensional coordinate (x,y,z,w), there exists a single cube (really, a hypercube) which is still either active or inactive.

Each cube only ever considers its neighbors: any of the 80 other cubes where any of their coordinates differ by at most 1. For example, given the cube at x=1,y=2,z=3,w=4, its neighbors include the cube at x=2,y=2,z=3,w=3, the cube at x=0,y=2,z=3,w=4, and so on.

The initial state of the pocket dimension still consists of a small flat region of cubes. Furthermore, the same rules for cycle updating still apply: during each cycle, consider the number of active neighbors of each cube.

For example, consider the same initial state as in the example above. Even though the pocket dimension is 4-dimensional, this initial state represents a small 2-dimensional slice of it. (In particular, this initial state defines a 3x3x1x1 region of the 4-dimensional space.)

Simulating a few cycles from this initial state produces the following configurations, where the result of each cycle is shown layer-by-layer at each given z and w coordinate:

Before any cycles:

z=0, w=0
.#.
..#
###


After 1 cycle:

z=-1, w=-1
#..
..#
.#.

z=0, w=-1
#..
..#
.#.

z=1, w=-1
#..
..#
.#.

z=-1, w=0
#..
..#
.#.

z=0, w=0
#.#
.##
.#.

z=1, w=0
#..
..#
.#.

z=-1, w=1
#..
..#
.#.

z=0, w=1
#..
..#
.#.

z=1, w=1
#..
..#
.#.


After 2 cycles:

z=-2, w=-2
.....
.....
..#..
.....
.....

z=-1, w=-2
.....
.....
.....
.....
.....

z=0, w=-2
###..
##.##
#...#
.#..#
.###.

z=1, w=-2
.....
.....
.....
.....
.....

z=2, w=-2
.....
.....
..#..
.....
.....

z=-2, w=-1
.....
.....
.....
.....
.....

z=-1, w=-1
.....
.....
.....
.....
.....

z=0, w=-1
.....
.....
.....
.....
.....

z=1, w=-1
.....
.....
.....
.....
.....

z=2, w=-1
.....
.....
.....
.....
.....

z=-2, w=0
###..
##.##
#...#
.#..#
.###.

z=-1, w=0
.....
.....
.....
.....
.....

z=0, w=0
.....
.....
.....
.....
.....

z=1, w=0
.....
.....
.....
.....
.....

z=2, w=0
###..
##.##
#...#
.#..#
.###.

z=-2, w=1
.....
.....
.....
.....
.....

z=-1, w=1
.....
.....
.....
.....
.....

z=0, w=1
.....
.....
.....
.....
.....

z=1, w=1
.....
.....
.....
.....
.....

z=2, w=1
.....
.....
.....
.....
.....

z=-2, w=2
.....
.....
..#..
.....
.....

z=-1, w=2
.....
.....
.....
.....
.....

z=0, w=2
###..
##.##
#...#
.#..#
.###.

z=1, w=2
.....
.....
.....
.....
.....

z=2, w=2
.....
.....
..#..
.....
.....

After the full six-cycle boot process completes, 848 cubes are left in the active state.

Starting with your given initial configuration, simulate six cycles in a 4-dimensional space. How many cubes are left in the active state after the sixth cycle?

*/

import fs from 'fs';

interface Limits {
    from: number;
    to: number;
}

interface State {
    cubes: Record<string, boolean>;
    x: Limits;
    y: Limits;
    z: Limits;
    w: Limits;
}

const initialState: State = {
    cubes: {},
    x: { from: 0, to: 0 },
    y: { from: 0, to: 0 },
    z: { from: 0, to: 0 },
    w: { from: 0, to: 0 },
};

let lines = 0,
    columns = 0;
fs.readFileSync('./17/17.txt', 'utf-8')
    .split('\n')
    .forEach((s, x) => {
        lines++;
        columns = s.length;
        s.split('').forEach((cube, y) => {
            if (cube === '#') {
                initialState.cubes[`0,0,${x},${y}`] = true;
            }
        });
    });

initialState.x.to = lines;
initialState.y.to = columns;

const neighbors: number[][] = [];
for (let x = -1; x < 2; x++)
    for (let y = -1; y < 2; y++)
        for (let z = -1; z < 2; z++)
            for (let w = -1; w < 2; w++) {
                if (x === 0 && y === 0 && z === 0 && w === 0) continue;
                neighbors.push([x, y, z, w]);
            }

const countActiveNeighbors = (cubes: Record<string, boolean>, z: number, w: number, x: number, y: number): number => {
    let active = 0;
    for (const diff of neighbors) {
        active += cubes[`${z + diff[0]},${w + diff[1]},${x + diff[2]},${y + diff[3]}`] ? 1 : 0;
        if (active === 4) return active;
    }
    return active;
};

const iterate = (state: State): State => {
    const newState: State = { ...state, cubes: {} };
    newState.z.from -= 1;
    newState.z.to += 1;
    newState.w.from -= 1;
    newState.w.to += 1;
    newState.x.from -= 1;
    newState.x.to += 1;
    newState.y.from -= 1;
    newState.y.to += 1;

    for (let z = newState.z.from; z <= newState.z.to; z++)
        for (let w = newState.z.from; w <= newState.w.to; w++)
            for (let x = newState.x.from; x <= newState.x.to; x++)
                for (let y = newState.y.from; y <= newState.y.to; y++) {
                    const count = countActiveNeighbors(state.cubes, z, w, x, y);
                    const pos = `${z},${w},${x},${y}`;
                    const active = state.cubes[pos];
                    if (active) {
                        if (count === 2 || count === 3) {
                            newState.cubes[pos] = true;
                        }
                    } else {
                        if (count === 3) {
                            newState.cubes[pos] = true;
                        }
                    }
                }

    return newState;
};

let state = initialState;
for (let i = 0; i < 6; i++) {
    state = iterate(state);
}

console.log(Object.entries(state.cubes).length);
