export function tryParseJSON(raw) {
  if (!raw || typeof raw !== "string") return null;

  // strip code fences ```json ... ```
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  let text = fenced ? fenced[1] : raw;

  // Clean up common issues
  text = text.trim();
  
  // Remove any leading/trailing non-JSON text
  text = text.replace(/^[^{[]*/, '').replace(/[^}\]]*$/, '');

  // attempt direct parse
  try {
    return JSON.parse(text);
  } catch {}

  // try to salvage by trimming to the outermost JSON array/object
  const firstObj = text.indexOf("{");
  const lastObj = text.lastIndexOf("}");
  const firstArr = text.indexOf("[");
  const lastArr = text.lastIndexOf("]");

  const haveObj = firstObj !== -1 && lastObj !== -1;
  const haveArr = firstArr !== -1 && lastArr !== -1;

  let candidate = haveArr
    ? text.slice(firstArr, lastArr + 1)
    : haveObj
    ? text.slice(firstObj, lastObj + 1)
    : text;

  // Try to fix common JSON issues
  candidate = fixCommonJSONIssues(candidate);

  try {
    return JSON.parse(candidate);
  } catch (e) {
    console.error("JSON parse failed:", e.message);
    console.error("Problematic JSON:", candidate.substring(0, 500) + "...");
    return null;
  }
}

// Helper function to fix common JSON issues
function fixCommonJSONIssues(jsonString) {
  // Fix trailing commas
  jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
  
  // Fix missing quotes around keys
  jsonString = jsonString.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
  
  // Fix single quotes to double quotes
  jsonString = jsonString.replace(/'/g, '"');
  
  // Fix unescaped quotes in strings
  jsonString = jsonString.replace(/"([^"]*)"([^"]*)"([^"]*)"/g, '"$1\\"$2\\"$3"');
  
  return jsonString;
}
