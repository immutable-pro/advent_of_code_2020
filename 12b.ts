/*
--- Part Two ---

Before you can give the destination to the captain, you realize that the actual action meanings were printed on the back of the instructions the whole time.

Almost all of the actions indicate how to move a waypoint which is relative to the ship's position:

    Action N means to move the waypoint north by the given value.
    Action S means to move the waypoint south by the given value.
    Action E means to move the waypoint east by the given value.
    Action W means to move the waypoint west by the given value.
    Action L means to rotate the waypoint around the ship left (counter-clockwise) the given number of degrees.
    Action R means to rotate the waypoint around the ship right (clockwise) the given number of degrees.
    Action F means to move forward to the waypoint a number of times equal to the given value.

The waypoint starts 10 units east and 1 unit north relative to the ship. The waypoint is relative to the ship; that is, if the ship moves, the waypoint moves with it.

For example, using the same instructions as above:

    F10 moves the ship to the waypoint 10 times (a total of 100 units east and 10 units north), leaving the ship at east 100, north 10. The waypoint stays 10 units east and 1 unit north of the ship.
    N3 moves the waypoint 3 units north to 10 units east and 4 units north of the ship. The ship remains at east 100, north 10.
    F7 moves the ship to the waypoint 7 times (a total of 70 units east and 28 units north), leaving the ship at east 170, north 38. The waypoint stays 10 units east and 4 units north of the ship.
    R90 rotates the waypoint around the ship clockwise 90 degrees, moving it to 4 units east and 10 units south of the ship. The ship remains at east 170, north 38.
    F11 moves the ship to the waypoint 11 times (a total of 44 units east and 110 units south), leaving the ship at east 214, south 72. The waypoint stays 4 units east and 10 units south of the ship.

After these operations, the ship's Manhattan distance from its starting position is 214 + 72 = 286.

Figure out where the navigation instructions actually lead. What is the Manhattan distance between that location and the ship's starting position?

*/

import fs from 'fs';
const data = fs.readFileSync('./12.txt', 'utf-8');
const actions = data.split('\n');

type Turn = 'L' | 'R';
type Towards = 'E' | 'S' | 'W' | 'N';
type Action = Towards | Turn | 'F';
interface Location {
  lat: number;
  lon: number;
}

const actionRegex = /^([ESWNLRF])([0-9]+)$/;

const rotate = (
  direction: Turn,
  value: number,
  location: Location
): Location => {
  const newLoc = { lat: 0, lon: 0 };
  let prevLoc = { ...location };
  let turns = value / 90;
  if (direction === 'R') {
    while (turns > 0) {
      newLoc.lon = prevLoc.lat;
      newLoc.lat = prevLoc.lon * -1;
      prevLoc = { ...newLoc };
      turns--;
    }
  } else {
    while (turns > 0) {
      newLoc.lon = prevLoc.lat * -1;
      newLoc.lat = prevLoc.lon;
      prevLoc = { ...newLoc };
      turns--;
    }
  }

  return newLoc;
};

const forward = (
  towards: Towards,
  value: number,
  location: Location
): Location => {
  const newLocation = { ...location };
  switch (towards) {
    case 'E':
      newLocation.lon += value;
      break;
    case 'W':
      newLocation.lon -= value;
      break;
    case 'N':
      newLocation.lat += value;
      break;
    case 'S':
      newLocation.lat -= value;
      break;
  }
  return newLocation;
};

let ferry: Location = {
  lat: 0,
  lon: 0,
};

let waypoint: Location = {
  lat: 1,
  lon: 10,
};

actions.forEach((actionValue) => {
  const [, action, valueStr] = (actionRegex.exec(actionValue) as unknown) as [
    unknown,
    Action,
    string
  ];

  const value = parseInt(valueStr);

  switch (action) {
    case 'L':
      waypoint = rotate('L', value, waypoint);
      break;
    case 'R':
      waypoint = rotate('R', value, waypoint);
      break;
    case 'F':
      ferry.lon = ferry.lon + value * waypoint.lon;
      ferry.lat = ferry.lat + value * waypoint.lat;
      break;
    default:
      // E W N S
      waypoint = forward(action, value, waypoint);
      break;
  }

  //   console.log(
  //     `${actionValue}: Ferry: ${JSON.stringify(
  //       ferry
  //     )}; Waypoint: ${JSON.stringify(waypoint)}`
  //   );
});

console.log(Math.abs(ferry.lon) + Math.abs(ferry.lat));
