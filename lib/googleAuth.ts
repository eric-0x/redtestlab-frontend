import { JWT } from "google-auth-library"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sa = require("@/utils/splendid-watch-440103-j6-37a29fdded68.json")

// Server-side helper to fetch an access token using a service account JSON keyfile.
// Place your key at `secrets/service-account.json` (never commit it).
function base64url(input: Buffer | string): string {
  const buff = Buffer.isBuffer(input) ? input : Buffer.from(input)
  return buff.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

async function fetchTokenManually(scopes: string[], clientEmail: string, privateKey: string, tokenUri: string): Promise<string> {
  const header = { alg: "RS256", typ: "JWT" }
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + 3600
  const payload = {
    iss: clientEmail,
    scope: scopes.join(" "),
    aud: tokenUri,
    exp,
    iat,
  }

  const encodedHeader = base64url(JSON.stringify(header))
  const encodedPayload = base64url(JSON.stringify(payload))
  const signingInput = `${encodedHeader}.${encodedPayload}`

  const crypto = await import("node:crypto")
  const signer = crypto.createSign("RSA-SHA256")
  signer.update(signingInput)
  signer.end()
  const signature = signer.sign(privateKey)
  const encodedSignature = base64url(signature)
  const assertion = `${signingInput}.${encodedSignature}`

  const res = await fetch(tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }).toString(),
  })
  const raw = await res.text()
  let data: any = undefined
  try { data = JSON.parse(raw) } catch {}
  if (!res.ok) {
    console.error("Manual token exchange failed", {
      status: res.status,
      statusText: res.statusText,
      data,
      raw,
    })
    throw new Error(`Manual token exchange failed: ${res.status} ${res.statusText}`)
  }
  if (!data?.access_token) {
    console.error("Manual token exchange missing access_token", { raw, data })
    throw new Error("Manual token exchange did not return access_token")
  }
  return data.access_token as string
}

export async function getAccessToken(): Promise<string> {
  const normalizedKey = (sa.private_key as string).includes("\\n")
    ? (sa.private_key as string).replace(/\\n/g, "\n")
    : (sa.private_key as string)

  // Always mint a fresh access token via manual JWT exchange to avoid stale/cached tokens
  try {
    const token = await fetchTokenManually(
      [
        "https://www.googleapis.com/auth/cloud-platform",
      ],
      sa.client_email,
      normalizedKey,
      sa.token_uri || "https://oauth2.googleapis.com/token"
    )
    return token
  } catch (err: any) {
    console.error("Manual token exchange error:", {
      message: err?.message,
      name: err?.name,
      code: err?.code,
      stack: err?.stack,
    })
    throw err
  }
}


