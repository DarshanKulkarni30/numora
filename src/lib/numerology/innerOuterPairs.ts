/**
 * Soul Urge × Personality pair copy.
 * Families cover every ordered pair; overrides win for common charts.
 * Reflective only — short words, hedged, no named archetypes.
 */

import { reduceToSingleDigit } from "./dateNumbers";
import { plainJob, plainTrait, plainWatch } from "./layeredCopy";

export type InnerOuterKind =
  | "same"
  | "light-face-heavy-want"
  | "strong-face-soft-want"
  | "open-face-private-want"
  | "closed-face-connective-want"
  | "same-direction";

export type AlignmentBand = "aligned" | "complementary" | "tension";

export type InnerOuterPattern = {
  kind: InnerOuterKind;
  band: AlignmentBand;
  looksLike: string;
  watch: string;
  tryLine: string;
  meet: string;
  overInner: string;
  balanced: string;
  overOuter: string;
  overInnerWatch: string;
  overOuterWatch: string;
};

export const INNER_OUTER_DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33] as const;

export const INNER_OUTER_KIND_LABEL: Record<InnerOuterKind, string> = {
  same: "inside and outside share a digit",
  "light-face-heavy-want": "light face, heavier inner want",
  "strong-face-soft-want": "strong face, gentler inner want",
  "open-face-private-want": "open face, private inner want",
  "closed-face-connective-want": "closed face, connective inner want",
  "same-direction": "two numbers that point a similar way",
};

/** How a Personality digit tends to read from the outside. */
const OUTWARD_READ: Record<number, string> = {
  1: "someone who starts and decides",
  2: "someone patient who works with others",
  3: "an easy, chatty front — talking, play, and ideas",
  4: "someone planned and steady",
  5: "someone who likes change and room to move",
  6: "someone who looks after people and keeps house",
  7: "someone quiet and hard to read",
  8: "someone who pushes for a result",
  9: "someone who finishes things and helps a wider group",
  11: "someone intuitive who can stir a room",
  22: "someone drawing a large, practical plan",
  33: "someone who teaches and cares at a high level",
};

/** What a Soul Urge digit privately wants. */
const INNER_PULL: Record<number, string> = {
  1: "to start things and decide for yourself",
  2: "patience, partnership, and not standing alone",
  3: "talk, play, and sharing ideas",
  4: "plans, routines, and work that holds",
  5: "change, freedom, and trying new things",
  6: "to be counted on — home, care, and promises kept",
  7: "quiet thinking and study, with room to be left alone",
  8: "real results, plans, and responsibility",
  9: "to finish things and help a wider group",
  11: "to notice deeply and inspire without a forced launch",
  22: "to build something large and practical",
  33: "to teach and care without emptying yourself",
};

type FaceAccess = "open" | "closed";
type FaceWeight = "light" | "strong";
type WantAccess = "private" | "connective";
type WantWeight = "heavy" | "soft";
type Direction = "expressive" | "contained";

type FaceTags = {
  weight: FaceWeight;
  access: FaceAccess;
  dir: Direction;
};

type WantTags = {
  weight: WantWeight;
  access: WantAccess;
  dir: Direction;
};

const FACE: Record<number, FaceTags> = {
  1: { weight: "strong", access: "closed", dir: "expressive" },
  2: { weight: "light", access: "open", dir: "contained" },
  3: { weight: "light", access: "open", dir: "expressive" },
  4: { weight: "strong", access: "closed", dir: "contained" },
  5: { weight: "light", access: "open", dir: "expressive" },
  6: { weight: "strong", access: "open", dir: "contained" },
  7: { weight: "strong", access: "closed", dir: "contained" },
  8: { weight: "strong", access: "closed", dir: "expressive" },
  9: { weight: "light", access: "open", dir: "expressive" },
  11: { weight: "light", access: "open", dir: "expressive" },
  22: { weight: "strong", access: "closed", dir: "contained" },
  33: { weight: "strong", access: "open", dir: "contained" },
};

const WANT: Record<number, WantTags> = {
  1: { weight: "heavy", access: "private", dir: "expressive" },
  2: { weight: "soft", access: "connective", dir: "contained" },
  3: { weight: "soft", access: "connective", dir: "expressive" },
  4: { weight: "heavy", access: "private", dir: "contained" },
  5: { weight: "soft", access: "private", dir: "expressive" },
  6: { weight: "heavy", access: "connective", dir: "contained" },
  7: { weight: "heavy", access: "private", dir: "contained" },
  8: { weight: "heavy", access: "private", dir: "expressive" },
  9: { weight: "heavy", access: "connective", dir: "expressive" },
  11: { weight: "soft", access: "connective", dir: "expressive" },
  22: { weight: "heavy", access: "private", dir: "contained" },
  33: { weight: "heavy", access: "connective", dir: "contained" },
};

function asNum(v: string | number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function lookup<T>(table: Record<number, T>, n: number): T | undefined {
  return table[n] ?? table[reduceToSingleDigit(n)];
}

function outwardRead(n: number): string {
  return lookup(OUTWARD_READ, n) ?? `themes of ${n}`;
}

function innerPull(n: number): string {
  return lookup(INNER_PULL, n) ?? `themes of ${n}`;
}

function faceTags(n: number): FaceTags {
  return lookup(FACE, n) ?? FACE[reduceToSingleDigit(n)] ?? FACE[5]!;
}

function wantTags(n: number): WantTags {
  return lookup(WANT, n) ?? WANT[reduceToSingleDigit(n)] ?? WANT[5]!;
}

function classifyKind(suRaw: number, peRaw: number): InnerOuterKind {
  const suN = reduceToSingleDigit(suRaw);
  const peN = reduceToSingleDigit(peRaw);
  if (suRaw === peRaw || suN === peN) return "same";

  const face = faceTags(peRaw);
  const want = wantTags(suRaw);

  if (face.access === "open" && want.access === "private") {
    return "open-face-private-want";
  }
  if (face.access === "closed" && want.access === "connective") {
    return "closed-face-connective-want";
  }
  if (face.weight === "light" && want.weight === "heavy") {
    return "light-face-heavy-want";
  }
  if (face.weight === "strong" && want.weight === "soft") {
    return "strong-face-soft-want";
  }
  return "same-direction";
}

function bandFor(kind: InnerOuterKind): AlignmentBand {
  if (kind === "same") return "aligned";
  if (kind === "same-direction") return "complementary";
  return "tension";
}

function finish(p: Omit<InnerOuterPattern, "balanced">): InnerOuterPattern {
  return { ...p, balanced: p.tryLine };
}

function familySame(su: string, pe: string, suRaw: number, peRaw: number): InnerOuterPattern {
  const sameDigit = suRaw === peRaw;
  return finish({
    kind: "same",
    band: "aligned",
    looksLike: sameDigit
      ? `People meet ${outwardRead(peRaw)} (${pe}). Inside you want the same theme: ${innerPull(suRaw)} (${su}). What they see is close to what you want.`
      : `Soul Urge ${su} and Personality ${pe} share one reduced digit. People meet ${outwardRead(peRaw)}; inside you want ${innerPull(suRaw)}. They are the same family, not two separate people.`,
    watch: `When nothing pushes back, ${plainWatch(suRaw)} can run unchecked — because the outside does not disagree.`,
    tryLine: `Try: ${plainJob(suRaw)}. Stay honest when it would be easier to perform the number.`,
    meet: `The inside and the outside share ${plainTrait(suRaw)}. The work is living it honestly, not acting it.`,
    overInner: `You may be living the inner want with no rest. Try one pause, then ${plainJob(suRaw)} once — not all day.`,
    overOuter: `You may be performing the number for the room. Try one private check: is this still what you want, or only what they expect?`,
    overInnerWatch: `Watch: staying inside the want so long that people only meet the tired version of ${plainTrait(peRaw)}.`,
    overOuterWatch: `Watch: keeping the face going after the inner want has already said enough.`,
  });
}

function familyLightFaceHeavyWant(
  su: string,
  pe: string,
  suRaw: number,
  peRaw: number,
): InnerOuterPattern {
  return finish({
    kind: "light-face-heavy-want",
    band: "tension",
    looksLike: `People meet ${outwardRead(peRaw)} (${pe}). What you want is heavier: ${innerPull(suRaw)} (${su}). The light front is real; it is just not the whole ask.`,
    watch: `Because the front looks light, people may hand you the heavy work and assume it costs you nothing, or skip you for the serious roles you privately want. Watch for saying yes in a light voice to something heavy.`,
    tryLine: `Try naming one thing you want kept — a plan, a promise, a standing time — in the same easy voice you greet people with. The lighter front does not have to be traded for the inner want.`,
    meet: `The lighter face (${pe}) can still make room for ${innerPull(suRaw)} (${su}) — if you let people see that the easy front is not the whole job.`,
    overInner: `If the inner want is running everything today, the light front may have vanished. Try one small, easy greeting before you take on another heavy yes.`,
    overOuter: `If the light front is running everything today, the inner want may be starving. Name one real need in the same easy voice — then stop talking.`,
    overInnerWatch: `Watch: taking on care, plans, or promises until there is no rest, while still smiling as if it were easy.`,
    overOuterWatch: `Watch: keeping the room light so long that nobody knows you wanted something kept.`,
  });
}

function familyStrongFaceSoftWant(
  su: string,
  pe: string,
  suRaw: number,
  peRaw: number,
): InnerOuterPattern {
  return finish({
    kind: "strong-face-soft-want",
    band: "tension",
    looksLike: `People meet ${outwardRead(peRaw)} (${pe}). Underneath you want something gentler: ${innerPull(suRaw)} (${su}). The strong front can hide how much you need ease.`,
    watch: `People may bring you the hard jobs and miss that you want ${innerPull(suRaw)}. Watch for holding the strong face so long that the inner want never gets a turn.`,
    tryLine: `Try letting one person see a smaller ask — ${plainJob(suRaw)} — without dropping the competence they already trust.`,
    meet: `The stronger face (${pe}) can protect the inner want (${su}) if you use it as a door, not a wall.`,
    overInner: `If the inner want is running everything today, the strong face may have dropped. Ask for one gentle thing, then put the competent front back on for the next hour only.`,
    overOuter: `If the strong face is running everything today, try one private minute for ${plainJob(suRaw)} before you take the next hard job.`,
    overInnerWatch: `Watch: disappearing into the gentler want so the people who rely on the strong face feel abandoned.`,
    overOuterWatch: `Watch: taking every hard job because the face looks like it can, while the inner want goes unfed.`,
  });
}

function familyOpenFacePrivateWant(
  su: string,
  pe: string,
  suRaw: number,
  peRaw: number,
): InnerOuterPattern {
  return finish({
    kind: "open-face-private-want",
    band: "tension",
    looksLike: `People meet ${outwardRead(peRaw)} (${pe}), so you can look available. Inside you want ${innerPull(suRaw)} (${su}) — room to think, not more company.`,
    watch: `Because you look open, people may keep talking after you are done. Watch for staying available past the point of quiet.`,
    tryLine: `Try: greet in the open way, then ${plainJob(suRaw)}. Say when you will come back, so the quiet is a plan, not a disappearance.`,
    meet: `The open face (${pe}) can buy the private want (${su}) some cover — if you leave before you are empty.`,
    overInner: `If you have gone fully quiet today, send one short signal that you are still in — then keep the rest of the quiet.`,
    overOuter: `If you have been available all day, take the next ten minutes for ${plainJob(suRaw)} and say when you will be back.`,
    overInnerWatch: `Watch: going so quiet that people think the open face was a lie.`,
    overOuterWatch: `Watch: staying in the open face until there is no quiet left for the inner want.`,
  });
}

function familyClosedFaceConnectiveWant(
  su: string,
  pe: string,
  suRaw: number,
  peRaw: number,
): InnerOuterPattern {
  return finish({
    kind: "closed-face-connective-want",
    band: "tension",
    looksLike: `People meet ${outwardRead(peRaw)} (${pe}), so you can look distant. Inside you want ${innerPull(suRaw)} (${su}). The closed face may hide a wish to be close.`,
    watch: `People may not offer closeness because the front does not ask for it. Watch for waiting to be invited while looking like you do not want company.`,
    tryLine: `Try one small signal that you want in — ${plainJob(suRaw)} — without dropping the steady front they already know.`,
    meet: `The quieter face (${pe}) can still make a place for ${innerPull(suRaw)} (${su}) if you let one person past the first impression.`,
    overInner: `If the inner want for closeness is running everything today, pick one person — not the whole room — and ${plainJob(suRaw)}.`,
    overOuter: `If the closed face is running everything today, let one person know you wanted company. One sentence is enough.`,
    overInnerWatch: `Watch: asking for closeness from everyone at once, then being surprised when the closed face still shows.`,
    overOuterWatch: `Watch: looking so self-contained that nobody guesses you wanted to be included.`,
  });
}

function familySameDirection(
  su: string,
  pe: string,
  suRaw: number,
  peRaw: number,
): InnerOuterPattern {
  return finish({
    kind: "same-direction",
    band: "complementary",
    looksLike: `People meet ${outwardRead(peRaw)} (${pe}). Inside you want ${innerPull(suRaw)} (${su}). They point a similar way, even though the digits differ.`,
    watch: `Doing only the outer one because it is easier. The inner want still needs a turn.`,
    tryLine: `Try: ${plainJob(peRaw)}, then ${plainJob(suRaw)}.`,
    meet: `The outer face (${pe}) and the inner want (${su}) can help each other when each gets a turn.`,
    overInner: `If the inner want has the whole day, give the outer face one short job: ${plainJob(peRaw)}.`,
    overOuter: `If the outer face has the whole day, give the inner want one short job: ${plainJob(suRaw)}.`,
    overInnerWatch: `Watch: feeding only ${plainTrait(suRaw)} and wondering why people still meet ${plainTrait(peRaw)}.`,
    overOuterWatch: `Watch: doing only ${plainTrait(peRaw)} because it is easier to show.`,
  });
}

function fromFamily(
  kind: InnerOuterKind,
  su: string,
  pe: string,
  suRaw: number,
  peRaw: number,
): InnerOuterPattern {
  switch (kind) {
    case "same":
      return familySame(su, pe, suRaw, peRaw);
    case "light-face-heavy-want":
      return familyLightFaceHeavyWant(su, pe, suRaw, peRaw);
    case "strong-face-soft-want":
      return familyStrongFaceSoftWant(su, pe, suRaw, peRaw);
    case "open-face-private-want":
      return familyOpenFacePrivateWant(su, pe, suRaw, peRaw);
    case "closed-face-connective-want":
      return familyClosedFaceConnectiveWant(su, pe, suRaw, peRaw);
    default:
      return familySameDirection(su, pe, suRaw, peRaw);
  }
}

type OverrideSpec = Partial<InnerOuterPattern> & { kind?: InnerOuterKind };

function applyOverride(
  base: InnerOuterPattern,
  spec: OverrideSpec,
): InnerOuterPattern {
  const kind = spec.kind ?? base.kind;
  const merged: InnerOuterPattern = {
    ...base,
    ...spec,
    kind,
    band: spec.band ?? bandFor(kind),
  };
  return { ...merged, balanced: spec.tryLine ?? merged.tryLine };
}

/**
 * Bespoke copy for common pairings. Key is "soulUrge-personality"
 * using the chart's displayed digits (masters stay unreduced).
 */
const OVERRIDES: Record<string, OverrideSpec> = {
  "6-3": {
    kind: "light-face-heavy-want",
    looksLike:
      "People meet an easy, chatty front (3). What you want is to be counted on — home, care, promises kept (6). The light front is real; it is just not the whole ask.",
    watch:
      "Because the front looks light, people may hand you the caring and assume it costs you nothing, or skip you for the serious roles you privately want. Watch for saying yes in a light voice to something heavy.",
    tryLine:
      "Try naming one thing you want kept — a plan, a promise, a standing time — in the same easy voice you greet people with. The charm does not have to be traded for depth.",
    meet: "The easy, chatty front (3) can make a warm place where care and promises (6) actually happen — if you let people see that the play is not the whole job.",
    overInner:
      "If caretaking has the whole day, the chatty front may have vanished. Try one small, easy greeting before you take on another yes.",
    overOuter:
      "If the chatty front has the whole day, name one real need — a plan, a promise, a standing time — in that same easy voice, then stop talking.",
    overInnerWatch:
      "Watch: saying yes to every caretaking job until there is no rest, while still looking as if it were play.",
    overOuterWatch:
      "Watch: keeping every talk light so long that nobody knows you wanted something kept.",
  },
  "3-6": {
    kind: "closed-face-connective-want",
    looksLike:
      "People meet someone who looks after others and keeps house (6). Inside you want talk, play, and sharing ideas (3). The responsible face can hide a wish to keep things lighter.",
    watch:
      "People may bring you the caring jobs and miss that you wanted play. Watch for becoming the reliable one in every room while the inner want for ideas goes unused.",
    tryLine:
      "Try keeping one promise (6) and still finishing one thing you started saying (3). The care does not have to cancel the play.",
    meet: "The caring face (6) can still leave room for talk and ideas (3) if you let one playful thing stay on the list.",
    overInner:
      "If the wish for play has the whole day, keep one small promise first — then take the lighter hour.",
    overOuter:
      "If the caring face has the whole day, finish one thing you started saying before you take on another household yes.",
    overInnerWatch:
      "Watch: chasing talk and ideas until the promises other people were waiting on slip.",
    overOuterWatch:
      "Watch: looking so responsible that nobody invites the playful part of you in.",
  },
  "7-8": {
    kind: "strong-face-soft-want",
    looksLike:
      "People meet someone who pushes for a result (8). Inside you want quiet thinking and study, with room to be left alone (7). The strong front can hide how much you need a pause.",
    watch:
      "People may bring you the hard, measurable jobs and miss that you wanted quiet. Watch for holding the results face so long that there is no study left.",
    tryLine:
      "Try finishing one real result, then rest (8) — and take ten quiet minutes before you answer (7). The push and the pause can share a day.",
    meet: "The results face (8) can protect the quiet want (7) if you use competence as a door: one finished thing, then a closed door for thinking.",
    overInner:
      "If you have gone fully quiet today, finish one small, visible result so people know you are still in — then keep the rest of the pause.",
    overOuter:
      "If the results face has the whole day, take ten quiet minutes before you answer the next demand.",
    overInnerWatch:
      "Watch: going so quiet that people think the capable face was a lie.",
    overOuterWatch:
      "Watch: pushing for results with no pause until the inner want for study has nowhere to go.",
  },
  "8-7": {
    kind: "open-face-private-want",
    looksLike:
      "People meet someone quiet and hard to read (7). Inside you want real results, plans, and responsibility (8). The quiet face can hide a wish to finish something that counts.",
    watch:
      "People may leave you out of the hard jobs because you look like you want to be left alone. Watch for waiting to be asked while privately wanting a real result.",
    tryLine:
      "Try one visible result (8) without dropping the quiet front. A short update can be enough.",
    meet: "The quiet face (7) can still carry a real result (8) if you let one person see the work, not only the pause.",
    overInner:
      "If the wish for results is running everything today, take the pause after one finished thing — not before any work starts.",
    overOuter:
      "If the quiet face has the whole day, name one result you want finished, even if you still do it alone.",
    overInnerWatch:
      "Watch: pushing for a result with no pause, then wondering why the quiet face no longer fits.",
    overOuterWatch:
      "Watch: staying so unreadable that nobody hands you the work you privately wanted.",
  },
  "2-8": {
    kind: "strong-face-soft-want",
    looksLike:
      "People meet someone who pushes for a result (8). Underneath you want patience, partnership, and not standing alone (2). The strong front can hide how much you need a teammate.",
    watch:
      "People may bring you the hard jobs and miss that you wanted to wait and work with someone. Watch for holding the results face so long that partnership never starts.",
    tryLine:
      "Try finishing one real result, then rest — and still wait and work with one other person on the next thing.",
    meet: "The results face (8) can make a safer partnership (2) if you let one person share the load, not only the outcome.",
    overInner:
      "If the wish for partnership is running everything today, still close one small result so the waiting has a floor.",
    overOuter:
      "If the results face has the whole day, ask one other person to take a turn before you push again.",
    overInnerWatch:
      "Watch: waiting so long for a partner that the result never starts.",
    overOuterWatch:
      "Watch: pushing for results alone because the face looks like it does not need anyone.",
  },
  "8-2": {
    kind: "light-face-heavy-want",
    looksLike:
      "People meet someone patient who works with others (2). What you want is heavier: real results, plans, and responsibility (8). The gentle front is real; it is just not the whole ask.",
    watch:
      "Because the front looks patient, people may not expect you to want a hard result. Watch for smoothing things over while privately wanting a number on the board.",
    tryLine:
      "Try naming one result you want, in the same patient voice you already use with people. Then rest.",
    meet: "The patient face (2) can still carry a real result (8) if you let people know what finished looks like.",
    overInner:
      "If the wish for results is running everything today, keep one other person in the loop so the push does not become a solo march.",
    overOuter:
      "If the patient face has the whole day, name one result before you wait any longer.",
    overInnerWatch:
      "Watch: pushing for a result with no pause and no partner.",
    overOuterWatch:
      "Watch: waiting and smoothing so long that the result you wanted never gets a day.",
  },
  "6-1": {
    kind: "strong-face-soft-want",
    looksLike:
      "People meet someone who starts and decides (1). Underneath you want to be counted on — home, care, and promises kept (6). The independent front can hide how much you want to look after people.",
    watch:
      "People may treat you as the one who goes first and miss that you wanted to keep house. Watch for starting alone so often that the care never gets a kitchen.",
    tryLine:
      "Try starting one small thing (1) that also keeps a promise (6) — a decision that makes a warmer place, not only a new one.",
    meet: "The starting face (1) can still make a caring place (6) if the first move is toward someone, not away from them.",
    overInner:
      "If caretaking has the whole day, make one independent decision — then return to the promise.",
    overOuter:
      "If the independent face has the whole day, keep one small promise that is about home or care, not only a new start.",
    overInnerWatch:
      "Watch: saying yes to every caretaking job and never starting the thing that was yours.",
    overOuterWatch:
      "Watch: starting so many things alone that the people you wanted to care for only meet the exit.",
  },
  "1-6": {
    kind: "closed-face-connective-want",
    looksLike:
      "People meet someone who looks after people and keeps house (6). Inside you want to start things and decide for yourself (1). The caring face can hide a wish to go first.",
    watch:
      "People may bring you the household jobs and miss that you wanted to decide. Watch for becoming everyone else's start while your own start waits.",
    tryLine:
      "Try keeping one promise, then start one small thing that is yours. The care does not have to cancel the decision.",
    meet: "The caring face (6) can still leave room for a first move (1) if one decision stays yours.",
    overInner:
      "If the wish to start is running everything today, keep one promise first so the new thing has a floor.",
    overOuter:
      "If the caring face has the whole day, start one small thing that nobody asked you for.",
    overInnerWatch:
      "Watch: starting so many things that the promises at home slip.",
    overOuterWatch:
      "Watch: looking after everyone until there is no decision left that is yours.",
  },
  "4-5": {
    kind: "light-face-heavy-want",
    looksLike:
      "People meet someone who likes change and room to move (5). What you want is heavier: plans, routines, and work that holds (4). The free front is real; it is just not the whole ask.",
    watch:
      "Because the front looks ready to change, people may not expect you to want a repeating plan. Watch for saying yes to every new thing in a light voice while privately wanting the week to hold.",
    tryLine:
      "Try writing one repeating plan, then try one small change inside it — not instead of it.",
    meet: "The changeable face (5) can still protect a steady plan (4) if you let people see what is not up for grabs.",
    overInner:
      "If the wish for routine is running everything today, try one small change so the plan does not become a cage.",
    overOuter:
      "If the changeable face has the whole day, write one repeating plan before you say yes to the next new thing.",
    overInnerWatch:
      "Watch: planning so long that the week never starts.",
    overOuterWatch:
      "Watch: changing course every day until the inner want for a holding plan has nowhere to live.",
  },
  "5-4": {
    kind: "closed-face-connective-want",
    looksLike:
      "People meet someone planned and steady (4). Inside you want change, freedom, and trying new things (5). The steady face can hide a wish to move.",
    watch:
      "People may count on you for the routine and miss that you wanted a try. Watch for becoming the plan while the inner want for change goes unused.",
    tryLine:
      "Try writing one repeating plan, then try one small change on purpose. The structure can hold the experiment.",
    meet: "The steady face (4) can still make room for a try (5) if one slot in the week is allowed to move.",
    overInner:
      "If the wish for change is running everything today, keep one repeating plan so the rest of the week still holds.",
    overOuter:
      "If the planned face has the whole day, try one small change before the week is over.",
    overInnerWatch:
      "Watch: changing course every day until nothing holds.",
    overOuterWatch:
      "Watch: planning so long that the inner want for a try never gets a day.",
  },
  "7-3": {
    kind: "open-face-private-want",
    looksLike:
      "People meet an easy, chatty front (3), so you can look available. Inside you want quiet thinking and study, with room to be left alone (7).",
    watch:
      "Because you look open, people may keep talking after you are done. Watch for staying in the chatty face past the point of quiet.",
    tryLine:
      "Try finishing one thing you started saying, then take ten quiet minutes before you answer. Say when you will come back.",
    meet: "The chatty face (3) can buy the private want (7) some cover — if you leave the talk before you are empty.",
    overInner:
      "If you have gone fully quiet today, send one short, easy line so people know you are still in — then keep the rest of the pause.",
    overOuter:
      "If the chatty face has the whole day, take ten quiet minutes before the next answer.",
    overInnerWatch:
      "Watch: going so quiet that people think the easy front was a lie.",
    overOuterWatch:
      "Watch: starting many talks and closing none, until there is no study left.",
  },
  "3-7": {
    kind: "closed-face-connective-want",
    looksLike:
      "People meet someone quiet and hard to read (7). Inside you want talk, play, and sharing ideas (3). The closed face may hide a wish to be in the conversation.",
    watch:
      "People may not invite you in because the front does not ask. Watch for waiting to be included while looking like you want to be left alone.",
    tryLine:
      "Try one small share — finish one thing you started saying — without dropping the quiet they already know.",
    meet: "The quiet face (7) can still make room for talk and ideas (3) if you let one person past the first impression.",
    overInner:
      "If the wish to talk is running everything today, keep one pause so the ideas have somewhere to land.",
    overOuter:
      "If the quiet face has the whole day, say one unfinished idea out loud to one person.",
    overInnerWatch:
      "Watch: starting many talks and closing none.",
    overOuterWatch:
      "Watch: looking so unreadable that nobody guesses you wanted in.",
  },
  "7-5": {
    kind: "open-face-private-want",
    looksLike:
      "People meet someone who likes change and room to move (5), so you can look available. Inside you want quiet thinking and study (7) — room to be left alone, not another experiment.",
    watch:
      "Because you look ready to move, people may keep offering new things after you are done. Watch for saying yes to change when you wanted a pause.",
    tryLine:
      "Try one small change, then take ten quiet minutes before you answer the next one. The quiet is a plan, not a disappearance.",
    meet: "The changeable face (5) can still protect a private want (7) if you leave before the next experiment starts.",
    overInner:
      "If you have gone fully quiet today, try one small, visible change so people know you are still in.",
    overOuter:
      "If the changeable face has the whole day, take ten quiet minutes before you agree to the next new thing.",
    overInnerWatch:
      "Watch: going so quiet that people think you do not care about the moving world.",
    overOuterWatch:
      "Watch: changing course every day until the inner want for study has nowhere to sit.",
  },
  "5-7": {
    kind: "closed-face-connective-want",
    looksLike:
      "People meet someone quiet and hard to read (7). Inside you want change, freedom, and trying new things (5). The closed face may hide a wish to move.",
    watch:
      "People may leave you out of the new thing because you look like you want to be left alone. Watch for waiting to be invited into a change you privately wanted.",
    tryLine:
      "Try one small change and tell one person. The quiet face can still take a trip.",
    meet: "The quiet face (7) can still make room for a try (5) if you let one person see the wish to move.",
    overInner:
      "If the wish for change is running everything today, keep one quiet hour so the new thing has a floor.",
    overOuter:
      "If the quiet face has the whole day, try one small change before the week is over.",
    overInnerWatch:
      "Watch: changing course every day with no pause to think.",
    overOuterWatch:
      "Watch: looking so still that nobody offers you the experiment you wanted.",
  },
  "4-3": {
    kind: "open-face-private-want",
    looksLike:
      "People meet an easy, chatty front (3), so you can look available. Inside you want plans, routines, and work that holds (4) — not more talk.",
    watch:
      "Because you look open, people may keep talking after you wanted a plan. Watch for staying in the chatty face until the week never starts.",
    tryLine:
      "Try finishing one thing you started saying, then write one repeating plan. Say when the talk is done.",
    meet: "The chatty face (3) can still protect a holding plan (4) if you close the talk before the routine slips.",
    overInner:
      "If the wish for a plan is running everything today, finish one thing you started saying so people are not left mid-air.",
    overOuter:
      "If the chatty face has the whole day, write one repeating plan before another talk starts.",
    overInnerWatch:
      "Watch: planning so long that the week never starts, and the easy face disappears.",
    overOuterWatch:
      "Watch: starting many talks and closing none, until the inner want for a holding plan has no calendar.",
  },
  "3-4": {
    kind: "closed-face-connective-want",
    looksLike:
      "People meet someone planned and steady (4). Inside you want talk, play, and sharing ideas (3). The steady face may hide a wish to be in the conversation.",
    watch:
      "People may count on you for the plan and miss that you wanted play. Watch for becoming the schedule while the inner want for ideas goes unused.",
    tryLine:
      "Try writing one repeating plan, then finish one thing you started saying. The structure can hold the play.",
    meet: "The planned face (4) can still make room for talk and ideas (3) if one slot in the week is allowed to be unfinished.",
    overInner:
      "If the wish to talk is running everything today, keep one repeating plan so the ideas have a floor.",
    overOuter:
      "If the planned face has the whole day, finish one thing you started saying before you add another routine.",
    overInnerWatch:
      "Watch: starting many talks and closing none.",
    overOuterWatch:
      "Watch: planning so long that the inner want for play never gets a day.",
  },
  "2-7": {
    kind: "closed-face-connective-want",
    looksLike:
      "People meet someone quiet and hard to read (7). Inside you want patience, partnership, and not standing alone (2). The closed face may hide a wish to be close.",
    watch:
      "People may not offer partnership because the front does not ask for it. Watch for waiting to be invited while looking like you do not want company.",
    tryLine:
      "Try one small signal that you want in — wait and work with one other person — without dropping the quiet they already know.",
    meet: "The quiet face (7) can still make a place for partnership (2) if you let one person past the first impression.",
    overInner:
      "If the wish for closeness is running everything today, pick one person — not the whole room — and work with them.",
    overOuter:
      "If the quiet face has the whole day, let one person know you wanted company. One sentence is enough.",
    overInnerWatch:
      "Watch: waiting so long that nothing is said, then wondering why nobody came.",
    overOuterWatch:
      "Watch: looking so self-contained that nobody guesses you wanted a teammate.",
  },
  "7-2": {
    kind: "open-face-private-want",
    looksLike:
      "People meet someone patient who works with others (2), so you can look available. Inside you want quiet thinking and study (7) — room to be left alone.",
    watch:
      "Because you look like a partner, people may keep including you after you are done. Watch for staying in the patient face past the point of quiet.",
    tryLine:
      "Try working with one other person, then take ten quiet minutes before you answer. Say when you will come back.",
    meet: "The patient face (2) can buy the private want (7) some cover — if you leave the partnership before you are empty.",
    overInner:
      "If you have gone fully quiet today, send one short signal to the person you work with — then keep the rest of the pause.",
    overOuter:
      "If the available face has the whole day, take ten quiet minutes before you agree to the next joint thing.",
    overInnerWatch:
      "Watch: going so quiet that the partner thinks you do not care.",
    overOuterWatch:
      "Watch: waiting and smoothing so long that there is no study left.",
  },
  "6-4": {
    kind: "closed-face-connective-want",
    looksLike:
      "People meet someone planned and steady (4), so you can look self-contained. Inside you want to be counted on — home, care, and promises kept (6). The closed plan may hide a wish to be close.",
    watch:
      "People may not bring you the caring jobs because the front looks like a schedule, not a kitchen. Watch for waiting to be needed while looking too busy to be asked.",
    tryLine:
      "Try keeping one promise that is about a person, not only a plan. The routine can still hold.",
    meet: "The planned face (4) can still make a caring place (6) if you let one person past the calendar.",
    overInner:
      "If caretaking has the whole day, write one repeating plan so the care has a floor — and a stop.",
    overOuter:
      "If the planned face has the whole day, keep one promise that is about home or care, not only the list.",
    overInnerWatch:
      "Watch: saying yes until you have no rest, while the plan that was meant to protect you sits unused.",
    overOuterWatch:
      "Watch: looking so scheduled that nobody guesses you wanted to be the person they come home to.",
  },
  "4-6": {
    kind: "open-face-private-want",
    looksLike:
      "People meet someone who looks after people and keeps house (6), so you can look available. Inside you want plans, routines, and work that holds (4) — not more yeses.",
    watch:
      "Because you look like the caring one, people may keep asking after you wanted a repeating plan. Watch for staying available until the week never starts.",
    tryLine:
      "Try keeping one promise, then write one repeating plan. The care needs a calendar, not only a yes.",
    meet: "The caring face (6) can still protect a holding plan (4) if you let the list say no.",
    overInner:
      "If the wish for a plan is running everything today, keep one promise so people are not left waiting.",
    overOuter:
      "If the caring face has the whole day, write one repeating plan before you take on another yes.",
    overInnerWatch:
      "Watch: planning so long that the people you care for feel postponed.",
    overOuterWatch:
      "Watch: saying yes until you have no rest, and the inner want for a holding plan has no day.",
  },
};

export function buildInnerOuterPattern(
  soulUrge: string,
  personality: string,
): InnerOuterPattern {
  const su = String(soulUrge);
  const pe = String(personality);
  const suRaw = asNum(su);
  const peRaw = asNum(pe);
  const kind = classifyKind(suRaw, peRaw);
  const base = fromFamily(kind, su, pe, suRaw, peRaw);
  const spec = OVERRIDES[`${su}-${pe}`];
  return spec ? applyOverride(base, spec) : base;
}

export type TensionStop = 0 | 1 | 2;

export function microForTensionStop(
  pattern: InnerOuterPattern,
  stop: TensionStop,
): { tone: string; tension: string; gift: string } {
  if (stop === 0) {
    return {
      tone: pattern.looksLike,
      tension: pattern.overInnerWatch,
      gift: pattern.overInner,
    };
  }
  if (stop === 2) {
    return {
      tone: pattern.looksLike,
      tension: pattern.overOuterWatch,
      gift: pattern.overOuter,
    };
  }
  return {
    tone: pattern.looksLike,
    tension: pattern.watch,
    gift: pattern.balanced,
  };
}
