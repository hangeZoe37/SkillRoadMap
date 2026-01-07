export function tryParseJSON(raw) {
  if (!raw || typeof raw !== "string") return null;

  // 1. Strip code fences
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  let text = fenced ? fenced[1] : raw;

  // 2. Trim
  text = text.trim();

  // 3. Remove leading/trailing junk
  text = text.replace(/^[^{[]*/, "").replace(/[^}\]]*$/, "");

  // 4. First attempt (always try clean parse first)
  try {
    return JSON.parse(text);
  } catch {}

  // 5. Salvage outer JSON
  const firstArr = text.indexOf("[");
  const lastArr = text.lastIndexOf("]");
  const firstObj = text.indexOf("{");
  const lastObj = text.lastIndexOf("}");

  let candidate = null;

  if (firstArr !== -1 && lastArr !== -1) {
    candidate = text.slice(firstArr, lastArr + 1);
  } else if (firstObj !== -1 && lastObj !== -1) {
    candidate = text.slice(firstObj, lastObj + 1);
  } else {
    return null;
  }

  // 6. Minimal safe fixes only
  candidate = candidate
    .replace(/,(\s*[}\]])/g, "$1") // trailing commas
    .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":') // unquoted keys
    .replace(/\r?\n/g, " "); // newlines

  try {
    return JSON.parse(candidate);
  } catch (e) {
    console.error("JSON parse failed:", e.message);
    console.error("Problematic JSON:", candidate.slice(0, 500));
    return null;
  }
}
