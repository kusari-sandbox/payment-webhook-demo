require('dotenv').config();
const express = require('express');
const pino = require('pino');
const { verifySignature } = require('./verify');
const { appendEntry } = require('./ledger');
const { notify } = require('./notify');

const log = pino();
const app = express();

app.post('/webhook/payment', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.get('x-demo-signature');
  if (!verifySignature(req.body, signature)) {
    log.warn('rejected event: bad signature');
    return res.status(401).json({ error: 'invalid signature' });
  }
  const event = JSON.parse(req.body.toString('utf8'));
  const entry = appendEntry(event);
  log.info({ eventId: event.id, type: event.type, seq: entry.seq }, 'event recorded');
  notify(entry);
  res.status(202).json({ recorded: entry.seq });
});

const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, () => log.info(`payment-webhook-demo listening on ${port}`));
}

module.exports = { app };
