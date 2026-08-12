# payment-webhook-demo

A deliberately small payment-webhook service built as the companion example for a
published guide on software supply chain security for software consumers. This is a
demonstration/test repository supporting that article, and nothing more.

**Not for production use.**

## What it does

One Express endpoint (`POST /webhook/payment`) receives synthetic payment events,
verifies an HMAC signature, appends the event to a local ledger file, and sends a
best-effort notification to a fixed URL. There is no real financial data anywhere in
this repository, and none should ever be sent to it.

## Maintenance stance

Pinned on purpose; this is a museum piece. Dependencies are not updated. In
particular, `node-fetch` is pinned to `2.6.6`, a version with a known, publicly
documented vulnerability (CVE-2022-0235). That is intentional: the guide walks
readers through discovering and fixing it. The vulnerability is not practically
exploitable in this service as written - the outbound call goes to one fixed URL,
sends no credentials, and refuses redirects - but do not reuse this dependency
set anywhere real.

## Build and run

Requires Node.js 20 or later.

```
npm ci
npm test
npm start
```

`npm ci` prints a one-line postinstall notice. That script exists to demonstrate
install-time code execution for the guide; it does nothing else.

To send a signed test event to a running server:

```
BODY='{"id":"evt_demo_1","type":"payment.settled","amount":1250,"currency":"USD"}'
SIG=$(node -e "process.stdout.write(require('./src/verify').sign(Buffer.from(process.argv[1])))" "$BODY")
curl -X POST http://127.0.0.1:3000/webhook/payment \
  -H "content-type: application/json" \
  -H "x-demo-signature: $SIG" \
  -d "$BODY"
```

## Releases

Each release publishes a CycloneDX SBOM (`payment-webhook-demo.cdx.json`) generated
by [waybill](https://github.com/kusari-oss/waybill), with a GitHub artifact
attestation covering it. Verify with:

```
gh attestation verify payment-webhook-demo.cdx.json -R kusari-sandbox/payment-webhook-demo
```

## The open demonstration PR

This repository keeps one pull request open on purpose. It is titled
`DEMO - DO NOT MERGE` and stages a bad dependency change so the guide can show a
PR-time review gate catching it. Do not merge it. Everything in that PR references
real, published packages; nothing in this repository is or contains malicious code.

## License

Apache-2.0
