/* eslint-disable @typescript-eslint/no-non-null-assertion */
/*
--- Day 21: Allergen Assessment ---

You reach the train's last stop and the closest you can get to your vacation island without getting wet. There aren't even any boats here, but nothing can stop you now: you build a raft. You just need a few days' worth of food for your journey.

You don't speak the local language, so you can't read any ingredients lists. However, sometimes, allergens are listed in a language you do understand. You should be able to use this information to determine which ingredient contains which allergen and work out which foods are safe to take with you on your trip.

You start by compiling a list of foods (your puzzle input), one food per line. Each line includes that food's ingredients list followed by some or all of the allergens the food contains.

Each allergen is found in exactly one ingredient. Each ingredient contains zero or one allergen. Allergens aren't always marked; when they're listed (as in (contains nuts, shellfish) after an ingredients list), the ingredient that contains each listed allergen will be somewhere in the corresponding ingredients list. However, even if an allergen isn't listed, the ingredient that contains that allergen could still be present: maybe they forgot to label it, or maybe it was labeled in a language you don't know.

For example, consider the following list of foods:

mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)

The first food in the list has four ingredients (written in a language you don't understand): mxmxvkd, kfcds, sqjhc, and nhms. While the food might contain other allergens, a few allergens the food definitely contains are listed afterward: dairy and fish.

The first step is to determine which ingredients can't possibly contain any of the allergens in any food in your list. In the above example, none of the ingredients kfcds, nhms, sbzzf, or trh can contain an allergen. Counting the number of times any of these ingredients appear in any ingredients list produces 5: they all appear once each except sbzzf, which appears twice.

Determine which ingredients cannot possibly contain any of the allergens in your list. How many times do any of those ingredients appear?

*/

import fs from 'fs';
const input = fs.readFileSync('./21/21.txt', 'utf-8').split('\n');

const allIngredients = new Set<string>();
const allAllergens = new Set<string>();
const ingredientAllergen = new Map<string, string>();

interface Food {
    ingredients: Set<string>;
    allergens: Set<string>;
}

const foods: Food[] = [];

input.forEach((food) => {
    const [ingredientsStr, allergensStr] = food.split(' (contains ');
    const ingredients = ingredientsStr.split(' ');
    const allergens = allergensStr.replace(/,/g, '').replace(')', '').split(' ');

    foods.push({ ingredients: new Set(ingredients), allergens: new Set(allergens) });
    allergens.forEach((a) => allAllergens.add(a));
    ingredients.forEach((i) => allIngredients.add(i));
});

console.log(`N. ingredients:\t${allIngredients.size}\nN. allergens:\t${allAllergens.size}`);

// https://stackoverflow.com/questions/37320296/how-to-calculate-intersection-of-multiple-arrays-in-javascript-and-what-does-e
const intersectIngredients = (foods: Food[]): string[] =>
    foods.map((food) => [...food.ingredients]).reduce((a, b) => a.filter((c) => b.includes(c)));

const removeAllAllergens = () => {
    const allergensArray = [...allAllergens];
    while (allergensArray.length > 0) {
        const allergen = allergensArray.shift();
        const foodsWithAllergen = foods.filter((f) => f.allergens.has(allergen!));
        const commonIngredients = intersectIngredients(foodsWithAllergen);
        if (commonIngredients.length === 1) {
            foods.forEach((food) => {
                food.ingredients.delete(commonIngredients[0]);
            });
            ingredientAllergen.set(commonIngredients[0], allergen!);
        } else {
            allergensArray.push(allergen!);
        }
    }
};

removeAllAllergens();

console.log(`Part 1: ${foods.flatMap((food) => [...food.ingredients]).length}`);
console.log(
    `Part 2: ${[...ingredientAllergen.entries()]
        .sort((a, b) => (a[1] < b[1] ? -1 : 1))
        .map((a) => a[0])
        .join(',')}`
);
