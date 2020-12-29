/*
--- Day 20: Jurassic Jigsaw ---

The high-speed train leaves the forest and quickly carries you south. You can even see a desert in the distance! Since you have some spare time, you might as well see if there was anything interesting in the image the Mythical Information Bureau satellite captured.

After decoding the satellite messages, you discover that the data actually contains many small images created by the satellite's camera array. The camera array consists of many cameras; rather than produce a single square image, they produce many smaller square image tiles that need to be reassembled back into a single image.

Each camera in the camera array returns a single monochrome image tile with a random unique ID number. The tiles (your puzzle input) arrived in a random order.

Worse yet, the camera array appears to be malfunctioning: each image tile has been rotated and flipped to a random orientation. Your first task is to reassemble the original image by orienting the tiles so they fit together.

To show how the tiles should be reassembled, each tile's image data includes a border that should line up exactly with its adjacent tiles. All tiles have this border, and the border lines up exactly when the tiles are both oriented correctly. Tiles at the edge of the image also have this border, but the outermost edges won't line up with any other tiles.

For example, suppose you have the following nine tiles:

Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...

By rotating, flipping, and rearranging them, you can find a square arrangement that causes all adjacent borders to line up:

#...##.#.. ..###..### #.#.#####.
..#.#..#.# ###...#.#. .#..######
.###....#. ..#....#.. ..#.......
###.##.##. .#.#.#..## ######....
.###.##### ##...#.### ####.#..#.
.##.#....# ##.##.###. .#...#.##.
#...###### ####.#...# #.#####.##
.....#..## #...##..#. ..#.###...
#.####...# ##..#..... ..#.......
#.##...##. ..##.#..#. ..#.###...

#.##...##. ..##.#..#. ..#.###...
##..#.##.. ..#..###.# ##.##....#
##.####... .#.####.#. ..#.###..#
####.#.#.. ...#.##### ###.#..###
.#.####... ...##..##. .######.##
.##..##.#. ....#...## #.#.#.#...
....#..#.# #.#.#.##.# #.###.###.
..#.#..... .#.##.#..# #.###.##..
####.#.... .#..#.##.. .######...
...#.#.#.# ###.##.#.. .##...####

...#.#.#.# ###.##.#.. .##...####
..#.#.###. ..##.##.## #..#.##..#
..####.### ##.#...##. .#.#..#.##
#..#.#..#. ...#.#.#.. .####.###.
.#..####.# #..#.#.#.# ####.###..
.#####..## #####...#. .##....##.
##.##..#.. ..#...#... .####...#.
#.#.###... .##..##... .####.##.#
#...###... ..##...#.. ...#..####
..#.#....# ##.#.#.... ...##.....

For reference, the IDs of the above tiles are:

1951    2311    3079
2729    1427    2473
2971    1489    1171

To check that you've assembled the image correctly, multiply the IDs of the four corner tiles together. If you do this with the assembled tiles from the example above, you get 1951 * 3079 * 2971 * 1171 = 20899048083289.

Assemble the tiles into an image. What do you get if you multiply together the IDs of the four corner tiles?

*/

import fs from 'fs';

const tiles = new Map<string, { transformations: string[][]; lines: string[] }>();
const input = fs.readFileSync('./20/20.txt', 'utf-8').split('\n');

const calculateBorderTransformations = (lines: string[]): string[][] => {
    const transformations: string[][] = [];

    // Original
    const top = lines[0];
    const [left, right] = lines.reduce<[string, string]>(
        ([l, r], line) => {
            l += line[0];
            r += line[line.length - 1];
            return [l, r];
        },
        ['', '']
    );
    const bottom = lines[lines.length - 1];
    transformations.push([top, right, bottom, left]);
    // 90
    const top90 = right.split('').reverse().join('');
    const right90 = top;
    const bottom90 = left.split('').reverse().join('');
    const left90 = bottom;
    transformations.push([top90, right90, bottom90, left90]);
    // 180
    const top180 = bottom.split('').reverse().join('');
    const right180 = top90;
    const bottom180 = top.split('').reverse().join('');
    const left180 = bottom90;
    transformations.push([top180, right180, bottom180, left180]);
    // 270
    const top270 = right;
    const right270 = top180;
    const bottom270 = left;
    const left270 = bottom180;
    transformations.push([top270, right270, bottom270, left270]);

    // Flip
    const topA = bottom180;
    const rightA = left;
    const bottomA = top180;
    const leftA = right;
    transformations.push([topA, rightA, bottomA, leftA]);

    // Flip + 90
    const topB = bottom90;
    const rightB = bottom180;
    const bottomB = top90;
    const leftB = top180;
    transformations.push([topB, rightB, bottomB, leftB]);

    // Flip + 180
    const topC = bottom;
    const rightC = bottom90;
    const bottomC = top;
    const leftC = top90;
    transformations.push([topC, rightC, bottomC, leftC]);

    // Flip + 270
    const topD = bottom270;
    const rightD = bottom;
    const bottomD = top270;
    const leftD = top;
    transformations.push([topD, rightD, bottomD, leftD]);

    return transformations;
};

let newTile: { transformations: string[][]; lines: string[] } = { transformations: [], lines: [] };
let tileTitle = '';

for (const line of input) {
    if (line.startsWith('Tile')) {
        tileTitle = line;
    } else if (line === '') {
        newTile.transformations.push(...calculateBorderTransformations(newTile.lines));
        tiles.set(tileTitle, newTile);
        newTile = { transformations: [], lines: [] };
    } else {
        newTile.lines.push(line);
    }
}

const corners = new Set<string>();
const tilesArray = [...tiles.entries()];
tilesArray.forEach(([title, { transformations }]) => {
    transformations.forEach((borders) => {
        let count = 0;
        borders.forEach((border) => {
            // Find border in other tiles
            tilesArray
                .filter(([t]) => t !== title)
                .forEach(([, otherTile]) => {
                    const otherTransformations = otherTile.transformations;
                    otherTransformations.forEach((otherBorders) => {
                        otherBorders.forEach((otherBorder) => {
                            if (border === otherBorder) {
                                count++;
                            }
                        });
                    });
                });
        });
        if (count === 8) {
            corners.add(title);
        }
    });
});

let result = 1;
for (const title of corners) {
    result *= parseInt(title.substring(5, 10));
}
console.log(result);
