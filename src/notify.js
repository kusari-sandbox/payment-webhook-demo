const fetch = require('node-fetch');

// Fixed destination on purpose: no user input reaches this URL, no auth
// headers are sent, and redirects are refused. See the README's note on
// the intentionally pinned node-fetch version.
const NOTIFY_URL = 'https://httpbin.org/status/204';

function notify(entry) {
  return fetch(NOTIFY_URL, {
    method: 'POST',
    redirect: 'error',
    timeout: 3000,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ seq: entry.seq, type: entry.type }),
  }).catch(() => {
    // Best-effort in this demo; delivery failures are ignored.
  });
}

module.exports = { notify, NOTIFY_URL };
