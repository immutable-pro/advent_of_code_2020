/*
--- Part Two ---

Time to check the rest of the slopes - you need to minimize the probability of a sudden arboreal stop, after all.

Determine the number of trees you would encounter if, for each of the following slopes, you start at the top-left corner and traverse the map all the way to the bottom:

    Right 1, down 1.
    Right 3, down 1. (This is the slope you already checked.)
    Right 5, down 1.
    Right 7, down 1.
    Right 1, down 2.

In the above example, these slopes would find 2, 7, 3, 4, and 2 tree(s) respectively; multiplied together, these produce the answer 336.

What do you get if you multiply together the number of trees encountered on each of the listed slopes?

*/

import fs from 'fs';
const data = fs.readFileSync('./03.txt', 'utf-8');

const lines = data.split('\n');
const length = lines[0].length;

const downSteps = [1, 1, 1, 1, 2];
const rightSteps = [1, 3, 5, 7, 1];

const reducer = (prev: { lineNum: number; trees: any[] }, line: string) => {
  if (prev.lineNum === 0) {
    ++prev.lineNum;
    return prev;
  }

  for (let d = 0; d < downSteps.length; d++) {
    const down = downSteps[d];
    if (prev.lineNum % down > 0) {
      continue;
    }

    const right = rightSteps[d];
    const pos = ((prev.lineNum / down) * right) % length;
    prev.trees[d] = line[pos] === '#' ? ++prev.trees[d] : prev.trees[d];
  }

  prev.lineNum++;

  return prev;
};

const result = lines.reduce(reducer, { lineNum: 0, trees: [0, 0, 0, 0, 0] });

console.log(JSON.stringify(result));
console.log(result.trees.reduce((prev, trees) => prev * trees));
