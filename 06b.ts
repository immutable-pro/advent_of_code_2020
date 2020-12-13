/*
--- Part Two ---

As you finish the last group's customs declaration, you notice that you misread one word in the instructions:

You don't need to identify the questions to which anyone answered "yes"; you need to identify the questions to which everyone answered "yes"!

Using the same example as above:

abc

a
b
c

ab
ac

a
a
a
a

b

This list represents answers from five groups:

    In the first group, everyone (all 1 person) answered "yes" to 3 questions: a, b, and c.
    In the second group, there is no question to which everyone answered "yes".
    In the third group, everyone answered yes to only 1 question, a. Since some people did not answer "yes" to b or c, they don't count.
    In the fourth group, everyone answered yes to only 1 question, a.
    In the fifth group, everyone (all 1 person) answered "yes" to 1 question, b.

In this example, the sum of these counts is 3 + 0 + 1 + 1 + 1 = 6.

For each group, count the number of questions to which everyone answered "yes". What is the sum of those counts?

*/

import fs from 'fs';
const data = fs.readFileSync('./06.txt', 'utf-8');
const lines = data.split('\n');

const countYes = (group: string[]) => {
  const answers = group.reduce<Map<string, number>>((prevAnswers, answer) => {
    answer.split('').forEach((letter) => {
      const count = prevAnswers.get(letter);
      if (count !== undefined) {
        prevAnswers.set(letter, count + 1);
      } else {
        prevAnswers.set(letter, 1);
      }
    });
    return prevAnswers;
  }, new Map<string, number>());

  let count = 0;
  answers.forEach((value) => {
    count += value === group.length ? 1 : 0;
  });

  return count;
};

let group: string[] = [];
const result = lines.reduce<number>((count, line) => {
  if (line === '') {
    count += countYes(group);
    group = [];
  } else {
    group.push(line);
  }
  return count;
}, 0);

console.log(result);
