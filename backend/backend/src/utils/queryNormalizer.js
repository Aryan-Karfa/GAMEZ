/**
 * Basic normalization of query and title strings.
 * Lowercases, removes TM/R symbols, collapses punctuation into spaces, and collapses whitespace.
 */
export const normalize = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[™®]/g, '')
    .replace(/[:\-,\.!?;'"()\[\]]/g, ' ') // Replace punctuation with space
    .replace(/\s+/g, ' ')
    .trim();
};

const SUFFIXES = [
  "definitive edition",
  "complete edition",
  "game of the year edition",
  "game of the year",
  "ultimate edition",
  "directors cut",
  "gold edition",
  "enhanced edition",
  "legacy collection",
  "anniversary edition",
  "collection",
  "edition",
  "remastered",
  "remake",
  "hd",
  "goty"
];

/**
 * Strips release and edition suffixes from the end of a normalized string
 * to prevent mismatching base games.
 */
export const stripSuffixes = (normalizedText) => {
  let cleaned = normalizedText;
  let changed = true;
  
  while (changed) {
    changed = false;
    for (const suffix of SUFFIXES) {
      const regex = new RegExp(`\\b${suffix}$`, 'i');
      if (regex.test(cleaned)) {
        const nextCleaned = cleaned.replace(regex, '').trim();
        // Only strip if it doesn't empty the title completely (e.g. for a game called "Collection")
        if (nextCleaned.length > 0) {
          cleaned = nextCleaned;
          changed = true;
          break;
        }
      }
    }
  }
  
  return cleaned;
};
