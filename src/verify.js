const crypto = require('crypto');

const SECRET = process.env.WEBHOOK_SECRET || 'demo-secret-not-a-real-credential';

function sign(rawBody) {
  return crypto.createHmac('sha256', SECRET).update(rawBody).digest('hex');
}

function verifySignature(rawBody, signature) {
  if (!rawBody || !signature) return false;
  const expected = Buffer.from(sign(rawBody));
  const given = Buffer.from(signature);
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}

module.exports = { sign, verifySignature };
