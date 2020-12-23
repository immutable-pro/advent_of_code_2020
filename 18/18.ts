/*
--- Day 18: Operation Order ---

As you look out the window and notice a heavily-forested continent slowly appear over the horizon, you are interrupted by the child sitting next to you. They're curious if you could help them with their math homework.

Unfortunately, it seems like this "math" follows different rules than you remember.

The homework (your puzzle input) consists of a series of expressions that consist of addition (+), multiplication (*), and parentheses ((...)). Just like normal math, parentheses indicate that the expression inside must be evaluated before it can be used by the surrounding expression. Addition still finds the sum of the numbers on both sides of the operator, and multiplication still finds the product.

However, the rules of operator precedence have changed. Rather than evaluating multiplication before addition, the operators have the same precedence, and are evaluated left-to-right regardless of the order in which they appear.

For example, the steps to evaluate the expression 1 + 2 * 3 + 4 * 5 + 6 are as follows:

1 + 2 * 3 + 4 * 5 + 6
  3   * 3 + 4 * 5 + 6
      9   + 4 * 5 + 6
         13   * 5 + 6
             65   + 6
                 71

Parentheses can override this order; for example, here is what happens if parentheses are added to form 1 + (2 * 3) + (4 * (5 + 6)):

1 + (2 * 3) + (4 * (5 + 6))
1 +    6    + (4 * (5 + 6))
     7      + (4 * (5 + 6))
     7      + (4 *   11   )
     7      +     44
            51

Here are a few more examples:

    2 * 3 + (4 * 5) becomes 26.
    5 + (8 * 3 + 9 + 3 * 4 * 3) becomes 437.
    5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4)) becomes 12240.
    ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 becomes 13632.

Before you can help with the homework, you need to understand it yourself. Evaluate the expression on each line of the homework; what is the sum of the resulting values?

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
                acc *= parseInt(m);
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
