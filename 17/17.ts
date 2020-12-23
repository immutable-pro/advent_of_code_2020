/*
--- Day 17: Conway Cubes ---

As your flight slowly drifts through the sky, the Elves at the Mythical Information Bureau at the North Pole contact you. They'd like some help debugging a malfunctioning experimental energy source aboard one of their super-secret imaging satellites.

The experimental energy source is based on cutting-edge technology: a set of Conway Cubes contained in a pocket dimension! When you hear it's having problems, you can't help but agree to take a look.

The pocket dimension contains an infinite 3-dimensional grid. At every integer 3-dimensional coordinate (x,y,z), there exists a single cube which is either active or inactive.

In the initial state of the pocket dimension, almost all cubes start inactive. The only exception to this is a small flat region of cubes (your puzzle input); the cubes in this region start in the specified active (#) or inactive (.) state.

The energy source then proceeds to boot up by executing six cycles.

Each cube only ever considers its neighbors: any of the 26 other cubes where any of their coordinates differ by at most 1. For example, given the cube at x=1,y=2,z=3, its neighbors include the cube at x=2,y=2,z=2, the cube at x=0,y=2,z=3, and so on.

During a cycle, all cubes simultaneously change their state according to the following rules:

    If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. Otherwise, the cube becomes inactive.
    If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. Otherwise, the cube remains inactive.

The engineers responsible for this experimental energy source would like you to simulate the pocket dimension and determine what the configuration of cubes should be at the end of the six-cycle boot process.

For example, consider the following initial state:

.#.
..#
###

Even though the pocket dimension is 3-dimensional, this initial state represents a small 2-dimensional slice of it. (In particular, this initial state defines a 3x3x1 region of the 3-dimensional space.)

Simulating a few cycles from this initial state produces the following configurations, where the result of each cycle is shown layer-by-layer at each given z coordinate (and the frame of view follows the active cells in each cycle):

Before any cycles:

z=0
.#.
..#
###


After 1 cycle:

z=-1
#..
..#
.#.

z=0
#.#
.##
.#.

z=1
#..
..#
.#.


After 2 cycles:

z=-2
.....
.....
..#..
.....
.....

z=-1
..#..
.#..#
....#
.#...
.....

z=0
##...
##...
#....
....#
.###.

z=1
..#..
.#..#
....#
.#...
.....

z=2
.....
.....
..#..
.....
.....


After 3 cycles:

z=-2
.......
.......
..##...
..###..
.......
.......
.......

z=-1
..#....
...#...
#......
.....##
.#...#.
..#.#..
...#...

z=0
...#...
.......
#......
.......
.....##
.##.#..
...#...

z=1
..#....
...#...
#......
.....##
.#...#.
..#.#..
...#...

z=2
.......
.......
..##...
..###..
.......
.......
.......

After the full six-cycle boot process completes, 112 cubes are left in the active state.

Starting with your given initial configuration, simulate six cycles. How many cubes are left in the active state after the sixth cycle?
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
}

const initialState: State = {
    cubes: {},
    x: { from: 0, to: 0 },
    y: { from: 0, to: 0 },
    z: { from: 0, to: 0 },
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
                initialState.cubes[`0,${x},${y}`] = true;
            }
        });
    });

initialState.x.to = lines;
initialState.y.to = columns;

const neighbors: number[][] = [];
for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
        for (let z = -1; z < 2; z++) {
            if (x === 0 && y === 0 && z === 0) continue;
            neighbors.push([x, y, z]);
        }
    }
}

const countActiveNeighbors = (cubes: Record<string, boolean>, z: number, x: number, y: number): number => {
    let active = 0;
    for (const diff of neighbors) {
        active += cubes[`${z + diff[0]},${x + diff[1]},${y + diff[2]}`] ? 1 : 0;
        if (active === 4) return active;
    }
    return active;
};

const iterate = (state: State): State => {
    const newState: State = { ...state, cubes: {} };
    newState.z.from -= 1;
    newState.z.to += 1;
    newState.x.from -= 1;
    newState.x.to += 1;
    newState.y.from -= 1;
    newState.y.to += 1;

    for (let z = newState.z.from; z <= newState.z.to; z++) {
        for (let x = newState.x.from; x <= newState.x.to; x++) {
            for (let y = newState.y.from; y <= newState.y.to; y++) {
                const count = countActiveNeighbors(state.cubes, z, x, y);
                const pos = `${z},${x},${y}`;
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
        }
    }

    return newState;
};

let state = initialState;
for (let i = 0; i < 6; i++) {
    state = iterate(state);
}

console.log(Object.entries(state.cubes).length);
