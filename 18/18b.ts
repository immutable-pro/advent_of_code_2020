/*
--- Part Two ---

You manage to answer the child's questions and they finish part 1 of their homework, but get stuck when they reach the next section: advanced math.

Now, addition and multiplication have different precedence levels, but they're not the ones you're familiar with. Instead, addition is evaluated before multiplication.

For example, the steps to evaluate the expression 1 + 2 * 3 + 4 * 5 + 6 are now as follows:

1 + 2 * 3 + 4 * 5 + 6
  3   * 3 + 4 * 5 + 6
  3   *   7   * 5 + 6
  3   *   7   *  11
     21       *  11
         231

Here are the other examples from above:

    1 + (2 * 3) + (4 * (5 + 6)) still becomes 51.
    2 * 3 + (4 * 5) becomes 46.
    5 + (8 * 3 + 9 + 3 * 4 * 3) becomes 1445.
    5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4)) becomes 669060.
    ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 becomes 23340.

What do you get if you add up the results of evaluating the homework problems using these new rules?

*/

import fs from 'fs';
const operations = Object.freeze(fs.readFileSync('./18/18.txt', 'utf-8').split('\n'));

/**
 * @param exp Expression without parenthesis to solve.
 */
const solveSimple = (exp: string[]): number => {
    if (exp.length === 1) return parseInt(exp[0]);

    let acc = parseInt(exp[0]);
    let operator = exp[1];
    for (let i = 2; i < exp.length; i++) {
        const m = exp[i];
        if (i % 2) {
            operator = m;
        } else {
            if (operator === '*') {
                return acc * solveSimple(exp.slice(i, exp.length));
            } else {
                acc += parseInt(m);
            }
        }
    }

    return acc;
};

const solve = (operation: string[]): number => {
    const opening = operation.findIndex((m) => m === '(');
    if (opening === -1) return solveSimple(operation);

    const exp = operation.slice(0, opening);
    const rest = operation.slice(opening + 1, operation.length);

    const parenthesis: string[] = [];
    let open = 1;
    for (let i = 0; i < rest.length; i++) {
        const m = rest[i];
        if (m === '(') {
            open++;
            parenthesis.push(m);
        } else if (m === ')') {
            open--;
            if (open === 0) {
                break;
            } else {
                parenthesis.push(m);
            }
        } else {
            parenthesis.push(m);
        }
    }

    exp.push(`${solve(parenthesis)}`);
    exp.push(...rest.slice(parenthesis.length + 1, rest.length));

    return solve(exp);
};

const total = operations.reduce<number>((prev, operation) => prev + solve(operation.replace(/\s/g, '').split('')), 0);

console.log(total);
