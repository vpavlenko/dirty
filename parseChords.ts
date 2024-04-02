import CHORD_COUNTS from "./chordCounts";

const PITCH: { [key: string]: number } = {
  C: 0, // C natural
  "C#": 1,
  Db: 1, // C sharp / D flat
  D: 2, // D natural
  "D#": 3,
  Eb: 3, // D sharp / E flat
  E: 4, // E natural
  F: 5, // F natural
  "F#": 6,
  Gb: 6, // F sharp / G flat
  G: 7, // G natural
  "G#": 8,
  Ab: 8, // G sharp / A flat
  A: 9, // A natural
  "A#": 10,
  Bb: 10, // A sharp / B flat
  B: 11, // B natural
  DO: 0,
  RE: 2,
  MI: 4,
  FA: 5,
  SOL: 7,
  LA: 9,
  SI: 11,
  c: 0,
  d: 2,
  e: 4,
  f: 5,
  g: 7,
  a: 9,
  b: 11,
  С: 0,
};

const CHUNKS_TO_REPLACE = {
  DO: "C",
  RE: "D",
  MI: "E",
  FA: "F",
  SOL: "G",
  LA: "A",
  SI: "B",
  SUS: "sus",
};

const extractChunk = (chord: string, chunk: string): [string, boolean] => {
  const regex = new RegExp(`\\(?${chunk}\\)?`);

  if (regex.test(chord)) {
    return [chord.replace(chunk, ""), true];
  }
  return [chord, false];
};

type Quality = "major" | "minor" | "maj7" | "min7";

type PitchClass = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

type Chord = {
  root: PitchClass;
  bass: PitchClass | null;
  quality: Quality;
  properties: string[];
};

const CHUNKS: string[] = [
  "sus4",
  "sus2",
  "sus",
  "XIX",
  "XIV",
  "IX",
  "IV",
  "XVIII",
  "XIII",
  "VIII",
  "III",
  "XVII",
  "XII",
  "VII",
  "II",
  "XVI",
  "XI",
  "VI",
  "I",
  "XV",
  "X",
  "V",
  "add#11",
  "add11+",
  "add+11",
  "add11",
  "add9-",
  "add9",
  "add2",
  "add4",
  "add13-",
  "add13",
  "69",
  "6/9",
];

const applyExtractionRules = (chord: string): Chord => {
  const properties: string[] = [];
  for (const chunk of CHUNKS) {
    const [chord_, extracted] = extractChunk(chord, chunk);
    if (extracted) {
      properties.push(chunk);
    }
    chord = chord_;
  }

  return { root: 0, bass: null, quality: "major", properties };
};

const parseChord = (chord: string): Chord => {
  for (const chunk in CHUNKS_TO_REPLACE) {
    chord = chord.replace(chunk, CHUNKS_TO_REPLACE[chunk]);
  }
  const partial = applyExtractionRules(chord);
  return partial;
};

for (const chord of CHORD_COUNTS) {
  const parsedChord = parseChord(chord);
  console.log(chord, CHORD_COUNTS[chord], parsedChord);
}
