import mammoth from "mammoth";
import { RecipeSchema } from "../schemas/recipeSchema.js";

/**
 * Turn a .docx file from Drive into the app’s recipe shape (one document = one recipe).
 *
 * Expected layout (see `src/data/recipeTemplate.txt`):
 * - First line: recipe title (also used as title; filename is fallback).
 * - Block under **המרכיבים / מרכיבים** (header line): ingredient lines until **אופן ההכנה**.
 * - Block under **אופן ההכנה**: **blank lines** separate sections. Each non-empty block (one or
 *   more consecutive lines) becomes one section with a single step; optional leading `1.` / `2.`
 *   on a line is stripped from the text.
 */
export async function recipeFromDocxArrayBuffer(fileId, fileName, arrayBuffer) {
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  const text = (value || "").trim();
  const fallbackTitle = displayTitleFromFileName(fileName);
  const parsed = parseRecipeBody(text, fallbackTitle);
  const recipe = {
    id: fileId,
    title: parsed.title,
    category: "כללי",
    tags: [],
    emoji: "📄",
    cookTime: "—",
    servings: 4,
    ingredients: parsed.ingredients,
    sections: parsed.sections,
  };
  return RecipeSchema.parse(recipe);
}

function displayTitleFromFileName(fileName) {
  const base = (fileName || "").replace(/\.docx$/i, "").trim();
  return base || "מתכון";
}

/** @param {string} line */
function normalizeHeaderKey(line) {
  return line
    .trim()
    .replace(/\s+/g, " ")
    .replace(/:+$/, "")
    .replace(/^:+/, "");
}

/** @param {string} line */
function isIngredientsHeader(line) {
  const k = normalizeHeaderKey(line);
  return k === "מרכיבים" || k === "המרכיבים";
}

/** @param {string} line */
function isInstructionsHeader(line) {
  const k = normalizeHeaderKey(line);
  return k === "אופן ההכנה" || k === "אופן הכנה";
}

/** @param {string} s */
function normTitle(s) {
  return s.trim().replace(/\s+/g, " ");
}

/**
 * @param {string} text
 * @param {string} fallbackTitle
 */
function parseRecipeBody(text, fallbackTitle) {
  const lines = text.split(/\r?\n/).map((l) => l.trim());

  const ingIdx = lines.findIndex((l) => l && isIngredientsHeader(l));
  const prepIdx = lines.findIndex((l) => l && isInstructionsHeader(l));

  if (ingIdx >= 0 && prepIdx > ingIdx) {
    const titleLines = lines.slice(0, ingIdx).filter(Boolean);
    const title = titleLines[0] ? normTitle(titleLines[0]) : fallbackTitle;
    const ingLines = lines.slice(ingIdx + 1, prepIdx).filter(Boolean);
    const stepLines = lines.slice(prepIdx + 1);
    const ingredients = parseIngredientLines(ingLines);
    let sections = parseInstructionSections(stepLines);
    sections = dropDuplicateTitleInFirstSection(sections, title);
    return { title, ingredients, sections };
  }

  if (ingIdx < 0 && prepIdx >= 0) {
    const titleLines = lines.slice(0, prepIdx).filter(Boolean);
    const title = titleLines[0] ? normTitle(titleLines[0]) : fallbackTitle;
    const stepLines = lines.slice(prepIdx + 1);
    let sections = parseInstructionSections(stepLines);
    sections = dropDuplicateTitleInFirstSection(sections, title);
    return { title, ingredients: [], sections };
  }

  if (ingIdx >= 0 && prepIdx === -1) {
    const titleLines = lines.slice(0, ingIdx).filter(Boolean);
    const title = titleLines[0] ? normTitle(titleLines[0]) : fallbackTitle;
    const ingLines = lines.slice(ingIdx + 1).filter(Boolean);
    const ingredients = parseIngredientLines(ingLines);
    return {
      title,
      ingredients,
      sections: [
        {
          title: "הכנה",
          steps: [{ id: "s0-0", text: "(אין שלבי הכנה — הוסיפו מקטע «אופן ההכנה» במסמך)", timer: null, warning: null }],
        },
      ],
    };
  }

  return parseFallbackBody(lines, fallbackTitle);
}

/**
 * When template headers are missing: first line → title, rest → steps (legacy behavior).
 * @param {string[]} lines
 * @param {string} fallbackTitle
 */
function parseFallbackBody(lines, fallbackTitle) {
  const nonEmpty = lines.filter(Boolean);
  const title = nonEmpty[0] ? normTitle(nonEmpty[0]) : fallbackTitle;
  const rest = nonEmpty.slice(1);
  let steps = paragraphChunksToSteps(rest.join("\n"), 0);
  const sections = dropDuplicateTitleInFirstSection([{ title: "הכנה", steps }], title);
  return { title, ingredients: [], sections };
}

/**
 * @param {{ title: string, steps: { id: string, text: string, timer: null, warning: null }[] }[]} sections
 * @param {string} title
 */
function dropDuplicateTitleInFirstSection(sections, title) {
  if (sections.length === 0) return sections;
  const [first, ...rest] = sections;
  const steps = first.steps;
  if (steps.length === 0) return sections;
  const t = normTitle(title);
  const firstStep = normTitle(steps[0].text);
  if (firstStep === t) {
    return [{ ...first, steps: steps.slice(1) }, ...rest];
  }
  return sections;
}

/** @param {string} block @param {number} sectionIdx */
function paragraphChunksToSteps(block, sectionIdx) {
  if (!block.trim()) {
    return [{ id: `s${sectionIdx}-0`, text: "(המסמך ריק)", timer: null, warning: null }];
  }
  let chunks = block
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (chunks.length === 1 && chunks[0].includes("\n")) {
    chunks = chunks[0]
      .split(/\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return chunks.map((paragraph, i) => ({
    id: `s${sectionIdx}-${i}`,
    text: paragraph.replace(/\n/g, " "),
    timer: null,
    warning: null,
  }));
}

function isBlankLine(line) {
  return !line || !String(line).trim();
}

/**
 * Groups of consecutive non-empty lines; one or more blank lines separate groups.
 * @param {string[]} lines
 * @returns {string[][]}
 */
function splitIntoBlankLineBlocks(lines) {
  /** @type {string[][]} */
  const blocks = [];
  /** @type {string[]} */
  let current = [];
  for (const line of lines) {
    if (isBlankLine(line)) {
      if (current.length) {
        blocks.push(current);
        current = [];
      }
    } else {
      current.push(line.trim());
    }
  }
  if (current.length) blocks.push(current);
  return blocks;
}

/** Strip Word-style list prefix from the start of a paragraph (optional). */
function stripLeadingStepNumber(text) {
  return text.replace(/^\s*\d+[.)]\s+/, "").trim();
}

/**
 * Split אופן ההכנה into sections: **blank lines** delimit blocks; each block is one section with
 * one step (lines in the same block are joined with spaces).
 * @param {string[]} lines
 */
function parseInstructionSections(lines) {
  const blocks = splitIntoBlankLineBlocks(lines);
  if (blocks.length === 0) {
    return [
      {
        title: "הכנה",
        steps: [{ id: "s0-0", text: "(אין שלבי הכנה)", timer: null, warning: null }],
      },
    ];
  }

  return blocks.map((blockLines, i) => {
    const raw = blockLines.join(" ").replace(/\s+/g, " ").trim();
    const text = stripLeadingStepNumber(raw);
    const sectionTitle = blocks.length === 1 ? "הכנה" : '';
    return {
      title: sectionTitle,
      steps: [
        {
          id: `s${i}-0`,
          text: text || "(ריק)",
          timer: null,
          warning: null,
        },
      ],
    };
  });
}

/**
 * @param {string[]} lines
 */
function parseIngredientLines(lines) {
  /** @type {{ id: string, name: string, amount: number, unit: string }[]} */
  const out = [];
  let idx = 0;
  for (const line of lines) {
    if (!line) continue;
    const ing = parseIngredientLine(line, idx);
    if (ing) {
      out.push(ing);
      idx += 1;
    }
  }
  return out;
}

/** Common Hebrew measure words after a leading number */
const MEASURE_WORDS = new Set([
  "כוס",
  "כוסות",
  "כפות",
  "כף",
  "כפית",
  "כפיות",
  "גרם",
  "ק״ג",
  'ק"ג',
  'מ"ל',
  "ליטר",
  "מיליליטר",
  "מל",
]);

/**
 * @param {string} line
 * @param {number} index
 */
function parseIngredientLine(line, index) {
  const raw = line.trim();
  if (!raw) return null;

  const id = `i${index}`;

  const tryAmount = (amount, rest) => {
    const trimmed = rest.trim();
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return { id, name: raw, amount, unit: "" };
    }
    const [w0, ...restWords] = parts;
    if (MEASURE_WORDS.has(w0)) {
      if (restWords.length) {
        return { id, name: restWords.join(" "), amount, unit: w0 };
      }
      return { id, name: raw, amount, unit: "" };
    }
    return { id, name: trimmed, amount, unit: "" };
  };

  const frac = raw.match(/^(\d+\/\d+)\s+(.+)$/);
  if (frac) {
    const amount = parseFractionToken(frac[1]);
    return tryAmount(amount, frac[2]);
  }

  const dec = raw.match(/^(\d+\.\d+)\s+(.+)$/);
  if (dec) {
    const amount = parseFloat(dec[1]);
    return tryAmount(amount, dec[2]);
  }

  const whole = raw.match(/^(\d+)\s+(.+)$/);
  if (whole) {
    const amount = parseInt(whole[1], 10);
    return tryAmount(amount, whole[2]);
  }

  return { id, name: raw, amount: 1, unit: "" };
}

/** @param {string} s e.g. "1/4" */
function parseFractionToken(s) {
  const m = s.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (!m) return 0;
  const a = parseInt(m[1], 10);
  const b = parseInt(m[2], 10);
  return b === 0 ? 0 : a / b;
}
