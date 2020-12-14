/*
--- Part Two ---

The final step in breaking the XMAS encryption relies on the invalid number you just found: you must find a contiguous set of at least two numbers in your list which sum to the invalid number from step 1.

Again consider the above example:

35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576

In this list, adding up all of the numbers from 15 through 40 produces the invalid number from step 1, 127. (Of course, the contiguous set of numbers in your actual list might be much longer.)

To find the encryption weakness, add together the smallest and largest number in this contiguous range; in this example, these are 15 and 47, producing 62.

What is the encryption weakness in your XMAS-encrypted list of numbers?

*/

import fs from 'fs';
import { findInvalid } from './09';
const data = fs.readFileSync('./09.txt', 'utf-8');
const lines = Object.freeze(data.split('\n').map((line) => parseInt(line)));

const findMinMax = (
  s: number,
  e: number,
  lines: readonly number[]
): [number, number] => {
  const sorted = lines.slice(s, e + 1).sort((a, b) => a - b);
  return [sorted[0], sorted[sorted.length - 1]];
};

const findWeakness = (lines: readonly number[], invalidNumber: number) => {
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;

  for (let i = 0; i < lines.length; ) {
    let sum = lines[i];

    for (let j = i + 1; j < lines.length; ) {
      let jValue = lines[j];
      if (sum + jValue > invalidNumber) {
        sum -= lines[i];
        i++;
      } else if (sum + jValue < invalidNumber) {
        sum += jValue;
        j++;
      } else {
        const [min, max] = findMinMax(i, j, lines);
        return `Min: ${min}, Max: ${max}, Sum: ${min + max}`;
      }
    }
  }
};

console.log(findWeakness(lines, findInvalid(lines, 25) ?? 0));
