const { test } = require('node:test');
const assert = require('node:assert');
const { app } = require('../src/server');
const { sign } = require('../src/verify');

test('accepts a signed event, rejects a bad signature', async () => {
  const server = app.listen(0);
  const url = `http://127.0.0.1:${server.address().port}/webhook/payment`;
  const body = JSON.stringify({
    id: 'evt_demo_1',
    type: 'payment.settled',
    amount: 1250,
    currency: 'USD',
  });

  const accepted = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-demo-signature': sign(Buffer.from(body)) },
    body,
  });
  assert.strictEqual(accepted.status, 202);
  assert.strictEqual((await accepted.json()).recorded, 1);

  const rejected = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-demo-signature': 'deadbeef' },
    body,
  });
  assert.strictEqual(rejected.status, 401);

  server.close();
});
