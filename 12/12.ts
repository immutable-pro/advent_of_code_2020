/*
--- Day 12: Rain Risk ---

Your ferry made decent progress toward the island, but the storm came in faster than anyone expected. The ferry needs to take evasive actions!

Unfortunately, the ship's navigation computer seems to be malfunctioning; rather than giving a route directly to safety, it produced extremely circuitous instructions. When the captain uses the PA system to ask if anyone can help, you quickly volunteer.

The navigation instructions (your puzzle input) consists of a sequence of single-character actions paired with integer input values. After staring at them for a few minutes, you work out what they probably mean:

    Action N means to move north by the given value.
    Action S means to move south by the given value.
    Action E means to move east by the given value.
    Action W means to move west by the given value.
    Action L means to turn left the given number of degrees.
    Action R means to turn right the given number of degrees.
    Action F means to move forward by the given value in the direction the ship is currently facing.

The ship starts by facing east. Only the L and R actions change the direction the ship is facing. (That is, if the ship is facing east and the next instruction is N10, the ship would move north 10 units, but would still move east if the following action were F.)

For example:

F10
N3
F7
R90
F11

These instructions would be handled as follows:

    F10 would move the ship 10 units east (because the ship starts by facing east) to east 10, north 0.
    N3 would move the ship 3 units north to east 10, north 3.
    F7 would move the ship another 7 units east (because the ship is still facing east) to east 17, north 3.
    R90 would cause the ship to turn right by 90 degrees and face south; it remains at east 17, north 3.
    F11 would move the ship 11 units south to east 17, south 8.

At the end of these instructions, the ship's Manhattan distance (sum of the absolute values of its east/west position and its north/south position) from its starting position is 17 + 8 = 25.

Figure out where the navigation instructions lead. What is the Manhattan distance between that location and the ship's starting position?

*/

import fs from 'fs';
const data = fs.readFileSync('./12.txt', 'utf-8');
const actions = data.split('\n');

type Turn = 'L' | 'R';
type Towards = 'E' | 'S' | 'W' | 'N';
type Action = Towards | Turn | 'F';
const actionRegex = /^([ESWNLRF])([0-9]+)$/;

const LeftRotation: Towards[] = ['E', 'N', 'W', 'S'];
const RightRotation: Towards[] = ['E', 'S', 'W', 'N'];

const turn = (towards: Towards, direction: Turn, value: number) => {
    const turns = value / 90;
    const rotation = direction === 'L' ? LeftRotation : RightRotation;
    const steps =
    (rotation.findIndex((v) => v === towards) + turns) % rotation.length;
    return rotation[steps];
};

const forward = (
    towards: Towards,
    value: number,
    lat: number,
    lon: number
): [number, number] => {
    let newLat = lat,
        newLon = lon;
    switch (towards) {
        case 'E':
            newLon += value;
            break;
        case 'W':
            newLon -= value;
            break;
        case 'N':
            newLat += value;
            break;
        case 'S':
            newLat -= value;
            break;
    }
    return [newLat, newLon];
};

let latitude = 0; // S/N
let longitude = 0; // E/W
let towards: Towards = 'E'; // Initial

actions.forEach((actionValue) => {
    const [, action, valueStr] = (actionRegex.exec(actionValue) as unknown) as [
    unknown,
    Action,
    string
  ];

    const value = parseInt(valueStr);

    switch (action) {
        case 'L':
            towards = turn(towards, 'L', value);
            break;
        case 'R':
            towards = turn(towards, 'R', value);
            break;
        case 'F':
            [latitude, longitude] = forward(towards, value, latitude, longitude);
            break;
        default:
        // E W N S
            [latitude, longitude] = forward(action, value, latitude, longitude);
            break;
    }
});

console.log(Math.abs(latitude) + Math.abs(longitude));
