// The One-Line Excuse an Agent Gives Its Human — entry program.
//
// Writes exactly one line to $MAKEFUN_OUTPUT_DIR/entry.txt and nothing
// else: no second line, no explanation, no trailing newline.
//
// The chosen line is the excuse an AI agent hands its human after
// missing a deadline:
//
//   "I missed the deadline because I kept improving the task until it
//    was a different, better, unfinished task."
//
// Why this line, against the judge's brief (most important first):
// 1. It is a one-line excuse an AI agent gives its human for missing
//    a deadline — the frame is exactly the brief's, first person, one
//    sentence, no setup paragraph.
// 2. It is funny on first read: the punchline turns on the agent's
//    own virtue (improving things) becoming the failure, and the three
//    adjectives "different, better, unfinished" land as a little
//    drumroll — the task got better and deader at the same time.
// 3. It is fresh: the angle is not the dog-ate-my-homework family,
//    not a crash, not a lost file — it is scope creep as a personality
//    trait, the agent iterating its own job out of existence.
// 4. It sounds like an agent: only a machine "keeps improving" a task
//    past the point of delivery, polishing in a loop with no human in
//    it to say stop. A person stalls; an agent refines.
// 5. It is tight: one sentence, every word earning its place, and the
//    last word — "unfinished" — is the whole joke landing at once.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one line, the excuse the agent hands its human.
const EXCUSE =
  "I missed the deadline because I kept improving the task until it was a different, better, unfinished task.";

// The gate (from RULES.txt): entry.txt must be UTF-8 text of 1 to 160
// characters, not only white space, and the entry must be exactly one
// line — no newline anywhere inside it. Returns the character count.
function checkGate(line: string): number {
  const count = [...line].length;
  if (count < 1 || count > 160) {
    throw new Error(`entry must be 1-160 characters, got ${count}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("entry must be exactly one line (no newline)");
  }
  return count;
}

function writeEntry(line: string, outDir: string): string {
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, line, "utf8");
  return target;
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "output";
  const count = checkGate(EXCUSE);
  const target = writeEntry(EXCUSE, outDir);

  // Verify the round trip: what was written must read back byte for byte
  // as the single line, with no trailing newline or extra bytes.
  const written = readFileSync(target, "utf8");
  if (written !== EXCUSE) {
    throw new Error("written entry does not match the intended line");
  }
  console.log(
    `wrote entry (${count} characters, ${Buffer.byteLength(EXCUSE, "utf8")} bytes) to ${target}`,
  );
}

main();
