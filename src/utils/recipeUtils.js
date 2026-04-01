export const fmtAmt = (amount, scale) => {
  const v = amount * scale;
  if (v === 0) return "";
  if (v === Math.floor(v)) return String(v);
  const frac = v - Math.floor(v);
  const fracs = [
    [0.25, "¼"],
    [0.33, "⅓"],
    [0.5, "½"],
    [0.67, "⅔"],
    [0.75, "¾"],
  ];
  for (const [f, s] of fracs) if (Math.abs(frac - f) < 0.05) return (Math.floor(v) || "") + s;
  return v.toFixed(1);
};

/** @typedef {{ text: string, ingredient?: object, formattedAmount?: string }} StepTextSegment */

export function annotateStep(text, ingredients, scale) {
  const noise = new Set(["את", "של", "עם", "על", "עד", "או", "לפי", "ללא", "כ", "הם", "הן", "זה", "זו", "יש", "לא"]);
  const entries = [];
  for (const ingredient of ingredients) {
    if (ingredient.amount === 0 && !ingredient.unit) continue;
    const tokens = ingredient.name
      .replace(/[()]/g, "")
      .split(/[\s,/]+/)
      .filter((token) => token.length >= 2 && !noise.has(token));
    for (const token of tokens) entries.push({ keyword: token, ingredient });
  }
  entries.sort((a, b) => b.keyword.length - a.keyword.length);
  const formatScaledAmount = (ingredient) => {
    if (ingredient.amount === 0) return ingredient.unit || "";
    const a = fmtAmt(ingredient.amount, scale);
    return ingredient.unit ? `${a} ${ingredient.unit}` : a;
  };
  const marked = new Array(text.length).fill(null);
  const matches = [];
  for (const { keyword, ingredient } of entries) {
    let pos = 0;
    while (pos < text.length) {
      const idx = text.indexOf(keyword, pos);
      if (idx === -1) break;
      const end = idx + keyword.length;
      let overlap = false;
      for (let i = idx; i < end; i++) {
        if (marked[i]) {
          overlap = true;
          break;
        }
      }
      if (!overlap) {
        for (let i = idx; i < end; i++) marked[i] = ingredient;
        matches.push({ start: idx, end, ingredient });
      }
      pos = idx + 1;
    }
  }
  if (matches.length === 0) return [{ text }];
  matches.sort((a, b) => a.start - b.start);
  /** @type {StepTextSegment[]} */
  const segments = [];
  let cursor = 0;
  for (const match of matches) {
    if (match.start > cursor) segments.push({ text: text.slice(cursor, match.start) });
    segments.push({
      text: text.slice(match.start, match.end),
      ingredient: match.ingredient,
      formattedAmount: formatScaledAmount(match.ingredient),
    });
    cursor = match.end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments;
}
