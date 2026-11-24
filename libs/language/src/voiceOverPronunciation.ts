/**
 * Mapping of text strings to their pronunciation equivalents for accessibility.
 * When text matches a key in this map, the corresponding value will be used for VoiceOver/TalkBack.
 * Keys are stored in lowercase for case-insensitive matching.
 */
let pronunciationMap: Record<string, string> = {};

function createPronunciationMap(
  pronunciationData: Record<string, string>,
  basePronunciationMap: Record<string, string> = {},
): Record<string, string> {
  return Object.entries(pronunciationData).reduce<Record<string, string>>(
    (accumulator, [key, value]) => {
      if (!key) {
        return accumulator;
      }

      accumulator[key.toLowerCase()] = value;
      return accumulator;
    },
    {...basePronunciationMap},
  );
}

/**
 * Stores pronunciation mappings in module-local state.
 * Only string values are kept and keys are normalized to lowercase.
 *
 * @param pronunciationData - Parsed pronunciation key/value map.
 */
export function setupVoiceOverPronunciation(
  pronunciationData: Record<string, string>,
): void {
  pronunciationMap = createPronunciationMap(pronunciationData);
}

/**
 * Strips markdown link syntax so screen readers don't pause on the brackets or read the link target.
 * `[privacy policy](onPrivacyPolicyPressed)` becomes `privacy policy`.
 *
 * @param text - The markdown text to clean.
 * @returns The text with link targets and the brackets of markdown links removed; other square brackets are kept.
 */
function stripMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
}

/**
 * Searches through the provided text for any pronunciation mappings and replaces them with accessible pronunciations.
 * Matching is case-insensitive. Markdown link syntax is also stripped (see {@link stripMarkdownLinks}).
 *
 * @param text - The text to check for pronunciation mappings.
 * @param localPronunciationOverrides - Pronunciation mappings to use for this call only.
 * @returns A new string with pronunciation replacements or markdown stripped if any changes are made, null otherwise.
 */
export function getVoiceOverPronunciation(
  text: string,
  localPronunciationOverrides?: Record<string, string>,
): string | null {
  let modifiedText = stripMarkdownLinks(text);
  let hasReplacements = modifiedText !== text;
  const pronunciationEntries = Object.entries(
    createPronunciationMap(localPronunciationOverrides ?? {}, pronunciationMap),
  );

  for (const [key, pronunciation] of pronunciationEntries) {
    // Escape special regex characters in the key
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // \b only works next to a word character, so skip it when the key starts/ends
    // with a symbol (e.g. "reboxed®"), otherwise the match fails before a space or end of string
    const startBoundary = /^\w/.test(key) ? '\\b' : '(?<!\\w)';
    const endBoundary = /\w$/.test(key) ? '\\b' : '(?!\\w)';
    const regex = new RegExp(
      `${startBoundary}${escapedKey}${endBoundary}`,
      'gi',
    );

    if (regex.test(modifiedText)) {
      hasReplacements = true;
      regex.lastIndex = 0;
      modifiedText = modifiedText.replace(regex, pronunciation);
    }
  }

  return hasReplacements ? modifiedText : null;
}
