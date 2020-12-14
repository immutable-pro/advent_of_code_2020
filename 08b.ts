/*
--- Part Two ---

After some careful analysis, you believe that exactly one instruction is corrupted.

Somewhere in the program, either a jmp is supposed to be a nop, or a nop is supposed to be a jmp. (No acc instructions were harmed in the corruption of this boot code.)

The program is supposed to terminate by attempting to execute an instruction immediately after the last instruction in the file. By changing exactly one jmp or nop, you can repair the boot code and make it terminate correctly.

For example, consider the same program from above:

nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6

If you change the first instruction from nop +0 to jmp +0, it would create a single-instruction infinite loop, never leaving that instruction. If you change almost any of the jmp instructions, the program will still eventually find another jmp instruction and loop forever.

However, if you change the second-to-last instruction (from jmp -4 to nop -4), the program terminates! The instructions are visited in this order:

nop +0  | 1
acc +1  | 2
jmp +4  | 3
acc +3  |
jmp -3  |
acc -99 |
acc +1  | 4
nop -4  | 5
acc +6  | 6

After the last instruction (acc +6), the program terminates by attempting to run the instruction below the last instruction in the file. With this change, after the program terminates, the accumulator contains the value 8 (acc +1, acc +1, acc +6).

Fix the program so that it terminates normally by changing exactly one jmp (to nop) or nop (to jmp). What is the value of the accumulator after the program terminates?

*/

import fs from 'fs';
const data = fs.readFileSync('./08.txt', 'utf-8');

type Op = 'nop' | 'acc' | 'jmp';

const parseOp = (line: string): [Op, number] => {
  const [op, value] = line.split(' ') as [Op, string];
  return [op, parseInt(value)];
};
const OPS = Object.freeze(data.split('\n'));

function executeProgram(
  ops: string[],
  nopsJmpsStack: number[]
): [boolean, number] {
  const executed: number[] = [];
  let pointer = 0;
  let acc = 0;

  for (pointer = 0; pointer < ops.length; ) {
    if (executed[pointer] !== undefined) {
      return [false, acc];
    }
    executed[pointer] = pointer;

    const [op, value] = parseOp(ops[pointer]);
    // console.log(`${op}\t${value}\t| acc: ${acc}`);

    switch (op) {
      case 'acc':
        acc += value;
        pointer++;
        break;
      case 'jmp':
        if (alreadyChanged[pointer] === undefined) {
          nopsJmpsStack.push(pointer);
        }
        pointer += value;
        break;
      case 'nop':
        if (alreadyChanged[pointer] === undefined) {
          nopsJmpsStack.push(pointer);
        }
        pointer++;
        break;
    }
  }

  return [pointer === ops.length, acc];
}

let ops = [...OPS];
const nopsJmpsStack: number[] = [];
const alreadyChanged: number[] = [];
while (true) {
  //   console.log('=====================================');
  const [done, acc] = executeProgram(ops, nopsJmpsStack);
  if (!done) {
    const pointer = nopsJmpsStack.pop()!;
    ops = [...OPS];
    const [op, value] = parseOp(ops[pointer]);
    if (op === 'jmp') {
      ops[pointer] = `nop ${value}`;
    } else if (op === 'nop') {
      ops[pointer] = `jmp ${value}`;
    }
    alreadyChanged[pointer] = pointer;
  } else {
    console.log(acc);
    break;
  }
}
