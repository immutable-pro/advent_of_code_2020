/*
 The Elves in accounting are thankful for your help; one of them even offers you a starfish coin they had left over from a past vacation. They offer you a second one if you can find three numbers in your expense report that meet the same criteria.
 Using the above example again, the three entries that sum to 2020 are 979, 366, and 675. Multiplying them together produces the answer, 241861950.
 In your expense report, what is the product of the three entries that sum to 2020?
*/

const fs = require('fs');
const data = fs.readFileSync('./01.txt', 'utf-8');

const numbers = new Set();

let result = -1;
data.split('\n').findIndex((entry) => {
  const number = parseInt(entry);
  numbers.add(number);

  for (let n of numbers) {
    const complement = 2020 - (n + number);
    if (complement > 0 && numbers.has(complement)) {
      result = complement * n * number;
      return true;
    }
  }

  return false;
});

console.log(result);
