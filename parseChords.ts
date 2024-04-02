import CHORD_COUNTS from "./chordCounts";

const PITCH: { [key: string]: PitchClass } = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
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

type TriadQuality = "major" | "minor" | "dim";

type PitchClass = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

type Chord = {
  root: PitchClass;
  bass: PitchClass | null;
  triadQuality: TriadQuality;
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
  "#5",
  "#6",
  "#11",
  "maj13",
  "maj7",
  "maj9",
];

const parseChord = (chord: string): Chord | null => {
  const sourceChord = chord;

  const properties: string[] = [];
  let bass: PitchClass | null = null;
  let root: PitchClass | null = null;
  let triadQuality: TriadQuality = "major";

  for (const chunk of Object.keys(CHUNKS_TO_REPLACE) as (keyof typeof CHUNKS_TO_REPLACE)[]) {
    chord = chord.replace(chunk, CHUNKS_TO_REPLACE[chunk])
  } 

  for (const chunk of CHUNKS) {
    const [chord_, extracted] = extractChunk(chord, chunk);
    if (extracted) {
      properties.push(chunk);
    }
    chord = chord_;
  }

  if (chord.split("/").length === 2) {
    const [chord_, bassLetter] = chord.split("/");
    if (bassLetter in PITCH) {
      bass = PITCH[bassLetter];
      chord = chord_;
    }
  }

  chord = chord.replace("m#", "#m");

  const firstTwoCharacters = chord.slice(0, 2);
  if (firstTwoCharacters in PITCH) {
    root = PITCH[firstTwoCharacters];
    chord = chord.slice(2);
  } else {
    if (chord[0] in PITCH) {
      root = PITCH[chord[0]];
      chord = chord.slice(1);
    } else {
      console.log("    ROOT NOT FOUND");
      return null;
    }
  }

  if (
    chord === "min7b5" ||
    chord === "m7b5" ||
    chord === "maj7b5" ||
    chord === "dim7" ||
    chord === "dim"
  ) {
    triadQuality = "dim";
  } else if (chord === "m") {
    triadQuality = "minor";
  } else if (chord === "m7" || chord === "min7") {
    triadQuality = "minor";
    properties.push("m7");
  } else if (chord === "7") {
    properties.push("7");
  } else if (chord === "9") {
    properties.push("7");
    properties.push("9");
  } else if (chord === "11") {
    properties.push("7");
    properties.push("11");
  } else if (chord === "5") {
    properties.push("5");
  } else if (chord === "6") {
    properties.push("6");
  } else if (chord !== "") {
    console.log("    NOT PARSED", chord, sourceChord);
  }

  return { root, bass, triadQuality, properties };
};

for (const chord in CHORD_COUNTS) {
  const parsedChord = parseChord(chord);
  console.log(chord, parsedChord);
  console.log();
}
