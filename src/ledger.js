const fs = require('fs');
const path = require('path');

const LEDGER_PATH = process.env.LEDGER_PATH || path.join(__dirname, '..', 'ledger.ndjson');
let seq = 0;

function appendEntry(event) {
  seq += 1;
  const entry = {
    seq,
    receivedAt: new Date().toISOString(),
    id: event.id,
    type: event.type,
    amount: event.amount,
    currency: event.currency,
  };
  fs.appendFileSync(LEDGER_PATH, JSON.stringify(entry) + '\n');
  return entry;
}

module.exports = { appendEntry, LEDGER_PATH };
