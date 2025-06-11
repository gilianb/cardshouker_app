// json-to-csv.js
const fs = require('fs');
const { parse } = require('json2csv');
const path = require('path');

// Charger le fichier JSON brut
const raw = fs.readFileSync(path.join(__dirname, 'cards.json'), 'utf-8');
const cards = JSON.parse(raw);

// Transformer les données
const data = cards.map(card => {
  const id = card.passwords?.[0] || '';
  const name = card.text?.en?.name || '';
  const effect = card.text?.en?.effect || '';
  const cardType = card.cardType || '';
  const subcategory = card.subcategory || '';
  const sets = Array.isArray(card.sets) ? card.sets.join(', ') : '';

  return {
    id,
    name,
    effect,
    cardType,
    subcategory,
    sets
  };
});

// Définir les colonnes à exporter
const fields = ['id', 'name', 'effect', 'cardType', 'subcategory', 'sets'];
const opts = { fields };

try {
  const csv = parse(data, opts);
  fs.writeFileSync('cards.csv', csv, 'utf-8');
  console.log('✅ cards.csv successfully generated!');
} catch (err) {
  console.error('❌ Failed to generate CSV:', err);
}
