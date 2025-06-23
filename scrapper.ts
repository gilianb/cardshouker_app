import fs from 'fs';
import path from 'path';

// Path to your JSON file containing either a single set object or an array of sets
const INPUT_FILE = path.resolve(__dirname, 'sets.json');
// Output CSV file
const OUTPUT_FILE = path.resolve(__dirname, 'sets_cards.csv');

// Define types for parsing
interface CardEntry {
  id: string;        // version id within set
  card: string;      // actual card id (UUID)
  suffix?: string;   // old schema suffix (e.g. "001")
  number?: string;   // new schema full code (e.g. "KC01-EN000")
  rarity: string;    // rarity e.g. "common", "ultra"
}
interface ContentBlock {
  locales: string[];         // languages covered by this block
  editions: string[];        // edition keys e.g. ["unlimited"]
  cards: CardEntry[];
}
interface LocaleInfo {
  prefix?: string;           // e.g. "KC01-EN"
  editions?: string[];       // available editions keys
  cardImages?: Record<string, Record<string, string>>;  // mapping edition->(cardVersionId->imageUrl)
}
interface SetType {
  name?: { en?: string };
  locales?: Record<string, LocaleInfo>;
  contents?: ContentBlock[];
}

function main() {
  // Load and parse JSON
  let raw: string;
  try {
    raw = fs.readFileSync(INPUT_FILE, 'utf-8');
  } catch (err) {
    console.error(`Cannot read file ${INPUT_FILE}:`, err);
    process.exit(1);
  }

  let data: any;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error('Invalid JSON:', err);
    process.exit(1);
  }

  const sets: SetType[] = Array.isArray(data) ? data : [data];

  const headers = ['set_name', 'rarity', 'code', 'card_id', 'edition', 'image_url'];
  const lines: string[] = [headers.join(',')];

  for (const set of sets) {
    const setName = set.name?.en;
    const locales = set.locales;
    if (!setName || !locales || !locales.en) {
      console.warn('Skipping set missing English name or locale');
      continue;
    }

    const locale = locales.en;
    const prefix = locale.prefix || '';
    const localeEditions = locale.editions || [];
    if (localeEditions.length === 0) {
      console.warn(`Skipping set "${setName}": no editions defined for EN`);
      continue;
    }

    const editionKey = localeEditions[0];
    const imagesMap = locale.cardImages?.[editionKey] || {};

    const blocks = set.contents || [];
    // Only content blocks that include English
    const enBlocks = blocks.filter(b => Array.isArray(b.locales) && b.locales.includes('en'));

    if (enBlocks.length === 0) {
      console.warn(`No English content blocks for set "${setName}"`);
      continue;
    }

    for (const block of enBlocks) {
      for (const card of block.cards) {
        // Determine code: prefer full 'number', fallback to prefix+suffix
        const rawCode = card.number ?? `${prefix}${card.suffix ?? ''}`;
        const code = rawCode.toLowerCase();
        const imageUrl = imagesMap[card.id] || '';

        const row = [
          `"${setName.replace(/"/g, '""')}"`,
          card.rarity,
          code,
          card.card,
          editionKey,
          imageUrl,
        ].join(',');

        lines.push(row);
      }
    }
  }

  // Write CSV output
  try {
    fs.writeFileSync(OUTPUT_FILE, lines.join('\n'), 'utf-8');
    console.log(`CSV successfully generated at ${OUTPUT_FILE}`);
  } catch (err) {
    console.error('Error writing CSV file:', err);
    process.exit(1);
  }
}

main();
