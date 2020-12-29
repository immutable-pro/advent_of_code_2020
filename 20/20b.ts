/*
--- Part Two ---

Now, you're ready to check the image for sea monsters.

The borders of each tile are not part of the actual image; start by removing them.

In the example above, the tiles become:

.#.#..#. ##...#.# #..#####
###....# .#....#. .#......
##.##.## #.#.#..# #####...
###.#### #...#.## ###.#..#
##.#.... #.##.### #...#.##
...##### ###.#... .#####.#
....#..# ...##..# .#.###..
.####... #..#.... .#......

#..#.##. .#..###. #.##....
#.####.. #.####.# .#.###..
###.#.#. ..#.#### ##.#..##
#.####.. ..##..## ######.#
##..##.# ...#...# .#.#.#..
...#..#. .#.#.##. .###.###
.#.#.... #.##.#.. .###.##.
###.#... #..#.##. ######..

.#.#.### .##.##.# ..#.##..
.####.## #.#...## #.#..#.#
..#.#..# ..#.#.#. ####.###
#..####. ..#.#.#. ###.###.
#####..# ####...# ##....##
#.##..#. .#...#.. ####...#
.#.###.. ##..##.. ####.##.
...###.. .##...#. ..#..###

Remove the gaps to form the actual image:

.#.#..#.##...#.##..#####
###....#.#....#..#......
##.##.###.#.#..######...
###.#####...#.#####.#..#
##.#....#.##.####...#.##
...########.#....#####.#
....#..#...##..#.#.###..
.####...#..#.....#......
#..#.##..#..###.#.##....
#.####..#.####.#.#.###..
###.#.#...#.######.#..##
#.####....##..########.#
##..##.#...#...#.#.#.#..
...#..#..#.#.##..###.###
.#.#....#.##.#...###.##.
###.#...#..#.##.######..
.#.#.###.##.##.#..#.##..
.####.###.#...###.#..#.#
..#.#..#..#.#.#.####.###
#..####...#.#.#.###.###.
#####..#####...###....##
#.##..#..#...#..####...#
.#.###..##..##..####.##.
...###...##...#...#..###

Now, you're ready to search for sea monsters! Because your image is monochrome, a sea monster will look like this:

                  # 
#    ##    ##    ###
 #  #  #  #  #  #   

When looking for this pattern in the image, the spaces can be anything; only the # need to match. Also, you might need to rotate or flip your image before it's oriented correctly to find sea monsters. In the above image, after flipping and rotating it to the appropriate orientation, there are two sea monsters (marked with O):

.####...#####..#...###..
#####..#..#.#.####..#.#.
.#.#...#.###...#.##.O#..
#.O.##.OO#.#.OO.##.OOO##
..#O.#O#.O##O..O.#O##.##
...#.#..##.##...#..#..##
#.##.#..#.#..#..##.#.#..
.###.##.....#...###.#...
#.####.#.#....##.#..#.#.
##...#..#....#..#...####
..#.##...###..#.#####..#
....#.##.#.#####....#...
..##.##.###.....#.##..#.
#...#...###..####....##.
.#.##...#.##.#.#.###...#
#.###.#..####...##..#...
#.###...#.##...#.##O###.
.O##.#OO.###OO##..OOO##.
..O#.O..O..O.#O##O##.###
#.#..##.########..#..##.
#.#####..#.#...##..#....
#....##..#.#########..##
#...#.....#..##...###.##
#..###....##.#...##.##.#

Determine how rough the waters are in the sea monsters' habitat by counting the number of # that are not part of a sea monster. In the above example, the habitat's water roughness is 273.

How many # are not part of a sea monster?

*/

import fs from 'fs';
const input = Object.freeze(fs.readFileSync('./20/20.txt', 'utf-8').split('\n'));
// Corners, from 20.ts: {Tile 3557:, Tile 3769:, Tile 1019:, Tile 1097:}
const corners = Object.freeze(['Tile 3557:', 'Tile 3769:', 'Tile 1019:', 'Tile 1097:']);
// const corners = Object.freeze(['Tile 1951:', 'Tile 1171:', 'Tile 2971:', 'Tile 3079:']); // Example

const parseTiles = (lines: readonly string[]): Record<string, string[]> => {
    const tiles: Record<string, string[]> = {};
    let tileTitle = '';
    let newTile: string[] = [];

    lines.forEach((line) => {
        if (line.startsWith('Tile')) {
            tileTitle = line;
            newTile = [];
        } else if (line === '') {
            tiles[tileTitle] = newTile;
        } else {
            newTile.push(line);
        }
    });

    return tiles;
};

const getBorders = (tile: string[]): { t: string; r: string; b: string; l: string } => {
    const [l, r] = tile.reduce<[string, string]>(
        ([l, r], line) => {
            l += line[0];
            r += line[line.length - 1];
            return [l, r];
        },
        ['', '']
    );

    return {
        t: tile[0],
        r,
        b: tile[tile.length - 1],
        l,
    };
};

const tiles = parseTiles(input),
    tilesEntries = Object.entries(tiles),
    totalSideLength = Math.sqrt(tilesEntries.length),
    tileSideLength = tilesEntries[0][1].length;

console.log(
    `There are ${totalSideLength}x${totalSideLength} tiles; each tile is ${tileSideLength}x${tileSideLength} long.`
);

const board = {
    numTiles: 0,
    lines: [] as string[],
    used: new Set<string>(),
};

const findMatchingOnTheRight = (rightBorder: string): string | undefined => {
    const tile = tilesEntries.find(([title]) => {
        if (board.used.has(title)) return false;

        for (let i = 0; i < 4; i++) {
            const borders = getBorders(tiles[title]);
            if (borders.l === rightBorder) return true;
            tiles[title] = rotate(tiles[title]);
        }

        tiles[title] = flip(tiles[title]);

        for (let i = 0; i < 4; i++) {
            const borders = getBorders(tiles[title]);
            if (borders.l === rightBorder) return true;
            tiles[title] = rotate(tiles[title]);
        }
    });

    return tile ? tile[0] : undefined;
};

const rotate = (lines: string[]) => {
    const newLines = [];

    for (let j = 0; j < lines.length; j++) {
        let newRow = '';
        for (let i = lines.length - 1; i >= 0; i--) {
            newRow += lines[i].charAt(j);
        }
        newLines.push(newRow);
    }

    return newLines;
};

const flip = (lines: string[]) => lines.map((line) => line.split('').reverse().join(''));

const findMatchingOnTheBottom = (bottomBorder: string): string | undefined => {
    const tile = tilesEntries.find(([title]) => {
        if (board.used.has(title)) return false;

        for (let i = 0; i < 4; i++) {
            const borders = getBorders(tiles[title]);
            if (borders.t === bottomBorder) return true;
            tiles[title] = rotate(tiles[title]);
        }

        tiles[title] = flip(tiles[title]);

        for (let i = 0; i < 4; i++) {
            const borders = getBorders(tiles[title]);
            if (borders.t === bottomBorder) return true;
            tiles[title] = rotate(tiles[title]);
        }
    });

    return tile ? tile[0] : undefined;
};

const placeInBoard = (title: string): void => {
    const tile = tiles[title],
        row = Math.trunc(board.numTiles / totalSideLength),
        column = board.numTiles % totalSideLength;

    tile.forEach((line, i) => {
        if (column === 0) {
            board.lines[row * tileSideLength + i] = line;
        } else {
            board.lines[row * tileSideLength + i] += line;
        }
    });

    board.numTiles++;
    board.used.add(title);
};

// Copy any of the corners first and try to fill from left to right, top to bottom
// Try changing the top left corners until the puzzle solves.
for (const cornerTitle of corners) {
    let nextTitle: string | undefined = cornerTitle;
    while (nextTitle) {
        placeInBoard(nextTitle);
        const borders = getBorders(tiles[nextTitle]);
        nextTitle = findMatchingOnTheRight(borders.r);
        if (!nextTitle) {
            // Finish on the right, get the bottom line of the board
            const bottomBorder = board.lines[board.lines.length - 1];
            nextTitle = findMatchingOnTheBottom(bottomBorder.substring(0, tileSideLength));
        }
    }

    if (board.numTiles === tilesEntries.length) {
        break; // DONE
    } else {
        board.numTiles = 0;
        board.lines = [];
        board.used = new Set<string>();
    }
}

if (board.used.size !== tilesEntries.length) throw 'Something went wrong';

// Now the board has the puzzle already solved. Let's remove the borders.
// - Horizontal
board.lines = board.lines.reduce<string[]>((newLines, line, i) => {
    if (i % tileSideLength === 0 || i % tileSideLength === tileSideLength - 1) return newLines;
    newLines.push(line);
    return newLines;
}, []);
// - Vertical
board.lines = board.lines.map((line) =>
    line.split('').reduce<string>((newLine, char, i) => {
        if (i % tileSideLength === 0 || i % tileSideLength === tileSideLength - 1) return newLine;
        newLine += char;
        return newLine;
    }, '')
);

const monster = ['                  # ', '#    ##    ##    ###', ' #  #  #  #  #  #   '];
let monsterSequence = monster.reduce<number[][]>((prev, line, i) => {
    line.split('').forEach((char, j) => {
        if (char === '#') {
            prev.push([i, j]);
        }
    });
    return prev;
}, []);
// Normalizing
monsterSequence = monsterSequence.map(([x, y]) => [x - monsterSequence[0][0], y - monsterSequence[0][1]]);

// Scanning and marking sea monsters
const scan = () => {
    let found = false;
    board.lines.forEach((line, i) => {
        line.split('').forEach((char, j) => {
            if (char === '#') {
                const lastVisit: { i: number; j: number }[] = [];
                for (let m = 0; m < monsterSequence.length; m++) {
                    const [x, y] = monsterSequence[m];
                    if (board.lines[i + x] && board.lines[i + x].charAt(j + y) === '#') {
                        lastVisit.push({ i: i + x, j: j + y });
                    } else {
                        break;
                    }
                }
                if (lastVisit.length === monsterSequence.length) {
                    found = true;
                    lastVisit.forEach(({ i, j }) => {
                        let newLine = board.lines[i];
                        newLine = newLine.substr(0, j) + 'O' + newLine.substr(j + 1);
                        board.lines[i] = newLine;
                    });
                }
            }
        });
    });

    return found;
};

let found = false;
while (!found) {
    found = scan();
    if (found) break;

    for (let i = 0; i < 4; i++) {
        board.lines = rotate(board.lines);
        found = scan();
        if (found) break;
    }

    if (found) break;

    board.lines = flip(board.lines);
}

// And finally count the number of #
const hashNum = board.lines.reduce(
    (prev, line) => (prev += line.split('').reduce((sum, char) => (char === '#' ? sum + 1 : sum), 0)),
    0
);

console.log(hashNum);
