/**
 * Elder Futhark glyphs as line geometry on a 10 x 21 grid.
 *
 * The Unicode Runic block (U+16A0..) is absent from Cinzel, Crimson Text and
 * Space Mono, and from most system fonts on Windows and Android, so every rune
 * shown to the user is drawn as vector strokes instead of typed as text.
 * The Unicode character is kept in the rune data for metadata and copy.
 */
export type Stroke = [number, number][];

export const RUNE_GLYPHS: Record<string, Stroke[]> = {
  fehu: [
    [[2, 1], [2, 20]],
    [[2, 5], [8, 2]],
    [[2, 11], [8, 8]],
  ],
  uruz: [[[2, 20], [2, 2], [8, 6], [8, 20]]],
  thurisaz: [
    [[2, 1], [2, 20]],
    [[2, 5], [8, 9], [2, 13]],
  ],
  ansuz: [
    [[2, 1], [2, 20]],
    [[2, 4], [8, 8]],
    [[2, 10], [8, 14]],
  ],
  raidho: [
    [[2, 1], [2, 20]],
    [[2, 1], [8, 4], [2, 10]],
    [[2, 10], [8, 20]],
  ],
  kenaz: [[[8, 3], [2, 10], [8, 18]]],
  gebo: [
    [[1, 2], [9, 19]],
    [[9, 2], [1, 19]],
  ],
  wunjo: [
    [[2, 1], [2, 20]],
    [[2, 1], [8, 6], [2, 11]],
  ],
  hagalaz: [
    [[2, 1], [2, 20]],
    [[8, 1], [8, 20]],
    [[2, 8], [8, 13]],
  ],
  nauthiz: [
    [[5, 1], [5, 20]],
    [[1, 14], [9, 7]],
  ],
  isa: [[[5, 1], [5, 20]]],
  jera: [
    [[2, 2], [7, 6], [2, 10]],
    [[8, 19], [3, 15], [8, 11]],
  ],
  eihwaz: [[[8, 2], [5, 5], [5, 16], [2, 19]]],
  perthro: [[[8, 1], [2, 5], [2, 16], [8, 20]]],
  algiz: [
    [[5, 20], [5, 6]],
    [[5, 9], [1, 2]],
    [[5, 9], [9, 2]],
  ],
  sowilo: [[[8, 2], [3, 7], [8, 13], [3, 19]]],
  tiwaz: [
    [[5, 20], [5, 3]],
    [[1, 8], [5, 2], [9, 8]],
  ],
  berkano: [
    [[2, 1], [2, 20]],
    [[2, 2], [8, 5], [2, 10]],
    [[2, 10], [8, 15], [2, 20]],
  ],
  ehwaz: [[[2, 20], [2, 3], [5, 8], [8, 3], [8, 20]]],
  mannaz: [
    [[2, 2], [2, 20]],
    [[8, 2], [8, 20]],
    [[2, 3], [8, 11]],
    [[8, 3], [2, 11]],
  ],
  laguz: [
    [[3, 1], [3, 20]],
    [[3, 1], [8, 5]],
  ],
  ingwaz: [[[5, 3], [9, 10.5], [5, 18], [1, 10.5], [5, 3]]],
  dagaz: [
    [[2, 2], [2, 19]],
    [[8, 2], [8, 19]],
    [[2, 2], [8, 19]],
    [[2, 19], [8, 2]],
  ],
  othala: [
    [[5, 1], [9, 7], [5, 12], [1, 7], [5, 1]],
    [[3, 9.5], [1, 20]],
    [[7, 9.5], [9, 20]],
  ],
};

export const RUNE_IDS = Object.keys(RUNE_GLYPHS);

export function strokeToPoints(stroke: Stroke): string {
  return stroke.map(([x, y]) => `${x},${y}`).join(" ");
}
