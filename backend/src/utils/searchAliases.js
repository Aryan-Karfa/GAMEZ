const aliases = {
  gta: "grand theft auto",
  rdr: "red dead redemption",
  rdr2: "red dead redemption 2",
  gow: "god of war",
  mw: "modern warfare",
  mw2: "modern warfare 2",
  mw3: "modern warfare 3",
  bo: "black ops",
  bo2: "black ops 2",
  bo3: "black ops 3",
  cs: "counter strike",
  csgo: "counter strike global offensive",
  pubg: "playerunknown's battlegrounds",
  ac: "assassin's creed",
  ds: "dark souls",
  er: "elden ring",
  cp2077: "cyberpunk 2077",
};

/**
 * Expands abbreviations and slang words in the query.
 * Handles both full-string alias matches and word-by-word substitution.
 */
export const expandAlias = (query) => {
  if (!query) return '';
  
  const trimmed = query.trim();
  const lowercaseQuery = trimmed.toLowerCase();
  
  // 1. Direct full-string match (e.g. "gta v" doesn't match directly here, but "rdr2" does)
  const cleanFullQuery = lowercaseQuery.replace(/[™®:\-,\.!?;']/g, '').replace(/\s+/g, '');
  if (aliases[cleanFullQuery]) {
    return aliases[cleanFullQuery];
  }
  
  // 2. Word-by-word expansion (e.g. "gta v" -> "grand theft auto v")
  const words = trimmed.split(/\s+/);
  const expanded = words.map(word => {
    const cleanWord = word.toLowerCase().replace(/[™®:\-,\.!?;']/g, '');
    return aliases[cleanWord] || word;
  });
  
  return expanded.join(' ');
};
